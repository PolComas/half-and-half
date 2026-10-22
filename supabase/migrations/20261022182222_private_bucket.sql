-- No anon/authenticated storage policies: every read/write goes through Node.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('half-and-half-private','half-and-half-private',false,25165824,array['image/png'])
on conflict(id) do update set public=false,file_size_limit=25165824,allowed_mime_types=array['image/png'];
