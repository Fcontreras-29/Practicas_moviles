const API_URL = 'http://localhost:3000'; // Asegúrate de que este es el backend correcto

// 🚀 Función para manejar el inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  
  const identificacion = document.getElementById('loginIdentificacion').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identificacion, password })
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      console.log('Usuario autenticado:', result.user);
      // Aquí puedes redirigir al usuario o guardar los datos en localStorage si es necesario
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error en la conexión con el servidor.');
  }
});
