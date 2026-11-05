-- 0034_reviews_app.sql
-- Customer-reviews application layer.
--
-- The reviews table + public/staff RLS already exist (0005_decisions.sql):
--   reviews_read  = status='published' or is_staff()
--   reviews_staff = is_staff() (all)
-- Submissions, edits and moderation all go through service-role server actions
-- (src/app/(site)/user-dashboard/reviewActions.ts, src/app/admin/reviews/actions.ts),
-- so the service role already covers writes. The one gap is letting a signed-in
-- customer READ THEIR OWN review (including while pending/rejected) so the
-- dashboard can show its state and offer "Edit".
--
-- Moderation maps onto the existing content_status enum ('draft','published',
-- 'archived') — no enum change:
--   pending  = draft      (default on submit)
--   approved = published  (+ published_at set)
--   rejected = archived   (hidden from public, author still sees it)

-- Denormalised author display name, captured from the booking's contact at submit
-- time, so public trek pages can show the reviewer's name WITHOUT exposing the
-- profiles table (which is not publicly readable).
alter table reviews add column if not exists author_name text;

-- Author can see their own reviews in any status. OR'd with reviews_read, so a
-- customer sees their own pending/rejected rows plus everyone's published ones.
drop policy if exists reviews_author_read_own on reviews;
create policy reviews_author_read_own on reviews
  for select using (user_id = auth.uid());
