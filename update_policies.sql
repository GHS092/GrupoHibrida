
    -- Habilitar RLS en la tabla perfiles
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    -- Eliminar políticas existentes
    DROP POLICY IF EXISTS "Permitir acceso público a perfiles durante desarrollo" ON public.profiles;
    
    -- Crear nueva política permisiva para desarrollo
    CREATE POLICY "Permitir acceso público a perfiles durante desarrollo" ON public.profiles
      FOR ALL USING (true);
    
    -- Configurar políticas para la tabla de equipos
    ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Permitir acceso público a equipos durante desarrollo" ON public.teams;
    CREATE POLICY "Permitir acceso público a equipos durante desarrollo" ON public.teams
      FOR ALL USING (true);
    
    -- Configurar políticas para la tabla de transacciones
    ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Permitir acceso público a transacciones durante desarrollo" ON public.transactions;
    CREATE POLICY "Permitir acceso público a transacciones durante desarrollo" ON public.transactions
      FOR ALL USING (true);
    
    -- Configurar políticas para la tabla de categorías
    ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Permitir acceso público a categorías durante desarrollo" ON public.categories;
    CREATE POLICY "Permitir acceso público a categorías durante desarrollo" ON public.categories
      FOR ALL USING (true);
    
    -- Configurar políticas para la tabla de ahorros
    ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Permitir acceso público a ahorros durante desarrollo" ON public.savings;
    CREATE POLICY "Permitir acceso público a ahorros durante desarrollo" ON public.savings
      FOR ALL USING (true);
    