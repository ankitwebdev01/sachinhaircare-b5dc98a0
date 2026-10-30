-- Allow signed-in salon admins to upload and manage files in the private 'media' bucket.
-- Files are served publicly through the /api/public/media/* server route (signed URLs).
create policy "Salon admins can upload media"
on storage.objects for insert to authenticated
with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

create policy "Salon admins can update media"
on storage.objects for update to authenticated
using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

create policy "Salon admins can delete media"
on storage.objects for delete to authenticated
using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
