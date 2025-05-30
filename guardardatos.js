
// Importación compatible con node-fetch v3+
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Configuración
const SUPABASE_URL = 'https://ibgomcgcxxntvcgxrtqv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZ29tY2djeHhudHZjZ3hydHF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjk0MTI1NywiZXhwIjoyMDU4NTE3MjU3fQ.Jn3oaxc0o46clPXSkmvvDX875U-v-ZZ5FAxQhW2m00Q';

// Datos de los nuevos usuarios a insertar
const nuevosUsuarios = [
  {
    Identificacion: 1027525168,
    Nombre_Usuario: "Francisco Contreras",
    Clave_Encriptada: "sdfghjkl",
    Usuario_Normal: 1,
    Usuario_Administrador: 0,
    Usuario_Superadministrador: 0,
    email: "consrtas@gmail.com"
  }
];

// Función para insertar usuarios
async function insertarUsuarios() {
  try {
    console.log('\nInsertando nuevos usuarios...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation' // Para recibir los datos insertados
      },
      body: JSON.stringify(nuevosUsuarios)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const usuariosInsertados = await response.json();
    // Mostrar resultados
    console.log('\n✅ Usuarios insertados correctamente:');
    console.log('='.repeat(60));
    usuariosInsertados.forEach((usuarios, index) => {
      console.log(`👤 Usuario ${index + 1} insertado:`);
      console.log('─'.repeat(40));
      console.log(`  ID: ${usuarios.id_usuario}`);
      console.log(`  Nombre: ${usuarios.nombre_usuario}`);
      console.log(`  Email: ${usuarios.email}`);
      console.log(`  Tipo: ${usuarios.usuario_superadministrador ? 'Super Admin' : 
                          usuarios.usuario_administrador ? 'Administrador' : 'Usuario Normal'}`);
      console.log('─'.repeat(40) + '\n');
    });
    console.log(`📌 Total de usuarios insertados: ${usuariosInsertados.length}`);
    console.log('='.repeat(60));
    return usuariosInsertados;
  } catch (error) {
    console.error('\n❌ Error al insertar usuarios:');
    console.error('='.repeat(60));
    console.error(error.message);
    console.error('='.repeat(60));
    process.exit(1);
  }
}

// Ejecutar la función
(async () => {
  await insertarUsuarios();
})();
