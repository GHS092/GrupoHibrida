/**
 * Script de prueba directa para conexión a Supabase
 * 
 * Este script prueba la conexión a Supabase directamente,
 * sin pasar por la aplicación, para diagnosticar problemas
 * 
 * Para ejecutar: node supabase_direct_test.js
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase - usar las mismas credenciales que en .env
const supabaseUrl = 'https://heeouytcsqhsdxexnamx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZW91eXRjc3Foc2R4ZXhuYW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTYyMDIsImV4cCI6MjA1NzgzMjIwMn0.G09UaAUlso-1y50cJS6lcvOemjXt83b-vRBZI6VY6UI';

// Dirección de correo y contraseña para la prueba
const testEmail = 'prueba_conexion@ejemplo.com';
const testPassword = 'Password123!';

// Inicializar cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Función para probar la conexión
async function testConnection() {
  try {
    console.log('🔍 Probando conexión básica a Supabase...');
    
    // Consulta simple para verificar conexión
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }
    
    console.log('✅ Conexión exitosa a Supabase');
    console.log('Datos recuperados:', data);
    return true;
  } catch (error) {
    console.error('❌ Error grave de conexión:', error);
    return false;
  }
}

// Función para probar el registro de usuario
async function testSignUp() {
  try {
    console.log('🔍 Probando registro de usuario...');
    
    // Registrar usuario de prueba
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: 'usuario_prueba'
        }
      }
    });
    
    if (error) {
      console.error('❌ Error al registrar usuario:', error);
      return false;
    }
    
    console.log('✅ Usuario registrado exitosamente');
    console.log('ID de usuario:', data.user.id);
    console.log('Email:', data.user.email);
    
    // Verificar si el correo fue enviado
    console.log('📧 Se debería haber enviado un correo de confirmación a', testEmail);
    
    return true;
  } catch (error) {
    console.error('❌ Error grave durante el registro:', error);
    return false;
  }
}

// Función para probar la creación manual de perfil
async function testCreateProfile(userId) {
  try {
    console.log('🔍 Probando creación manual de perfil...');
    
    if (!userId) {
      console.error('❌ No se proporcionó ID de usuario');
      return false;
    }
    
    // Intentar crear perfil manualmente
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          username: 'usuario_prueba',
          email: testEmail,
          is_admin: false
        }
      ])
      .select();
    
    if (error) {
      console.error('❌ Error al crear perfil:', error);
      console.log('Detalles del error:', error.details || 'No hay detalles adicionales');
      
      if (error.message.includes('policy')) {
        console.error('Este parece ser un problema con las políticas RLS (Row Level Security).');
        console.error('Verifica que las políticas permiten la inserción de datos.');
      }
      
      return false;
    }
    
    console.log('✅ Perfil creado exitosamente');
    console.log('Datos del perfil:', data);
    return true;
  } catch (error) {
    console.error('❌ Error grave al crear perfil:', error);
    return false;
  }
}

// Función para probar la autenticación por email+password
async function testSignIn() {
  try {
    console.log('🔍 Probando inicio de sesión...');
    
    // Intentar iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (error) {
      console.error('❌ Error al iniciar sesión:', error);
      return false;
    }
    
    console.log('✅ Inicio de sesión exitoso');
    console.log('ID de usuario:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Token de sesión:', data.session.access_token.substring(0, 10) + '...');
    
    return true;
  } catch (error) {
    console.error('❌ Error grave durante el inicio de sesión:', error);
    return false;
  }
}

// Función para verificar la URL del servicio de autenticación
async function checkAuthSettings() {
  try {
    console.log('🔍 Verificando configuración de autenticación...');
    
    // No hay un endpoint directo para verificar la configuración, pero podemos comprobar si el servicio responde
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error al verificar servicio de autenticación:', error);
      return false;
    }
    
    console.log('✅ Servicio de autenticación responde correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error grave al verificar configuración:', error);
    return false;
  }
}

// Función para verificar el trigger de creación automática de perfiles
async function checkProfileTrigger(userId) {
  try {
    console.log('🔍 Verificando trigger de creación automática de perfiles...');
    
    if (!userId) {
      console.error('❌ No se proporcionó ID de usuario');
      return false;
    }
    
    // Esperar un momento para que el trigger tenga tiempo de ejecutarse
    console.log('Esperando 2 segundos para que el trigger se ejecute...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar si se creó el perfil automáticamente
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);
    
    if (error) {
      console.error('❌ Error al verificar perfil:', error);
      return false;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Perfil creado automáticamente por el trigger');
      console.log('Datos del perfil:', data[0]);
      return true;
    } else {
      console.error('❌ No se encontró perfil. El trigger no está funcionando.');
      // Verificar si existe el trigger
      const { data: fnData, error: fnError } = await supabase
        .from('pg_catalog.pg_proc')
        .select('*')
        .eq('proname', 'handle_new_user');
      
      if (fnError) {
        console.error('No se pudo verificar si la función del trigger existe:', fnError);
      } else {
        console.log('Función del trigger:', fnData && fnData.length > 0 ? 'Existe' : 'No existe');
      }
      
      return false;
    }
  } catch (error) {
    console.error('❌ Error grave al verificar trigger:', error);
    return false;
  }
}

// Función principal que ejecuta todas las pruebas
async function runTests() {
  console.log('=' .repeat(50));
  console.log('INICIANDO PRUEBAS DE CONEXIÓN DIRECTA A SUPABASE');
  console.log('=' .repeat(50));
  console.log('URL: ' + supabaseUrl);
  console.log('API Key: ' + supabaseKey.substring(0, 15) + '...');
  console.log('-' .repeat(50));
  
  // Probar conexión básica
  if (!await testConnection()) {
    console.error('❌ La prueba de conexión falló. Abortando pruebas adicionales.');
    return;
  }
  
  console.log('-' .repeat(50));
  
  // Verificar configuración de autenticación
  if (!await checkAuthSettings()) {
    console.error('❌ Error en la configuración de autenticación. Esto puede impedir el registro y login.');
  }
  
  console.log('-' .repeat(50));
  
  // Probar registro de usuario
  const signUpSuccess = await testSignUp();
  let userId;
  
  if (signUpSuccess) {
    // Si el registro fue exitoso, verificar el trigger
    userId = (await supabase.auth.getUser()).data.user?.id;
    
    if (userId) {
      console.log('-' .repeat(50));
      await checkProfileTrigger(userId);
      
      // Si el trigger no funcionó, intentar crear el perfil manualmente
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);
      
      if (!data || data.length === 0) {
        console.log('-' .repeat(50));
        await testCreateProfile(userId);
      }
      
      // Probar inicio de sesión
      console.log('-' .repeat(50));
      await testSignIn();
    }
  }
  
  console.log('=' .repeat(50));
  console.log('PRUEBAS COMPLETADAS');
  console.log('=' .repeat(50));
}

// Ejecutar las pruebas
runTests(); 