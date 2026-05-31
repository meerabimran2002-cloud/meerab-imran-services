create or replace function public.claim_admin_if_first()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  has_any boolean;
begin
  if auth.uid() is null then
    return false;
  end if;
  select exists(select 1 from public.user_roles where role = 'admin') into has_any;
  if has_any then
    return false;
  end if;
  insert into public.user_roles (user_id, role) values (auth.uid(), 'admin')
    on conflict do nothing;
  return true;
end;
$$;

grant execute on function public.claim_admin_if_first() to authenticated;