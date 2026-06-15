-- Rostr seed — demo data matching /screens
-- Idempotent: clears and re-seeds. Run after schema.sql.
-- IDs are stable so presentational-fixtures.ts can key off them.

truncate campaigns, locations, staff cascade;

-- ─── Campaigns ───────────────────────────────────────────────────────────────
insert into campaigns (id, name, client_name, start_date, end_date) values
  ('bb000000-0000-0000-0000-000000000001', 'Winter Oat Bites Launch',         'Nourish Foods Australia', '2026-06-01', '2026-07-31'),
  ('bb000000-0000-0000-0000-000000000002', 'Coca Cola Summer',                'Coca-Cola Australia',     '2026-06-01', '2026-08-31'),
  ('bb000000-0000-0000-0000-000000000003', 'Frozen Fresh Trial',               'Simplot Australia',       '2026-06-10', '2026-07-10'),
  ('bb000000-0000-0000-0000-000000000004', 'Summer Hydration Sampling',       'PepsiCo Australia',       '2026-06-01', '2026-09-01'),
  ('bb000000-0000-0000-0000-000000000005', 'Healthy Breakfast Product Launch', 'Sanitarium Health Food',  '2026-06-15', '2026-07-15'),
  ('bb000000-0000-0000-0000-000000000006', 'Winter Product Launch',            'Bulla Dairy Foods',       '2026-06-01', '2026-08-01'),
  ('bb000000-0000-0000-0000-000000000007', 'Supermarket Sampling Campaign',   'Unilever Australia',      '2026-05-01', '2026-08-31'),
  ('bb000000-0000-0000-0000-000000000008', 'Healthy Snacks Roadshow',         'Bluebird Foods NZ',       '2026-06-01', '2026-08-01');

-- ─── Locations ────────────────────────────────────────────────────────────────
insert into locations (id, retailer, store_name, address, suburb, state, country) values
  ('cc000000-0000-0000-0000-000000000001', 'Woolworths',        'Woolworths Town Hall',       '463 George St',        'Sydney',       'NSW', 'Australia'),
  ('cc000000-0000-0000-0000-000000000002', 'Coles',             'Coles Broadway',             '1 Bay St',             'Broadway',     'NSW', 'Australia'),
  ('cc000000-0000-0000-0000-000000000003', 'Chemist Warehouse', 'Chemist Warehouse Bondi',    '170 Oxford St',        'Bondi',        'NSW', 'Australia'),
  ('cc000000-0000-0000-0000-000000000004', 'Coles',             'Coles Bondi',                '71-79 Hall St',        'Bondi Beach',  'NSW', 'Australia'),
  ('cc000000-0000-0000-0000-000000000005', 'Woolworths',        'Woolworths Sydney CBD',      '60 Park St',           'Sydney',       'NSW', 'Australia'),
  ('cc000000-0000-0000-0000-000000000006', 'Coles',             'Coles Randwick',             '2 Perouse Rd',         'Randwick',     'NSW', 'Australia'),
  ('cc000000-0000-0000-0000-000000000007', 'New World',         'New World Victoria Park',    'Victoria St',          'Auckland',     'AKL', 'New Zealand'),
  ('cc000000-0000-0000-0000-000000000008', 'Woolworths',        'Woolworths Wellington',      'Lambton Quay',         'Wellington',   'WGN', 'New Zealand'),
  ('cc000000-0000-0000-0000-000000000009', 'PAK''nSAVE',        'PAK''nSAVE Albany',          '219 Don McKinnon Dr',  'Albany',       'AKL', 'New Zealand'),
  ('cc000000-0000-0000-0000-000000000010', 'Woolworths',        'Woolworths Queenstown',      '23 Shotover St',       'Queenstown',   'OTG', 'New Zealand');

-- ─── Staff ────────────────────────────────────────────────────────────────────
insert into staff (id, full_name, email, phone, role_title, availability_status) values
  ('aa000000-0000-0000-0000-000000000001', 'Maya Chen',     'maya.chen@d2cagency.com.au',   '+61 400 000 001', 'Operations admin',  'available'),
  ('aa000000-0000-0000-0000-000000000002', 'Sarah Chen',    'sarah.chen@d2cagency.com.au',  '+61 400 000 002', 'Brand Ambassador',  'available'),
  ('aa000000-0000-0000-0000-000000000003', 'Tom Lee',       'tom.lee@d2cagency.com.au',     '+61 400 000 003', 'Sampling Lead',     'available'),
  ('aa000000-0000-0000-0000-000000000004', 'Mai Nguyen',    'mai.nguyen@d2cagency.com.au',  '+61 400 000 004', 'Brand Ambassador',  'available'),
  ('aa000000-0000-0000-0000-000000000005', 'Ana Torres',    'ana.torres@d2cagency.com.au',  '+61 400 000 005', 'Sampling Lead',     'available'),
  ('aa000000-0000-0000-0000-000000000006', 'Joel Martin',   'joel.martin@d2cagency.com.au', '+61 400 000 006', 'Brand Ambassador',  'available'),
  ('aa000000-0000-0000-0000-000000000007', 'Priya Shah',    'priya.shah@d2cagency.com.au',  '+61 400 000 007', 'Supervisor',        'maybe'),
  ('aa000000-0000-0000-0000-000000000008', 'Noah Williams', 'noah.w@d2cagency.com.au',      '+61 400 000 008', 'Sampling Lead',     'available'),
  ('aa000000-0000-0000-0000-000000000009', 'Sofia Rossi',   'sofia.rossi@d2cagency.com.au', '+61 400 000 009', 'Demonstrator',      'available'),
  ('aa000000-0000-0000-0000-000000000010', 'Emma Clarke',   'emma.clarke@d2cagency.com.au', '+61 400 000 010', 'Brand Ambassador',  'unavailable'),
  ('aa000000-0000-0000-0000-000000000011', 'Chloe Bennett', 'chloe.b@d2cagency.com.au',     '+61 400 000 011', 'Brand Ambassador',  'maybe'),
  ('aa000000-0000-0000-0000-000000000012', 'Aisha Khan',    'aisha.khan@d2cagency.com.au',  '+61 400 000 012', 'Demonstrator',      'available'),
  ('aa000000-0000-0000-0000-000000000013', 'Jordan Kim',    'jordan.kim@d2cagency.com.au',  '+61 400 000 013', 'Brand Ambassador',  'available'),
  ('aa000000-0000-0000-0000-000000000014', 'Marcus Reed',   'marcus.reed@d2cagency.com.au', '+61 400 000 014', 'Sampling Lead',     'available'),
  ('aa000000-0000-0000-0000-000000000015', 'Leo Martin',    'leo.martin@d2cagency.com.au',  '+61 400 000 015', 'Brand Ambassador',  'available'),
  ('aa000000-0000-0000-0000-000000000016', 'Daniel Wu',     'daniel.wu@d2cagency.com.au',   '+61 400 000 016', 'Demonstrator',      'available'),
  ('aa000000-0000-0000-0000-000000000017', 'Liam Park',     'liam.park@d2cagency.com.au',    '+61 400 000 017', 'Brand Ambassador',  'available'),
  ('aa000000-0000-0000-0000-000000000018', 'Olivia Brown',  'olivia.brown@d2cagency.com.au', '+61 400 000 018', 'Sampling Lead',     'available'),
  ('aa000000-0000-0000-0000-000000000019', 'Isabella Green','isabella.g@d2cagency.com.au',   '+61 400 000 019', 'Demonstrator',      'available'),
  ('aa000000-0000-0000-0000-000000000020', 'Ryan Thompson', 'ryan.t@d2cagency.com.au',       '+61 400 000 020', 'Brand Ambassador',  'unavailable');

-- ─── Shifts  (Jun 2026 – Jul 2026) ──────────────────────────────────────────
insert into shifts (id, campaign_id, location_id, name, date, start_time, end_time, role_focus, notes, equipment, status) values
  ('dd000000-0000-0000-0000-000000000001',
   'bb000000-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000001',
   'In-store Sampling', '2026-06-17', '09:00', '17:00', 'Sampling Lead',
   'High footfall Tuesday. Focus on oat bites tasting station near entrance.',
   'Sampling stand · branded apron · tablet · chilled product kit', 'published'),

  ('dd000000-0000-0000-0000-000000000002',
   'bb000000-0000-0000-0000-000000000002', 'cc000000-0000-0000-0000-000000000002',
   'Morning service', '2026-06-16', '09:00', '13:00', 'Brand Ambassador',
   'Setup by 8:45. Parking available on Bay St. Bring loyalty card scanner.',
   'Display stand · branded apron · product samples', 'published'),

  ('dd000000-0000-0000-0000-000000000003',
   'bb000000-0000-0000-0000-000000000003', 'cc000000-0000-0000-0000-000000000004',
   'Product Demo', '2026-06-18', '11:00', '15:00', 'Brand Ambassador',
   'Frozen product demo — maintain cold chain throughout shift.',
   'Chiller unit · tasting cups · branded signage', 'published'),

  ('dd000000-0000-0000-0000-000000000004',
   'bb000000-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000005',
   'Weekend Sampling', '2026-06-20', '10:00', '16:00', 'Sampling Lead',
   'Busy Saturday — arrive 15 min early for setup. Focus on conversion rate.',
   'Sampling stand · tablet · chilled product kit · branded apron', 'published'),

  ('dd000000-0000-0000-0000-000000000005',
   'bb000000-0000-0000-0000-000000000004', 'cc000000-0000-0000-0000-000000000003',
   'Afternoon service', '2026-06-19', '13:00', '18:00', 'Brand Ambassador',
   'Hydration sampling — pharmacy foot traffic peaks 2–5pm.',
   'Product samples · branded cooler · table stand', 'published'),

  ('dd000000-0000-0000-0000-000000000006',
   'bb000000-0000-0000-0000-000000000005', 'cc000000-0000-0000-0000-000000000006',
   'In-store Demo', '2026-06-21', '09:00', '13:00', 'Brand Ambassador',
   'Breakfast category end-cap activation. Coordinate with store manager.',
   'Display stand · product samples · branded apron', 'published'),

  ('dd000000-0000-0000-0000-000000000007',
   'bb000000-0000-0000-0000-000000000008', 'cc000000-0000-0000-0000-000000000007',
   'NZ Sampling', '2026-06-15', '10:00', '15:00', 'Brand Ambassador',
   'Auckland activation — local team lead. Report to store concierge.',
   'Sampling stand · branded apron · product samples', 'published'),

  ('dd000000-0000-0000-0000-000000000008',
   'bb000000-0000-0000-0000-000000000006', 'cc000000-0000-0000-0000-000000000008',
   'Wellington Demo', '2026-06-20', '11:00', '17:00', 'Sampling Lead',
   'Wellington CBD activation. Busy Saturday foot traffic.',
   'Chiller unit · branded stand · product kit', 'published'),

  -- Past shifts (already happened)
  ('dd000000-0000-0000-0000-000000000009',
   'bb000000-0000-0000-0000-000000000002', 'cc000000-0000-0000-0000-000000000001',
   'Morning Activation', '2026-06-09', '10:00', '15:00', 'Brand Ambassador',
   'Morning peak at Town Hall — high footfall, focus on product trials.',
   'Sampling stand · branded apron · chilled product kit', 'published'),

  ('dd000000-0000-0000-0000-000000000010',
   'bb000000-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002',
   'Midweek Sampling', '2026-06-11', '09:00', '17:00', 'Supervisor',
   'Full-day activation. Refrigeration unit required — confirm cold-chain protocol on arrival.',
   'Sampling stand · chiller unit · branded apron · tablet', 'published'),

  -- Draft (pending sign-off)
  ('dd000000-0000-0000-0000-000000000011',
   'bb000000-0000-0000-0000-000000000006', 'cc000000-0000-0000-0000-000000000010',
   'Queenstown Winter Demo', '2026-06-25', '11:00', '16:00', 'Sampling Lead',
   'DRAFT — pending operations manager sign-off. Confirm local equipment availability before publishing.',
   'Sampling stand · branded apron · product samples', 'draft'),

  -- Published, no invites sent yet (urgent gap)
  ('dd000000-0000-0000-0000-000000000012',
   'bb000000-0000-0000-0000-000000000004', 'cc000000-0000-0000-0000-000000000009',
   'Albany Hydration Sampling', '2026-06-23', '10:00', '16:00', 'Brand Ambassador',
   'Published — no staff assigned yet. 10 days to shift, invite NZ-based staff first.',
   'Product samples · branded cooler · table stand', 'published'),

  -- Published, invites sent but no responses (chasing staff)
  ('dd000000-0000-0000-0000-000000000013',
   'bb000000-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000006',
   'Weekend Randwick', '2026-06-28', '10:00', '16:00', 'Brand Ambassador',
   'Saturday peak at Randwick — arrive 10 min early for trolley setup.',
   'Sampling stand · tablet · branded apron · chilled product kit', 'published'),

  -- Large flagship activation (future, partially staffed)
  ('dd000000-0000-0000-0000-000000000014',
   'bb000000-0000-0000-0000-000000000007', 'cc000000-0000-0000-0000-000000000001',
   'Sydney Metro Activation', '2026-07-05', '09:00', '17:00', 'Supervisor',
   'Flagship Unilever activation — full crew required. Align with store manager the day before.',
   'Display units × 2 · branded aprons · tablets × 2 · signage kit', 'published'),

  -- NZ shift, fully covered
  ('dd000000-0000-0000-0000-000000000015',
   'bb000000-0000-0000-0000-000000000008', 'cc000000-0000-0000-0000-000000000007',
   'Auckland Roadshow Kick-off', '2026-06-22', '10:00', '15:00', 'Brand Ambassador',
   'First leg of NZ roadshow. Report to store team lead on arrival at concierge desk.',
   'Sampling stand · branded apron · product samples', 'published');

-- ─── Shift roles ──────────────────────────────────────────────────────────────
insert into shift_roles (id, shift_id, role, headcount, break_minutes) values
  -- Shift 1: In-store Sampling — under-covered (BA declined, slot unfilled)
  ('ee000000-0000-0000-0000-000000000001', 'dd000000-0000-0000-0000-000000000001', 'Supervisor',       1, 30),
  ('ee000000-0000-0000-0000-000000000002', 'dd000000-0000-0000-0000-000000000001', 'Sampling Lead',    2, 30),
  ('ee000000-0000-0000-0000-000000000003', 'dd000000-0000-0000-0000-000000000001', 'Brand Ambassador', 1, 30),
  ('ee000000-0000-0000-0000-000000000004', 'dd000000-0000-0000-0000-000000000001', 'Demonstrator',     1, 15),
  -- Shift 2: Morning service — covered
  ('ee000000-0000-0000-0000-000000000005', 'dd000000-0000-0000-0000-000000000002', 'Brand Ambassador', 2, 30),
  ('ee000000-0000-0000-0000-000000000006', 'dd000000-0000-0000-0000-000000000002', 'Sampling Lead',    1, 30),
  -- Shift 3: Product Demo — at-risk (no accepted)
  ('ee000000-0000-0000-0000-000000000007', 'dd000000-0000-0000-0000-000000000003', 'Brand Ambassador', 3, 30),
  ('ee000000-0000-0000-0000-000000000008', 'dd000000-0000-0000-0000-000000000003', 'Supervisor',       1, 30),
  -- Shift 4: Weekend Sampling — covered
  ('ee000000-0000-0000-0000-000000000009', 'dd000000-0000-0000-0000-000000000004', 'Sampling Lead',    1, 30),
  ('ee000000-0000-0000-0000-000000000010', 'dd000000-0000-0000-0000-000000000004', 'Brand Ambassador', 2, 30),
  ('ee000000-0000-0000-0000-000000000011', 'dd000000-0000-0000-0000-000000000004', 'Demonstrator',     1, 15),
  -- Shift 5: Afternoon service — under-covered (Demonstrator unfilled)
  ('ee000000-0000-0000-0000-000000000012', 'dd000000-0000-0000-0000-000000000005', 'Brand Ambassador', 2, 30),
  ('ee000000-0000-0000-0000-000000000013', 'dd000000-0000-0000-0000-000000000005', 'Demonstrator',     1, 15),
  -- Shift 6: In-store Demo — covered
  ('ee000000-0000-0000-0000-000000000014', 'dd000000-0000-0000-0000-000000000006', 'Supervisor',       1, 30),
  ('ee000000-0000-0000-0000-000000000015', 'dd000000-0000-0000-0000-000000000006', 'Brand Ambassador', 2, 30),
  -- Shift 7: NZ Sampling — at-risk (no responses)
  ('ee000000-0000-0000-0000-000000000016', 'dd000000-0000-0000-0000-000000000007', 'Brand Ambassador', 2, 30),
  -- Shift 8: Wellington Demo — covered
  ('ee000000-0000-0000-0000-000000000017', 'dd000000-0000-0000-0000-000000000008', 'Sampling Lead',    1, 30),
  ('ee000000-0000-0000-0000-000000000018', 'dd000000-0000-0000-0000-000000000008', 'Brand Ambassador', 1, 30),
  -- Shift 9: Morning Activation (past, covered)
  ('ee000000-0000-0000-0000-000000000019', 'dd000000-0000-0000-0000-000000000009', 'Sampling Lead',    1, 30),
  ('ee000000-0000-0000-0000-000000000020', 'dd000000-0000-0000-0000-000000000009', 'Brand Ambassador', 2, 30),
  -- Shift 10: Midweek Sampling (past, one incident)
  ('ee000000-0000-0000-0000-000000000021', 'dd000000-0000-0000-0000-000000000010', 'Supervisor',       1, 30),
  ('ee000000-0000-0000-0000-000000000022', 'dd000000-0000-0000-0000-000000000010', 'Brand Ambassador', 2, 30),
  ('ee000000-0000-0000-0000-000000000023', 'dd000000-0000-0000-0000-000000000010', 'Demonstrator',     1, 15),
  -- Shift 11: Queenstown Winter Demo (draft, no assignments)
  ('ee000000-0000-0000-0000-000000000024', 'dd000000-0000-0000-0000-000000000011', 'Sampling Lead',    1, 30),
  ('ee000000-0000-0000-0000-000000000025', 'dd000000-0000-0000-0000-000000000011', 'Brand Ambassador', 2, 30),
  -- Shift 12: Albany Hydration Sampling (published, no invites)
  ('ee000000-0000-0000-0000-000000000026', 'dd000000-0000-0000-0000-000000000012', 'Brand Ambassador', 2, 30),
  ('ee000000-0000-0000-0000-000000000027', 'dd000000-0000-0000-0000-000000000012', 'Demonstrator',     1, 15),
  -- Shift 13: Weekend Randwick (invited, no responses)
  ('ee000000-0000-0000-0000-000000000028', 'dd000000-0000-0000-0000-000000000013', 'Sampling Lead',    1, 30),
  ('ee000000-0000-0000-0000-000000000029', 'dd000000-0000-0000-0000-000000000013', 'Brand Ambassador', 3, 30),
  -- Shift 14: Sydney Metro Activation (large, partially covered)
  ('ee000000-0000-0000-0000-000000000030', 'dd000000-0000-0000-0000-000000000014', 'Supervisor',       1, 30),
  ('ee000000-0000-0000-0000-000000000031', 'dd000000-0000-0000-0000-000000000014', 'Sampling Lead',    2, 30),
  ('ee000000-0000-0000-0000-000000000032', 'dd000000-0000-0000-0000-000000000014', 'Brand Ambassador', 3, 30),
  -- Shift 15: Auckland Roadshow Kick-off (fully covered)
  ('ee000000-0000-0000-0000-000000000033', 'dd000000-0000-0000-0000-000000000015', 'Supervisor',       1, 30),
  ('ee000000-0000-0000-0000-000000000034', 'dd000000-0000-0000-0000-000000000015', 'Brand Ambassador', 2, 30);

-- ─── Shift assignments ────────────────────────────────────────────────────────
-- IDs ff01–ff25 align with liveStatusByAssignmentId in presentational-fixtures.ts
insert into shift_assignments (id, shift_id, staff_id, role, status, updated_at) values
  -- Shift 1: In-store Sampling (Town Hall) — under-covered: BA slot unfilled (Joel declined)
  ('ff000000-0000-0000-0000-000000000001', 'dd000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000005', 'Sampling Lead',    'accepted',    now() - interval '2 days'),
  ('ff000000-0000-0000-0000-000000000002', 'dd000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000003', 'Sampling Lead',    'accepted',    now() - interval '2 days'),
  ('ff000000-0000-0000-0000-000000000003', 'dd000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000007', 'Supervisor',       'invited',     now() - interval '1 day'),
  ('ff000000-0000-0000-0000-000000000004', 'dd000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000006', 'Brand Ambassador', 'declined',    now() - interval '3 hours'),
  ('ff000000-0000-0000-0000-000000000005', 'dd000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000016', 'Demonstrator',     'assigned',    now() - interval '3 days'),
  -- Shift 2: Morning service (Broadway) — covered
  ('ff000000-0000-0000-0000-000000000006', 'dd000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000002', 'Brand Ambassador', 'accepted',    now() - interval '4 days'),
  ('ff000000-0000-0000-0000-000000000007', 'dd000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000008', 'Sampling Lead',    'accepted',    now() - interval '4 days'),
  ('ff000000-0000-0000-0000-000000000008', 'dd000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000004', 'Brand Ambassador', 'accepted',    now() - interval '4 days'),
  -- Shift 3: Product Demo (Coles Bondi) — at-risk
  ('ff000000-0000-0000-0000-000000000009', 'dd000000-0000-0000-0000-000000000003', 'aa000000-0000-0000-0000-000000000010', 'Brand Ambassador', 'invited',     now() - interval '1 day'),
  ('ff000000-0000-0000-0000-000000000010', 'dd000000-0000-0000-0000-000000000003', 'aa000000-0000-0000-0000-000000000011', 'Brand Ambassador', 'no_response', now() - interval '2 days'),
  ('ff000000-0000-0000-0000-000000000011', 'dd000000-0000-0000-0000-000000000003', 'aa000000-0000-0000-0000-000000000012', 'Brand Ambassador', 'no_response', now() - interval '2 days'),
  ('ff000000-0000-0000-0000-000000000012', 'dd000000-0000-0000-0000-000000000003', 'aa000000-0000-0000-0000-000000000013', 'Supervisor',       'no_response', now() - interval '2 days'),
  -- Shift 4: Weekend Sampling (CBD) — covered
  ('ff000000-0000-0000-0000-000000000013', 'dd000000-0000-0000-0000-000000000004', 'aa000000-0000-0000-0000-000000000014', 'Sampling Lead',    'accepted',    now() - interval '5 days'),
  ('ff000000-0000-0000-0000-000000000014', 'dd000000-0000-0000-0000-000000000004', 'aa000000-0000-0000-0000-000000000015', 'Brand Ambassador', 'accepted',    now() - interval '5 days'),
  ('ff000000-0000-0000-0000-000000000015', 'dd000000-0000-0000-0000-000000000004', 'aa000000-0000-0000-0000-000000000009', 'Demonstrator',     'accepted',    now() - interval '5 days'),
  ('ff000000-0000-0000-0000-000000000016', 'dd000000-0000-0000-0000-000000000004', 'aa000000-0000-0000-0000-000000000012', 'Brand Ambassador', 'accepted',    now() - interval '5 days'),
  -- Shift 5: Afternoon service (Chemist Bondi) — under-covered (Demonstrator unfilled)
  ('ff000000-0000-0000-0000-000000000017', 'dd000000-0000-0000-0000-000000000005', 'aa000000-0000-0000-0000-000000000015', 'Brand Ambassador', 'invited',     now() - interval '1 day'),
  ('ff000000-0000-0000-0000-000000000018', 'dd000000-0000-0000-0000-000000000005', 'aa000000-0000-0000-0000-000000000009', 'Brand Ambassador', 'invited',     now() - interval '1 day'),
  -- Shift 6: In-store Demo (Randwick) — covered
  ('ff000000-0000-0000-0000-000000000019', 'dd000000-0000-0000-0000-000000000006', 'aa000000-0000-0000-0000-000000000008', 'Supervisor',       'accepted',    now() - interval '6 days'),
  ('ff000000-0000-0000-0000-000000000020', 'dd000000-0000-0000-0000-000000000006', 'aa000000-0000-0000-0000-000000000002', 'Brand Ambassador', 'accepted',    now() - interval '6 days'),
  ('ff000000-0000-0000-0000-000000000021', 'dd000000-0000-0000-0000-000000000006', 'aa000000-0000-0000-0000-000000000004', 'Brand Ambassador', 'accepted',    now() - interval '6 days'),
  -- Shift 7: NZ Sampling (Auckland) — at-risk
  ('ff000000-0000-0000-0000-000000000022', 'dd000000-0000-0000-0000-000000000007', 'aa000000-0000-0000-0000-000000000010', 'Brand Ambassador', 'no_response', now() - interval '3 days'),
  ('ff000000-0000-0000-0000-000000000023', 'dd000000-0000-0000-0000-000000000007', 'aa000000-0000-0000-0000-000000000011', 'Brand Ambassador', 'no_response', now() - interval '3 days'),
  -- Shift 8: Wellington Demo — covered
  ('ff000000-0000-0000-0000-000000000024', 'dd000000-0000-0000-0000-000000000008', 'aa000000-0000-0000-0000-000000000014', 'Sampling Lead',    'accepted',    now() - interval '7 days'),
  ('ff000000-0000-0000-0000-000000000025', 'dd000000-0000-0000-0000-000000000008', 'aa000000-0000-0000-0000-000000000013', 'Brand Ambassador', 'accepted',    now() - interval '7 days'),
  -- Shift 9: Morning Activation (Jun 9, past) — all accepted, all completed in fixtures
  ('ff000000-0000-0000-0000-000000000026', 'dd000000-0000-0000-0000-000000000009', 'aa000000-0000-0000-0000-000000000003', 'Sampling Lead',    'accepted',    now() - interval '6 days'),
  ('ff000000-0000-0000-0000-000000000027', 'dd000000-0000-0000-0000-000000000009', 'aa000000-0000-0000-0000-000000000002', 'Brand Ambassador', 'accepted',    now() - interval '6 days'),
  ('ff000000-0000-0000-0000-000000000028', 'dd000000-0000-0000-0000-000000000009', 'aa000000-0000-0000-0000-000000000013', 'Brand Ambassador', 'accepted',    now() - interval '6 days'),
  -- Shift 10: Midweek Sampling (Jun 11, past) — 3 completed, 1 reported issue
  ('ff000000-0000-0000-0000-000000000029', 'dd000000-0000-0000-0000-000000000010', 'aa000000-0000-0000-0000-000000000007', 'Supervisor',       'accepted',    now() - interval '5 days'),
  ('ff000000-0000-0000-0000-000000000030', 'dd000000-0000-0000-0000-000000000010', 'aa000000-0000-0000-0000-000000000015', 'Brand Ambassador', 'accepted',    now() - interval '5 days'),
  ('ff000000-0000-0000-0000-000000000031', 'dd000000-0000-0000-0000-000000000010', 'aa000000-0000-0000-0000-000000000009', 'Brand Ambassador', 'accepted',    now() - interval '5 days'),
  ('ff000000-0000-0000-0000-000000000032', 'dd000000-0000-0000-0000-000000000010', 'aa000000-0000-0000-0000-000000000016', 'Demonstrator',     'accepted',    now() - interval '5 days'),
  -- Shift 13: Weekend Randwick — invited, all no_response (chasing staff)
  ('ff000000-0000-0000-0000-000000000033', 'dd000000-0000-0000-0000-000000000013', 'aa000000-0000-0000-0000-000000000017', 'Brand Ambassador', 'no_response', now() - interval '2 days'),
  ('ff000000-0000-0000-0000-000000000034', 'dd000000-0000-0000-0000-000000000013', 'aa000000-0000-0000-0000-000000000018', 'Sampling Lead',    'no_response', now() - interval '2 days'),
  ('ff000000-0000-0000-0000-000000000035', 'dd000000-0000-0000-0000-000000000013', 'aa000000-0000-0000-0000-000000000011', 'Brand Ambassador', 'no_response', now() - interval '2 days'),
  ('ff000000-0000-0000-0000-000000000036', 'dd000000-0000-0000-0000-000000000013', 'aa000000-0000-0000-0000-000000000004', 'Brand Ambassador', 'invited',     now() - interval '6 hours'),
  -- Shift 14: Sydney Metro Activation — Sampling Leads covered, Supervisor + BAs still needed
  ('ff000000-0000-0000-0000-000000000037', 'dd000000-0000-0000-0000-000000000014', 'aa000000-0000-0000-0000-000000000005', 'Sampling Lead',    'accepted',    now() - interval '3 days'),
  ('ff000000-0000-0000-0000-000000000038', 'dd000000-0000-0000-0000-000000000014', 'aa000000-0000-0000-0000-000000000008', 'Sampling Lead',    'accepted',    now() - interval '3 days'),
  ('ff000000-0000-0000-0000-000000000039', 'dd000000-0000-0000-0000-000000000014', 'aa000000-0000-0000-0000-000000000014', 'Supervisor',       'invited',     now() - interval '1 day'),
  ('ff000000-0000-0000-0000-000000000040', 'dd000000-0000-0000-0000-000000000014', 'aa000000-0000-0000-0000-000000000017', 'Brand Ambassador', 'invited',     now() - interval '1 day'),
  ('ff000000-0000-0000-0000-000000000041', 'dd000000-0000-0000-0000-000000000014', 'aa000000-0000-0000-0000-000000000018', 'Brand Ambassador', 'declined',    now() - interval '12 hours'),
  -- Shift 15: Auckland Roadshow Kick-off — fully covered
  ('ff000000-0000-0000-0000-000000000042', 'dd000000-0000-0000-0000-000000000015', 'aa000000-0000-0000-0000-000000000007', 'Supervisor',       'accepted',    now() - interval '4 days'),
  ('ff000000-0000-0000-0000-000000000043', 'dd000000-0000-0000-0000-000000000015', 'aa000000-0000-0000-0000-000000000012', 'Brand Ambassador', 'accepted',    now() - interval '4 days'),
  ('ff000000-0000-0000-0000-000000000044', 'dd000000-0000-0000-0000-000000000015', 'aa000000-0000-0000-0000-000000000019', 'Brand Ambassador', 'accepted',    now() - interval '4 days');
