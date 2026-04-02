-- Prevent duplicate submissions for the same email (case-insensitive, trimmed).
create unique index if not exists profiles_email_lower_unique
  on public.profiles (lower(trim(email)));
