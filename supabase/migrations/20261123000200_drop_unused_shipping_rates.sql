-- ============================================================================
-- Remove the unused shipping_rates table from the Swiftora project.
--
-- Nothing in the application reads or writes shipping_rates. This migration
-- refuses to drop the table if it somehow contains rows, so it cannot silently
-- destroy data.
-- ============================================================================

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'shipping_rates'
  ) then
    if exists (select 1 from public.shipping_rates limit 1) then
      raise exception
        'shipping_rates contains rows; review it manually before dropping';
    end if;

    drop table public.shipping_rates;
  end if;
end $$;
