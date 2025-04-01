const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Configuración de Supabase
const SUPABASE_URL = 'https://ibgomcgcxxntvcgxrtqv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZ29tY2djeHhudHZjZ3hydHF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjk0MTI1NywiZXhwIjoyMDU4NTE3MjU3fQ.Jn3oaxc0o46clPXSkmvvDX875U-v-ZZ5FAxQhW2m00Q';

// Ruta para obtener usuarios
app.get('/get-users', async (req, res) => {
  try {
    const response = await axios.get(`${SUPABASE_URL}/rest/v1/usuarios?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    // Enviar los datos como respuesta
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).send('Error al obtener los usuarios');
  }
});

// Servir los archivos estáticos (el HTML)
app.use(express.static('public'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
