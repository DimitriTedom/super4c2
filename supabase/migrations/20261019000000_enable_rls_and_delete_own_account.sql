-- ============================================================
-- Super4C2 — Sécurité multi-tenant & droit à l'oubli (RGPD)
-- ============================================================
-- 1) Active la RLS sur toutes les tables applicatives du schéma public.
--    Sans policy, PostgREST (clé anon publique) n'a plus AUCUN accès.
--    Prisma se connecte avec le rôle postgres (BYPASSRLS) : l'app n'est pas impactée.
-- 2) Crée public.delete_own_account() : supprime le compte de l'appelant (auth.uid()) uniquement.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.written_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.written_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF to_regclass('public.oral_series') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.oral_series ENABLE ROW LEVEL SECURITY';
  END IF;
  IF to_regclass('public.oral_tasks') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.oral_tasks ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM public.user_attempts WHERE "userId" = uid;
  DELETE FROM public.notifications WHERE "userId" = uid;
  DELETE FROM public.users WHERE id = uid; -- cascade -> profiles
  DELETE FROM auth.users WHERE id = uid;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;
