
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO service_role;

DROP POLICY "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Anyone can submit valid feedback" ON public.feedback
  FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND email ~ '^[^@]+@[^@]+\.[^@]+$'
    AND char_length(message) BETWEEN 1 AND 2000
    AND rating BETWEEN 1 AND 5
  );
