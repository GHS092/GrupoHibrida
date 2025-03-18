
    -- Recrear función para el trigger
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, username, email, is_admin)
      VALUES (new.id, new.raw_user_meta_data->>'username', new.email, false);
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    -- Recrear trigger
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    