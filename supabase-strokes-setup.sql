-- Live collaborative drawing canvas — run this once in Supabase → SQL Editor → New Query → Run

create table if not exists strokes (
  id bigint generated always as identity primary key,
  client_id text not null,          -- anonymous per-browser id (localStorage), used to scope the eraser to "your own strokes"
  client_stroke_id text not null,   -- unique id per stroke, shared across all connected browsers for live erase sync
  points jsonb not null,            -- array of {x, y} percentages (0-100), path of one pen stroke
  color text not null default '#1c1917',
  width integer not null default 3,
  created_at timestamptz not null default now()
);

alter table strokes enable row level security;

create policy "Anyone can read strokes"
  on strokes for select
  using (true);

create policy "Anyone can insert strokes"
  on strokes for insert
  with check (true);

create policy "Anyone can delete strokes"
  on strokes for delete
  using (true);

-- Enables live broadcast of inserts/deletes to every connected visitor
alter publication supabase_realtime add table strokes;
