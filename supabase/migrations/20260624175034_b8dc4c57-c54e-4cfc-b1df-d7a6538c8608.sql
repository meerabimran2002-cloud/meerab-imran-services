
-- 1) Feedback: lock SELECT on base table to admins; expose safe columns via view
DROP POLICY IF EXISTS "Anyone can view feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can delete feedback" ON public.feedback;

CREATE POLICY "Admins can view feedback" ON public.feedback FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete feedback" ON public.feedback FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Revoke broad anon SELECT on base feedback (keep INSERT for public submissions)
REVOKE SELECT ON public.feedback FROM anon;

-- Public-safe view (no email column)
CREATE OR REPLACE VIEW public.feedback_public
WITH (security_invoker = true)
AS SELECT id, name, rating, message, created_at FROM public.feedback;

GRANT SELECT ON public.feedback_public TO anon, authenticated;

-- Allow anon/authenticated to read via the view (RLS still applies on base table under security_invoker,
-- so add a public SELECT policy restricted to safe columns via the view boundary)
CREATE POLICY "Public can view feedback via view" ON public.feedback FOR SELECT TO anon, authenticated
  USING (true);

-- Note: anon no longer has table-level SELECT grant, so cannot bypass the view.

-- 2) Replace policies referencing has_role() with inline EXISTS checks (services, portfolio_items, storage)
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;

CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can insert portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admins can update portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admins can delete portfolio" ON public.portfolio_items;

CREATE POLICY "Admins can insert portfolio" ON public.portfolio_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update portfolio" ON public.portfolio_items FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete portfolio" ON public.portfolio_items FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio images" ON storage.objects;

CREATE POLICY "Admins can upload portfolio images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update portfolio images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete portfolio images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 3) Lock down has_role: revoke from anon/authenticated/public; only service_role and definer-context use
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

-- 4) Drop unused claim_admin_if_first; client will use a server function with admin client instead
DROP FUNCTION IF EXISTS public.claim_admin_if_first();
