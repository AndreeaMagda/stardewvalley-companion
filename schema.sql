-- Run this in your Supabase SQL editor

CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE DEFAULT 'dev-user',
  current_day INTEGER NOT NULL DEFAULT 1,
  current_season TEXT NOT NULL DEFAULT 'spring'
    CHECK (current_season IN ('spring', 'summer', 'fall', 'winter')),
  current_year INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE garden_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'dev-user',
  crop_id TEXT NOT NULL,
  planted_date TIMESTAMPTZ DEFAULT NOW(),
  season TEXT NOT NULL CHECK (season IN ('spring', 'summer', 'fall', 'winter')),
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 28),
  notes TEXT,
  harvested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'dev-user',
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type)
);

CREATE TABLE gifted_birthdays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'dev-user',
  villager_name TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 1,
  gifted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, villager_name, year)
);

-- Seed default settings for dev-user
INSERT INTO user_settings (user_id, current_day, current_season, current_year)
VALUES ('dev-user', 1, 'spring', 1)
ON CONFLICT (user_id) DO NOTHING;
