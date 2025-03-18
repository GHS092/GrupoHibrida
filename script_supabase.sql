-- Recrear función para trigger de creación automática de perfiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, is_admin)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), new.email, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recrear tabla de perfiles con política permisiva
DROP TABLE IF EXISTS public.profiles;
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  team_id UUID,
  team_name TEXT,
  team_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir acceso total a perfiles" ON public.profiles;
CREATE POLICY "Permitir acceso total a perfiles" ON public.profiles FOR ALL USING (true);

-- Configurar políticas permisivas para las demás tablas
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir acceso total a transacciones" ON public.transactions;
CREATE POLICY "Permitir acceso total a transacciones" ON public.transactions FOR ALL USING (true);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir acceso total a categorías" ON public.categories;
CREATE POLICY "Permitir acceso total a categorías" ON public.categories FOR ALL USING (true);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir acceso total a equipos" ON public.teams;
CREATE POLICY "Permitir acceso total a equipos" ON public.teams FOR ALL USING (true);

ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir acceso total a ahorros" ON public.savings;
CREATE POLICY "Permitir acceso total a ahorros" ON public.savings FOR ALL USING (true); 