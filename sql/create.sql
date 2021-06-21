CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS moddatetime;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username CITEXT NOT NULL UNIQUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL

  constraint username_length CHECK (char_length(username) >= 3)
);

CREATE TRIGGER update_timestamp BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);


ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profile_select_policy ON profiles
  FOR SELECT
  USING (true);
CREATE POLICY profile_insert_policy ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY profile_update_policy ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Revoked Tokens
CREATE TABLE revoked_tokens (
  token TEXT NOT NULL UNIQUE,
  expiration TIMESTAMP WITH TIME ZONE NOT NULL
);

ALTER TABLE revoked_tokens ENABLE ROW LEVEL SECURITY;

-- Decks
CREATE TYPE deck_visibility as ENUM ('public', 'private');
CREATE TYPE card as (front_text TEXT, back_text TEXT);

CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
  author_id UUID REFERENCES auth.users NOT NULL,
  visibility deck_visibility NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cards card[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_timestamp BEFORE UPDATE ON decks
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY deck_select_public ON decks
  FOR SELECT
  USING (visibility = 'public');
CREATE POLICY deck_crud_own on decks
  USING (auth.uid() = author_id);
