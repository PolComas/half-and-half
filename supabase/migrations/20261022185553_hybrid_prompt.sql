-- Existing attempts keep their original prompt version; only new reservations change.
alter table public.generation_attempts alter column prompt_version set default 'hybrid-coloring-v2';
