const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

// Configuración de variables de entorno
// En Vercel, las variables de entorno se configuran en el dashboard
// y están disponibles automáticamente
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de tipos MIME específicos
app.use((req, res, next) => {
  const ext = path.extname(req.path);
  if (ext === '.js') {
    res.type('application/javascript');
  } else if (ext === '.css') {
    res.type('text/css');
  }
  next();
});

// Servir archivos estáticos desde la carpeta public
app.use('/public', express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.js') {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

// Serve static files - Simplificado para evitar conflictos
app.use(express.static(path.join(__dirname)));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para la página de prueba
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test.html'));
});

// Rutas específicas para archivos estáticos con tipos MIME explícitos
app.get('/financeAI.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'financeAI.js'));
});

app.get('/neomorphic-buttons.css', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'neomorphic-buttons.css'));
});

app.get('/style.css', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'style.css'));
});

// Ruta específica para el archivo test.js en la carpeta public
app.get('/public/test.js', (req, res) => {
  console.log('Solicitando /public/test.js');
  if (fs.existsSync(path.join(__dirname, 'public', 'test.js'))) {
    console.log('El archivo existe');
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'public', 'test.js'));
  } else {
    console.log('El archivo no existe');
    res.status(404).send('Archivo no encontrado');
  }
});

// API endpoint for admin configuration
app.get('/api/config', (req, res) => {
  // Only expose necessary configuration values
  res.json({
    adminAccessCode: process.env.ADMIN_ACCESS_CODE || 'default-code'
  });
});

// API endpoint for chat completions
app.post('/api/chat/completions', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // OpenRouter API configuration
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    console.log('Using API key:', openRouterApiKey.substring(0, 10) + '...');
    
    // Determinar la URL de referencia
    const refererUrl = process.env.NODE_ENV === 'production' 
      ? 'https://grupo-hibrida-ucal.vercel.app' 
      : 'http://localhost:3000';
    
    // Make request to OpenRouter API using Gemini model
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-pro-exp-02-05:free', // Using Gemini Pro model
        messages: messages,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': refererUrl,
          'X-Title': 'GHS Finanzas'
        }
      }
    );
    
    // Extract and return the response content
    // Ensure we're handling the response format correctly
    let content = '';
    
    if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
      content = response.data.choices[0].message.content;
    } else if (response.data && response.data.content) {
      // Alternative response format
      content = response.data.content;
    } else {
      console.log('Unexpected API response format:', response.data);
      content = 'Lo siento, no pude procesar tu solicitud en este momento.';
    }
    
    res.json({ content });
    
  } catch (error) {
    console.error('Error calling OpenRouter API:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Error processing request', 
      details: error.response?.data || error.message 
    });
  }
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
  });
}

// Exportar la app para Vercel
module.exports = app;