DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS revoked_tokens;
DROP TABLE IF EXISTS decks;

DROP TYPE IF EXISTS card;
DROP TYPE IF EXISTS deck_visibility;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_timestamp ON decks;

DROP FUNCTION IF EXISTS handle_new_user;
