
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  price_range TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Portfolio
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.portfolio_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolio" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Admins can insert portfolio" ON public.portfolio_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update portfolio" ON public.portfolio_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio" ON public.portfolio_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Feedback
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.feedback TO anon, authenticated;
GRANT DELETE ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feedback" ON public.feedback FOR SELECT USING (true);
CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can delete feedback" ON public.feedback FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed services
INSERT INTO public.services (name, description, icon, price_range, sort_order) VALUES
  ('Web Development', 'Modern, responsive websites built with React and Next.js.', 'Code2', '$200 - $2000', 1),
  ('App Development', 'Cross-platform mobile apps with delightful UX.', 'Smartphone', '$500 - $5000', 2),
  ('Logo Designing', 'Distinctive logos that capture your brand essence.', 'PenTool', '$30 - $200', 3),
  ('YouTube Thumbnail Design', 'Click-worthy thumbnails that boost CTR.', 'Youtube', '$10 - $50', 4),
  ('Poster & Post Design', 'Eye-catching posters and social posts.', 'Image', '$15 - $80', 5),
  ('Image Editing', 'Professional photo retouching and manipulation.', 'ImagePlus', '$10 - $100', 6),
  ('Video Editing', 'Cinematic edits for reels, ads, and YouTube.', 'Video', '$50 - $500', 7),
  ('Programming Solutions', 'Custom scripts, automations, and bug fixes.', 'Terminal', '$30 - $1000', 8),
  ('LinkedIn Banners & DP', 'Professional LinkedIn branding kits.', 'Linkedin', '$15 - $60', 9),
  ('Content Writing', 'Compelling stories and articles that engage.', 'FileText', '$20 - $300', 10),
  ('Funny / Creative Writing', 'Witty copy that makes audiences smile.', 'Smile', '$15 - $200', 11),
  ('Branding & Social Kits', 'Complete brand identity & social templates.', 'Layers', '$100 - $1500', 12);

-- Seed portfolio
INSERT INTO public.portfolio_items (title, category, image_url, price, description) VALUES
  ('SaaS Landing Page', 'Web', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800', '$800', 'Modern SaaS landing with conversion focus'),
  ('Fitness Mobile App', 'App', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800', '$3500', 'Track workouts and progress'),
  ('Brand Logo - Aurora', 'Design', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800', '$120', 'Minimalist tech brand logo'),
  ('Gaming Thumbnail Pack', 'Design', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', '$40', '10 high-CTR YouTube thumbnails'),
  ('Promo Video Edit', 'Video', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800', '$300', '60s cinematic product promo'),
  ('Short Story Anthology', 'Writing', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800', '$250', 'Collection of 5 original stories'),
  ('E-commerce Store', 'Web', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800', '$1800', 'Full e-commerce build'),
  ('Restaurant Menu Posters', 'Design', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', '$80', 'Series of 6 menu posters');
