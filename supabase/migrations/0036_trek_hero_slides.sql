-- NULL keeps the gallery-based slider for treks without a custom selection.
-- An empty array shows only the main hero image.
alter table public.treks add column if not exists hero_slides text[];
