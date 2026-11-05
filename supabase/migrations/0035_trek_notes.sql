-- 0035_trek_notes.sql
-- Per-trek "Important Note" lines, editable in the admin trek form and shown in
-- the Trek Cost sidebar's Important Note modal. Mirrors not_to_miss (text[]).
alter table treks add column if not exists notes text[] not null default '{}';
