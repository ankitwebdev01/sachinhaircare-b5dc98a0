-- roles
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- first signup becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Wigs',
  price numeric(10,2) NOT NULL DEFAULT 0,
  compare_at_price numeric(10,2),
  image_url text NOT NULL DEFAULT '',
  gallery text[] NOT NULL DEFAULT '{}',
  hair_length text,
  hair_color text,
  stock integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- hero slides
CREATE TABLE public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  eyebrow text NOT NULL DEFAULT '',
  cta_label text NOT NULL DEFAULT 'Shop now',
  cta_href text NOT NULL DEFAULT '/shop',
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_slides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_slides TO authenticated;
GRANT ALL ON public.hero_slides TO service_role;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active slides" ON public.hero_slides FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins manage slides" ON public.hero_slides FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER hero_slides_updated BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- site settings (single row)
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  salon_name text NOT NULL DEFAULT 'Sachin Unisex Salon',
  tagline text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  announcement text NOT NULL DEFAULT '',
  announcement_active boolean NOT NULL DEFAULT true,
  theme_name text NOT NULL DEFAULT 'signature',
  theme_primary text NOT NULL DEFAULT '#b8863b',
  theme_accent text NOT NULL DEFAULT '#7a1f2b',
  theme_background text NOT NULL DEFAULT '#fbf8f3',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('SUS-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6))),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  pincode text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  payment_method text NOT NULL DEFAULT 'cod',
  status text NOT NULL DEFAULT 'pending',
  total numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can place an order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.order_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can add order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage order items" ON public.order_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- seed
INSERT INTO public.site_settings (id, tagline, phone, whatsapp, email, address, announcement)
VALUES (1, 'Premium human hair wigs, patches & salon care in Silvassa', '+91 91734 14508', '919173414508', 'care@sachinunisexsalon.in', 'Main Road, Silvassa, Dadra & Nagar Haveli 396230', 'Free doorstep trial in Silvassa • Cash on delivery available');

INSERT INTO public.hero_slides (title, subtitle, eyebrow, cta_label, cta_href, image_url, sort_order) VALUES
('Look Younger. Feel Confident.', 'Custom-fit human hair wigs and patches, fitted by hand at our Silvassa studio.', 'Sachin Unisex Salon', 'Shop wigs', '/shop', '/images/hero-1.jpg', 1),
('100% Natural Human Hair', 'Breathable bases, invisible hairlines and a finish nobody can spot.', 'Handcrafted', 'Explore collection', '/shop', '/images/hero-2.jpg', 2),
('Free Consultation & Trial', 'Book a sitting with our stylists and try before you decide.', 'Studio Visit', 'Book now', '/contact', '/images/hero-3.jpg', 3);

INSERT INTO public.products (slug, name, description, category, price, compare_at_price, image_url, hair_length, hair_color, stock, featured, sort_order) VALUES
('natural-wave-human-hair-wig','Natural Wave Human Hair Wig','Full-cap human hair wig with a soft natural wave, hand-tied lace front and adjustable straps for an all-day secure fit.','Wigs',18999,24999,'/images/product-wig-wave.jpg','16 inch','Natural Black',8,true,1),
('silk-straight-lace-wig','Silk Straight Lace Front Wig','Sleek straight human hair with an HD lace front that melts into the skin. Heat friendly up to 180C.','Wigs',21999,27999,'/images/product-wig-straight.jpg','18 inch','Dark Brown',6,true,2),
('mens-hair-patch-ultra-thin','Men''s Ultra-Thin Hair Patch','Featherweight skin base patch with a front hairline so fine it disappears. Includes fitting at our studio.','Hair Patches',12999,16999,'/images/product-patch.jpg','8 inch','Natural Black',12,true,3),
('curly-bounce-wig','Curly Bounce Volume Wig','Bouncy curls with generous density for a full, glamorous look. Pre-plucked hairline.','Wigs',19999,25999,'/images/product-wig-curly.jpg','14 inch','Natural Black',5,true,4),
('clip-in-hair-extensions','Clip-In Hair Extension Set','Seven-piece clip-in set that adds instant length and volume in under five minutes.','Extensions',8999,11999,'/images/product-extensions.jpg','20 inch','Natural Black',20,false,5),
('hair-care-kit','Wig Care Essentials Kit','Sulphate-free shampoo, deep conditioner, serum and a loop brush to keep your hair system soft for years.','Care',2499,3299,'/images/product-carekit.jpg',NULL,NULL,30,false,6);