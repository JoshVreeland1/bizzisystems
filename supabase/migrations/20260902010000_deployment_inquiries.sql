-- Backs the qualification form on /contact.
--
-- Bizzi runs a single Supabase project, so this belongs in the same project as
-- the pilot platform. It is safe to sit alongside pilot data: the table is
-- insert-only for anon, and nothing in it references or reaches pilot tables.
-- If a separate marketing project is created later, move this there and set
-- SITE_SUPABASE_URL / SITE_SUPABASE_ANON_KEY on the Vercel project.
--
-- Inserts come from the site's server route using the anon key. No policy
-- grants SELECT to anon or authenticated, so submissions can only be read with
-- the service role — which is what the Supabase table editor uses.

CREATE TABLE IF NOT EXISTS public.deployment_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  organization text NOT NULL,
  market text NOT NULL CHECK (
    market IN ('City / Public sector', 'Warehouse / Logistics', 'Other')
  ),
  approximate_spaces text NOT NULL CHECK (
    approximate_spaces IN (
      'Under 50', '50 to 250', '250 to 1,000', 'More than 1,000', 'Not sure yet'
    )
  ),
  note text,
  CHECK (length(trim(name)) > 0),
  CHECK (length(trim(organization)) > 0),
  CHECK (position('@' IN email) > 1)
);

CREATE INDEX IF NOT EXISTS deployment_inquiries_created_idx
  ON public.deployment_inquiries (created_at DESC);

ALTER TABLE public.deployment_inquiries ENABLE ROW LEVEL SECURITY;

-- Insert-only for the site. No policy grants SELECT, so a leaked anon key
-- cannot read back anyone else's submission.
DROP POLICY IF EXISTS deployment_inquiries_insert ON public.deployment_inquiries;
CREATE POLICY deployment_inquiries_insert ON public.deployment_inquiries
  FOR INSERT TO anon WITH CHECK (true);

REVOKE ALL ON public.deployment_inquiries FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.deployment_inquiries TO anon;
GRANT ALL ON public.deployment_inquiries TO service_role;
