alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.advisories enable row level security;
alter table public.advisory_messages enable row level security;
alter table public.advisory_feedback enable row level security;

-- PROFILES: a user can read and update only their own profile
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
-- inserts are performed by the security-definer trigger only

-- FARMS: full CRUD on own rows
create policy "farms_select_own" on public.farms
  for select to authenticated using (user_id = auth.uid());
create policy "farms_insert_own" on public.farms
  for insert to authenticated with check (user_id = auth.uid());
create policy "farms_update_own" on public.farms
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "farms_delete_own" on public.farms
  for delete to authenticated using (user_id = auth.uid());

-- ADVISORIES: read, insert, delete own rows; no updates from clients
create policy "advisories_select_own" on public.advisories
  for select to authenticated using (user_id = auth.uid());
create policy "advisories_insert_own" on public.advisories
  for insert to authenticated with check (
    user_id = auth.uid()
    and (farm_id is null or exists (
      select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()
    ))
  );
create policy "advisories_delete_own" on public.advisories
  for delete to authenticated using (user_id = auth.uid());

-- MESSAGES: only for advisories the user owns
create policy "messages_select_own" on public.advisory_messages
  for select to authenticated using (user_id = auth.uid());
create policy "messages_insert_own" on public.advisory_messages
  for insert to authenticated with check (
    user_id = auth.uid()
    and exists (select 1 from public.advisories a where a.id = advisory_id and a.user_id = auth.uid())
  );
create policy "messages_delete_own" on public.advisory_messages
  for delete to authenticated using (user_id = auth.uid());

-- FEEDBACK
create policy "feedback_select_own" on public.advisory_feedback
  for select to authenticated using (user_id = auth.uid());
create policy "feedback_insert_own" on public.advisory_feedback
  for insert to authenticated with check (
    user_id = auth.uid()
    and exists (select 1 from public.advisories a where a.id = advisory_id and a.user_id = auth.uid())
  );
create policy "feedback_update_own" on public.advisory_feedback
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "feedback_delete_own" on public.advisory_feedback
  for delete to authenticated using (user_id = auth.uid());

-- Revoke default privileges from anon
revoke all on public.profiles, public.farms, public.advisories,
  public.advisory_messages, public.advisory_feedback from anon;
