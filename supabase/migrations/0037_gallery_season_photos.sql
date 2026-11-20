-- Existing albums keep their template photos until staff save seasonal photos.
alter table public.gallery_albums add column if not exists season_photos jsonb;
alter table public.gallery_albums alter column season_photos set default '{}'::jsonb;
