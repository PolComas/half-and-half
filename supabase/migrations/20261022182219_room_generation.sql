-- Slice 1. No browser role has table/function access. All participant authorization
-- is performed by the server; SQL additionally binds commands to the token hash.
create table public.demo_budget (
 id integer primary key check (id=1), requests_used integer not null default 0,
 max_requests integer not null default 20 check(max_requests between 0 and 20),
 reservation_usd numeric(6,2) not null default 0.25,
 ceiling_usd numeric(6,2) not null default 5.00,
 check(requests_used>=0)
);
insert into public.demo_budget(id) values(1);
create table public.rooms (
 id uuid primary key default gen_random_uuid(), code text not null unique,
 version integer not null default 0,
 phase text not null default 'waiting_partner' check(phase in ('waiting_partner','ideas','generating','painting','generation_failed','generation_uncertain','generation_exhausted','budget_blocked')),
 created_at timestamptz not null default now(),
 join_expires_at timestamptz not null default now()+interval '24 hours',
 expires_at timestamptz not null default now()+interval '14 days',
 base_id uuid, base_manifest jsonb,
 check(code ~ '^[A-HJ-NP-Z2-9]{6}$')
);
create table public.participants (
 id uuid primary key default gen_random_uuid(), room_id uuid not null references public.rooms(id),
 side text not null check(side in ('left','right')), token_hash text not null unique check(token_hash ~ '^[a-f0-9]{64}$'),
 idea text not null default '' check(char_length(idea)<=300), confirmed boolean not null default false,
 last_operation uuid, unique(room_id,side), check(not confirmed or char_length(btrim(idea))>0)
);
create index participants_room_id_idx on public.participants(room_id);
create table public.generation_attempts (
 id uuid primary key default gen_random_uuid(), room_id uuid not null references public.rooms(id),
 ordinal integer not null check(ordinal between 1 and 3),
 state text not null default 'reserved' check(state in ('reserved','sending','preparing','succeeded','failed','uncertain')),
 ideas jsonb not null, model text not null default 'gpt-image-2.5-flare-2026-09-08',
 prompt_version text not null default 'coloring-v1', executor uuid,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 usage jsonb, error_code text, unique(room_id,ordinal)
);
create index generation_attempts_room_id_idx on public.generation_attempts(room_id);
create unique index one_unresolved_attempt on public.generation_attempts(room_id)
 where state in ('reserved','sending','preparing','uncertain');

create function public.hh_state(p_token_hash text) returns jsonb
language sql stable security invoker set search_path='' as $$
 select jsonb_build_object(
  'roomId',r.id,'code',r.code,'version',r.version,'phase',r.phase,'side',p.side,'participantId',p.id,
  'idea',p.idea,'confirmed',p.confirmed,
  'partnerPresent',exists(select 1 from public.participants q where q.room_id=r.id and q.id<>p.id),
  'partnerConfirmed',coalesce((select q.confirmed from public.participants q where q.room_id=r.id and q.id<>p.id),false),
  'attemptsUsed',(select count(*) from public.generation_attempts a where a.room_id=r.id),
  'attemptsLeft',3-(select count(*) from public.generation_attempts a where a.room_id=r.id),
  'baseId',r.base_id,
  'ideas',case when r.base_id is not null then (select a.ideas from public.generation_attempts a where a.id=r.base_id) else null end,
  'generationAvailable',(select b.requests_used<b.max_requests and (b.requests_used+1)*b.reservation_usd<=b.ceiling_usd from public.demo_budget b where b.id=1)
 ) from public.participants p join public.rooms r on r.id=p.room_id
 where p.token_hash=p_token_hash and r.expires_at>now()
$$;

create function public.hh_room_command(p_token_hash text,p_action text,p_payload jsonb,p_allow_generation boolean default false)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
 r public.rooms; p public.participants; budget public.demo_budget;
 op uuid; expected integer; text_idea text; n integer; ideas_snapshot jsonb;
begin
 if p_token_hash !~ '^[a-f0-9]{64}$' then raise exception 'invalid_session'; end if;
 -- Consistent lock order across all mutation paths. Never hold it during HTTP.
 select * into budget from public.demo_budget where id=1 for update;
 perform pg_advisory_xact_lock(hashtext(p_token_hash));
 select * into p from public.participants where token_hash=p_token_hash;
 if p_action in ('create','join') then
  if p.id is not null then
   if public.hh_state(p_token_hash) is null then raise exception 'room_expired'; end if;
   return public.hh_state(p_token_hash);
  end if;
  if p_action='create' then
   insert into public.rooms(code) values(p_payload->>'code') returning * into r;
   insert into public.participants(room_id,side,token_hash) values(r.id,'left',p_token_hash);
  else
   select * into r from public.rooms where code=p_payload->>'code' for update;
   if r.id is null or r.join_expires_at<=now() or r.expires_at<=now() then raise exception 'room_unavailable'; end if;
   if r.phase<>'waiting_partner' or exists(select 1 from public.participants where room_id=r.id and side='right') then raise exception 'room_full'; end if;
   insert into public.participants(room_id,side,token_hash) values(r.id,'right',p_token_hash);
   update public.rooms set phase='ideas',version=version+1 where id=r.id;
  end if;
  return public.hh_state(p_token_hash);
 end if;
 if p.id is null then raise exception 'room_missing'; end if;
 select * into r from public.rooms where id=p.room_id for update;
 if r.expires_at<=now() then raise exception 'room_expired'; end if;
 op:=(p_payload->>'operationId')::uuid;
 if op is null then raise exception 'operation_required'; end if;
 if p.last_operation=op then return public.hh_state(p_token_hash); end if;
 expected:=(p_payload->>'expectedVersion')::integer;
 if expected is null or expected<>r.version then raise exception 'version_conflict'; end if;
 if r.phase not in ('waiting_partner','ideas','generation_failed') then raise exception 'phase_conflict'; end if;
 if p_action='save' then
  if p.confirmed then raise exception 'idea_confirmed'; end if;
  text_idea:=btrim(p_payload->>'text');
  if text_idea is null or char_length(text_idea)>300 then raise exception 'invalid_idea'; end if;
  update public.participants set idea=text_idea where id=p.id;
 elsif p_action='edit' then
  update public.participants set confirmed=false where id=p.id;
  update public.rooms set phase=case when exists(select 1 from public.participants q where q.room_id=r.id and q.id<>p.id) then 'ideas' else 'waiting_partner' end where id=r.id;
 elsif p_action='confirm' then
  if char_length(btrim(p.idea))=0 then raise exception 'empty_idea'; end if;
  update public.participants set confirmed=true where id=p.id;
 elsif p_action='retry' then
  if r.phase<>'generation_failed' then raise exception 'phase_conflict'; end if;
 else raise exception 'invalid_action';
 end if;
 if p_action in ('confirm','retry') and (select count(*) from public.participants q where q.room_id=r.id and q.confirmed)=2 then
  if not p_allow_generation then raise exception 'generation_disabled'; end if;
  select count(*) into n from public.generation_attempts a where a.room_id=r.id;
  if n>=3 then
   update public.rooms set phase='generation_exhausted' where id=r.id;
  elsif budget.requests_used>=budget.max_requests or (budget.requests_used+1)*budget.reservation_usd>budget.ceiling_usd then
   update public.rooms set phase='budget_blocked' where id=r.id;
  else
   select jsonb_object_agg(q.side,q.idea) into ideas_snapshot from public.participants q where q.room_id=r.id;
   insert into public.generation_attempts(room_id,ordinal,ideas) values(r.id,n+1,ideas_snapshot);
   update public.demo_budget set requests_used=requests_used+1 where id=1;
   update public.rooms set phase='generating' where id=r.id;
  end if;
 end if;
 update public.participants set last_operation=op where id=p.id;
 update public.rooms set version=version+1 where id=r.id;
 return public.hh_state(p_token_hash);
end $$;

create function public.hh_claim_attempt(p_attempt_id uuid,p_executor uuid) returns jsonb
language sql volatile security invoker set search_path='' as $$
 with claimed as (
  update public.generation_attempts set state='sending',executor=p_executor,updated_at=now()
  where id=p_attempt_id and state='reserved' returning *
 ) select to_jsonb(claimed) from claimed
$$;

create function public.hh_publish_base(p_attempt_id uuid,p_manifest jsonb,p_usage jsonb default null)
returns boolean language plpgsql security invoker set search_path='' as $$
declare a public.generation_attempts; r public.rooms;
begin
 select * into a from public.generation_attempts where id=p_attempt_id;
 if a.id is null then raise exception 'attempt_missing'; end if;
 select * into r from public.rooms where id=a.room_id for update;
 select * into a from public.generation_attempts where id=p_attempt_id for update;
 if r.base_id=a.id and a.state='succeeded' then return true; end if;
 if r.base_id is not null or a.state not in ('sending','preparing','uncertain') then raise exception 'phase_conflict'; end if;
 if (p_manifest->>'width')::integer<>1024 or (p_manifest->>'height')::integer<>1024 or p_manifest->>'baseHash' is null then raise exception 'invalid_manifest'; end if;
 update public.generation_attempts set state='succeeded',usage=p_usage,error_code=null,updated_at=now() where id=a.id;
 update public.rooms set base_id=a.id,base_manifest=p_manifest,phase='painting',version=version+1 where id=r.id;
 return true;
end $$;

create function public.hh_fail_attempt(p_attempt_id uuid,p_uncertain boolean,p_error_code text)
returns void language plpgsql security invoker set search_path='' as $$
declare a public.generation_attempts; n integer;
begin
 select * into a from public.generation_attempts where id=p_attempt_id;
 perform 1 from public.rooms where id=a.room_id for update;
 select * into a from public.generation_attempts where id=p_attempt_id for update;
 if a.state='succeeded' then return; end if;
 select count(*) into n from public.generation_attempts where room_id=a.room_id;
 update public.generation_attempts set state=case when p_uncertain then 'uncertain' else 'failed' end,error_code=p_error_code,updated_at=now() where id=a.id;
 update public.rooms set phase=case when p_uncertain then 'generation_uncertain' when n>=3 then 'generation_exhausted' else 'generation_failed' end,version=version+1 where id=a.room_id;
end $$;

alter table public.rooms enable row level security;
alter table public.participants enable row level security;
alter table public.generation_attempts enable row level security;
alter table public.demo_budget enable row level security;
revoke all on public.rooms,public.participants,public.generation_attempts,public.demo_budget from public,anon,authenticated;
grant select,insert,update on public.rooms,public.participants,public.generation_attempts,public.demo_budget to service_role;
revoke all on function public.hh_state(text),public.hh_room_command(text,text,jsonb,boolean),public.hh_claim_attempt(uuid,uuid),public.hh_publish_base(uuid,jsonb,jsonb),public.hh_fail_attempt(uuid,boolean,text) from public,anon,authenticated;
grant execute on function public.hh_state(text),public.hh_room_command(text,text,jsonb,boolean),public.hh_claim_attempt(uuid,uuid),public.hh_publish_base(uuid,jsonb,jsonb),public.hh_fail_attempt(uuid,boolean,text) to service_role;
