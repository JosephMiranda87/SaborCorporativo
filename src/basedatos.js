// ----------------------------------------------------------
// 🔥 IMPORTAR FIREBASE
// ----------------------------------------------------------
import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  push, 
  set,
  onValue
} from "firebase/database";

// ----------------------------------------------------------
// 🔧 CONFIGURACIÓN DE FIREBASE
// ----------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyC1ptcld3PnvoyW1lFmPnKVtCs2MChQqRE",
  authDomain: "landing-proyecto.firebaseapp.com",
  databaseURL: "https://landing-proyecto-default-rtdb.firebaseio.com",
  projectId: "landing-proyecto",
  storageBucket: "landing-proyecto.firebasestorage.app",
  messagingSenderId: "665694637225",
  appId: "1:665694637225:web:8f1d7a8c5e7d2e97ecedb8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function mostrarAlerta(tipo, mensaje) {
  const alerta = document.getElementById("alerta");

  if (!alerta) return;

  // Estilos
  alerta.classList.remove("hidden");
  alerta.classList.add("opacity-100");

  if (tipo === "exito") {
    alerta.className = "mt-4 p-4 rounded-md text-white font-semibold bg-green-600";
  } else {
    alerta.className = "mt-4 p-4 rounded-md text-white font-semibold bg-red-600";
  }

  alerta.textContent = mensaje;


  setTimeout(() => {
    alerta.classList.add("hidden");
  }, 3000);
}


const formulario = document.getElementById("contactForm");

if (formulario) {
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      nombre: document.getElementById("nombre").value,
      empresa: document.getElementById("empresa").value,
      email: document.getElementById("email").value,
      telefono: document.getElementById("telefono").value,
      plan: document.getElementById("plan").value,
      mensaje: document.getElementById("mensaje").value,
      fecha: new Date().toISOString()
    };

    const nuevaEntrada = push(ref(db, "contactos"));

    try {
      await set(nuevaEntrada, datos);

      // Mostrar alerta de éxito
      mostrarAlerta("exito", "¡Tu mensaje se ha enviado correctamente!");

      formulario.reset();

    } catch (error) {
      console.error("Error al guardar:", error);

      // Mostrar alerta de error
      mostrarAlerta("error", "Ocurrió un error al enviar tu mensaje.");
    }
  });
}


// ----------------------------------------------------------
// 📥 MOSTRAR MENSAJES RECIENTES EN TABLA
// ----------------------------------------------------------

const contenedor = document.getElementById("mensajesRecientes");

if (contenedor) {
  const mensajesRef = ref(db, "contactos");

  onValue(mensajesRef, (snapshot) => {
    contenedor.innerHTML = "";

    const mensajes = [];
    snapshot.forEach((child) => {
      const data = child.val();
      data.id = child.key;
      mensajes.push(data);
    });

    // Ordenar por fecha más reciente
    mensajes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    mensajes.forEach((data) => {
      const fecha = new Date(data.fecha).toLocaleDateString("es-ES");

      const fila = `
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-3">${data.nombre}</td>
          <td class="px-4 py-3">${data.empresa}</td>
          <td class="px-4 py-3">${data.plan}</td>
          <td class="px-4 py-3">${fecha}</td>
        </tr>
      `;

      contenedor.insertAdjacentHTML("beforeend", fila);
    });
  });
}
