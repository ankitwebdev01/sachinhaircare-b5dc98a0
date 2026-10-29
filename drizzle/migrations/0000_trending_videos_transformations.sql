CREATE TABLE public.trending_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null default ''::text,
  thumbnail_url text not null default ''::text,
  video_url text not null default ''::text,
  link_href text not null default '/shop'::text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.trending_videos TO authenticated;
GRANT ALL ON public.trending_videos TO service_role;
GRANT SELECT ON public.trending_videos TO anon;

ALTER TABLE public.trending_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active videos"
  ON public.trending_videos FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins manage videos"
  ON public.trending_videos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trending_videos_updated
  BEFORE UPDATE ON public.trending_videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.transformations (
  id uuid primary key default gen_random_uuid(),
  caption text not null default ''::text,
  before_url text not null default ''::text,
  after_url text not null default ''::text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.transformations TO authenticated;
GRANT ALL ON public.transformations TO service_role;
GRANT SELECT ON public.transformations TO anon;

ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active transformations"
  ON public.transformations FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins manage transformations"
  ON public.transformations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER transformations_updated
  BEFORE UPDATE ON public.transformations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();