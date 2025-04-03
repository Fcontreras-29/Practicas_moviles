const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Supabase Configuración
const SUPABASE_URL = 'https://ibgomcgcxxntvcgxrtqv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZ29tY2djeHhudHZjZ3hydHF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjk0MTI1NywiZXhwIjoyMDU4NTE3MjU3fQ.Jn3oaxc0o46clPXSkmvvDX875U-v-ZZ5FAxQhW2m00Q';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Función para obtener usuario por identificación
async function getUserByIdentificacion(Identificacion) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?identificacion=eq.${Identificacion}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return await response.json();
}

// 🔐 **Ruta de Login**
app.post('/login', async (req, res) => {
  try {
    const { Identificacion, password } = req.body;
    const users = await getUserByIdentificacion(Identificacion);

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.Clave_Encriptada);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({
      success: true,
      user: { identificacion: user.Identificacion, Nombre_Usuario: user.Nombre_Usuario, email: user.email },
      message: `Bienvenido ${user.Nombre_Usuario}`
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📝 **Ruta de Registro**
app.post('/register', async (req, res) => {
  try {
    const { Identificacion, Nombre, password, email, tipoUsuario } = req.body;
    const existingUser = await getUserByIdentificacion(Identificacion);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userType = {
      normal: tipoUsuario === 'normal' ? 1 : 0,
      admin: tipoUsuario === 'admin' ? 1 : 0,
      superadmin: tipoUsuario === 'superadmin' ? 1 : 0
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        Identificacion,
        Nombre_Usuario: Nombre,
        Clave_Encriptada: hashedPassword,
        email,
        Usuario_Normal: userType.normal,
        Usuario_Administrador: userType.admin,
        Usuario_Superadministrador: userType.superadmin
      })
    });

    const newUser = await response.json();
    res.json({ success: true, user: newUser[0], message: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: error.message });
  }
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
