-- Slice 3. Finals and results remain private; browser roles gain no permissions.
alter table public.rooms drop constraint rooms_phase_check;
alter table public.rooms add constraint rooms_phase_check check(phase in ('waiting_partner','ideas','generating','painting','composing','revealed','generation_failed','generation_uncertain','generation_exhausted','budget_blocked'));
alter table public.rooms add column result_path text, add column result_hash text;
alter table public.rooms add constraint rooms_result_check check((result_path is null and result_hash is null) or (phase='revealed' and result_path is not null and result_hash is not null and result_hash ~ '^[a-f0-9]{64}$'));
alter table public.participants add column commit_id uuid, add column final_hash text, add column final_path text, add column final_revision bigint, add column final_base_id uuid, add column finished_at timestamptz;
alter table public.participants add constraint participants_final_check check(
 (commit_id is null and final_hash is null and final_path is null and final_revision is null and final_base_id is null and finished_at is null) or
 (commit_id is not null and final_hash is not null and final_revision is not null and final_hash ~ '^[a-f0-9]{64}$' and final_path is not null and final_revision>=0 and final_base_id is not null and finished_at is not null)
);
alter table public.generation_attempts alter column prompt_version set default 'hybrid-coloring-v3';

create or replace function public.hh_state(p_token_hash text) returns jsonb
language sql stable security invoker set search_path='' as $$
 select jsonb_build_object(
  'roomId',r.id,'code',r.code,'version',r.version,'phase',r.phase,'side',p.side,'participantId',p.id,
  'idea',p.idea,'confirmed',p.confirmed,'finished',p.finished_at is not null,
  'partnerFinished',exists(select 1 from public.participants q where q.room_id=r.id and q.id<>p.id and q.finished_at is not null),
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

create function public.hh_commit_final(p_token_hash text,p_base_id uuid,p_commit_id uuid,p_hash text,p_revision bigint)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare p public.participants; r public.rooms;
begin
 select * into p from public.participants where token_hash=p_token_hash;
 if p.id is null then raise exception 'room_missing'; end if;
 select * into r from public.rooms where id=p.room_id for update;
 select * into p from public.participants where id=p.id for update;
 if r.expires_at<=now() then raise exception 'room_expired'; end if;
 if p.finished_at is not null then
  if p.commit_id=p_commit_id and p.final_hash=p_hash and p.final_revision=p_revision and p.final_base_id=p_base_id then return public.hh_state(p_token_hash); end if;
  raise exception 'final_conflict';
 end if;
 if r.phase<>'painting' or r.base_id is distinct from p_base_id then raise exception 'phase_conflict'; end if;
 if p_commit_id is null or p_hash is null or p_hash !~ '^[a-f0-9]{64}$' or p_revision is null or p_revision<0 then raise exception 'invalid_final'; end if;
 update public.participants set commit_id=p_commit_id,final_hash=p_hash,final_revision=p_revision,final_base_id=p_base_id,finished_at=now(),
  final_path='finals/'||r.id||'/'||p.id||'/'||p_commit_id||'-'||p_hash||'.png' where id=p.id;
 update public.rooms set version=version+1,phase=case when (select count(*) from public.participants q where q.room_id=r.id and q.finished_at is not null and q.final_base_id=r.base_id)=2 then 'composing' else 'painting' end where id=r.id;
 return public.hh_state(p_token_hash);
end $$;

create function public.hh_final_manifest(p_room_id uuid) returns jsonb
language sql stable security invoker set search_path='' as $$
 select jsonb_build_object('baseId',r.base_id,'phase',r.phase,'resultPath',r.result_path,'resultHash',r.result_hash,
 'finals',(select coalesce(jsonb_agg(jsonb_build_object('participantId',p.id,'side',p.side,'baseId',p.final_base_id,'hash',p.final_hash,'path',p.final_path) order by p.side),'[]'::jsonb) from public.participants p where p.room_id=r.id and p.finished_at is not null))
 from public.rooms r where r.id=p_room_id and r.expires_at>now()
$$;

create function public.hh_publish_result(p_room_id uuid,p_base_id uuid,p_left_hash text,p_right_hash text,p_result_hash text) returns boolean
language plpgsql security invoker set search_path='' as $$
declare r public.rooms;
begin
 select * into r from public.rooms where id=p_room_id for update;
 if r.id is null or r.expires_at<=now() or r.base_id is distinct from p_base_id or r.phase not in ('composing','revealed') then raise exception 'phase_conflict'; end if;
 if p_result_hash is null or p_result_hash !~ '^[a-f0-9]{64}$' or not exists(select 1 from public.participants p where p.room_id=r.id and p.side='left' and p.final_base_id=r.base_id and p.final_hash=p_left_hash and p.finished_at is not null) or not exists(select 1 from public.participants p where p.room_id=r.id and p.side='right' and p.final_base_id=r.base_id and p.final_hash=p_right_hash and p.finished_at is not null) then raise exception 'invalid_final'; end if;
 if r.phase='revealed' then
  if r.result_hash is distinct from p_result_hash then raise exception 'final_conflict'; end if;
  return true;
 end if;
 update public.rooms set phase='revealed',result_path='results/'||p_base_id||'/'||p_left_hash||'-'||p_right_hash||'.png',result_hash=p_result_hash,version=version+1 where id=r.id;
 return true;
end $$;

create function public.hh_pending_compositions() returns jsonb
language sql stable security invoker set search_path='' as $$
 select coalesce(jsonb_agg(id),'[]'::jsonb) from public.rooms where phase='composing' and expires_at>now()
$$;
revoke all on function public.hh_commit_final(text,uuid,uuid,text,bigint),public.hh_final_manifest(uuid),public.hh_publish_result(uuid,uuid,text,text,text),public.hh_pending_compositions() from public,anon,authenticated;
grant execute on function public.hh_commit_final(text,uuid,uuid,text,bigint),public.hh_final_manifest(uuid),public.hh_publish_result(uuid,uuid,text,text,text),public.hh_pending_compositions() to service_role;
