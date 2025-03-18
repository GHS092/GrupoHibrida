
=======================================================================
INSTRUCCIONES PARA CONFIGURAR CORRECTAMENTE SUPABASE
=======================================================================

1. CONFIGURAR URLs PERMITIDAS EN SUPABASE:
   a) Accede a: https://app.supabase.io 
   b) Selecciona tu proyecto: GHS Finanzas
   c) Ve a "Authentication" > "URL Configuration"
   d) En "Site URL", ingresa: https://grupo-hibrida.vercel.app
   e) En "Redirect URLs", añade las siguientes URLs:
      - https://grupo-hibrida.vercel.app/auth/callback
      - https://grupo-hibrida.vercel.app/api/auth/callback
      - https://grupo-hibrida.vercel.app/
      - http://localhost:3000/auth/callback
      - http://localhost:3000/api/auth/callback
      - http://localhost:3000/
   f) Guarda los cambios

2. EJECUTAR SCRIPTS SQL EN EL EDITOR SQL:
   a) Ve a "SQL Editor" en Supabase
   b) Copia y pega el contenido de "update_policies.sql"
   c) Ejecuta la consulta
   d) Copia y pega el contenido de "fix_trigger.sql"
   e) Ejecuta la consulta

3. VERIFICAR CONFIGURACIÓN:
   a) Ejecuta: node supabase_direct_test.js
   b) Verifica que todas las pruebas pasan correctamente

4. ACTUALIZAR VARIABLES DE ENTORNO EN VERCEL:
   a) Accede al panel de control de Vercel
   b) Selecciona tu proyecto
   c) Ve a "Settings" > "Environment Variables"
   d) Verifica que las siguientes variables están configuradas correctamente:
      - SUPABASE_URL: https://heeouytcsqhsdxexnamx.supabase.co
      - SUPABASE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZW91eXRjc3Foc2R4ZXhuYW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTYyMDIsImV4cCI6MjA1NzgzMjIwMn0.G09UaAUlso-1y50cJS6lcvOemjXt83b-vRBZI6VY6UI
   e) Haz clic en "Save" y redespliega la aplicación

=======================================================================
  