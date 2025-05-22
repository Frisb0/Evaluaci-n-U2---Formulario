// Ejecutar codigo JS cuando el contenido HTML haya cargado
document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formularioRegistro");
  const aficiones = [];

  // Inputs y errores individuales
  const inputAficion = document.getElementById("aficion");
  const listaAficiones = document.getElementById("listaAficiones");
  const btnAgregar = document.getElementById("agregarAficion");
  const btnResetear = document.getElementById("btnResetear");

  // Errores
  const errorUsuario = document.getElementById("errorUsuario");
  const errorContrasena = document.getElementById("errorContrasena");
  const errorConfirmar = document.getElementById("errorConfirmar");
  const errorDireccion = document.getElementById("errorDireccion");
  const errorComuna = document.getElementById("errorComuna");
  const errorTelefono = document.getElementById("errorTelefono");
  const errorPaginaWeb = document.getElementById("errorPaginaWeb");
  const errorAficiones = document.getElementById("errorAficiones");

  //Tema
  const botonTema = document.getElementById("toggleTema");
  const pagina = document.getElementById("pagina");
  let modoOscuro = false;

  // Cambiar tema (Claro/Oscuro)
  botonTema.addEventListener("click", () => {
    modoOscuro = !modoOscuro;
    if (modoOscuro) {
      formulario.classList.remove("bg-light", "text-dark");
      formulario.classList.add("bg-dark", "text-white");
      pagina.classList.remove("bg-light", "text-dark");
      pagina.classList.add("bg-dark", "text-white");
      botonTema.classList.remove("btn-outline-secondary");
      botonTema.classList.add("btn-outline-light");
      botonTema.innerHTML = `<i class="bi bi-sun-fill"></i> Tema Claro`;
    } else {
      formulario.classList.remove("bg-dark", "text-white");
      formulario.classList.add("bg-light", "text-dark");
      pagina.classList.remove("bg-dark", "text-white");
      pagina.classList.add("bg-light", "text-dark");
      botonTema.classList.remove("btn-outline-light");
      botonTema.classList.add("btn-outline-secondary");
      botonTema.innerHTML = `<i class="bi bi-moon-stars-fill"></i> Tema Oscuro`;
    }
  });

  // Agregar afición
  btnAgregar.addEventListener("click", () => {
    const aficion = inputAficion.value.trim();
    if (aficion === "") return;

    if (aficiones.includes(aficion)) {
      errorAficiones.textContent = "Esta afición ya fue agregada.";
      return;
    }

    aficiones.push(aficion);
    errorAficiones.textContent = "";

    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    li.innerHTML = `
      ${aficion}
      <button class="btn btn-sm btn-danger btnEliminarAficion">
        <i class="bi bi-x-circle"></i>
      </button>
    `;
    listaAficiones.appendChild(li);
    inputAficion.value = "";
  });

  // Eliminar afición
  listaAficiones.addEventListener("click", function (e) {
    if (e.target.closest(".btnEliminarAficion")) {
      const item = e.target.closest("li");
      const aficionTexto = item.firstChild.textContent.trim();
      const index = aficiones.indexOf(aficionTexto);
      if (index !== -1) aficiones.splice(index, 1);
      item.remove();
    }
  });

  // Botón reset
  btnResetear.addEventListener("click", () => {
    formulario.reset();
    aficiones.length = 0;
    listaAficiones.innerHTML = "";
    document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
  });

  // Limpiar errores al escribir
  document.querySelectorAll("input, select").forEach(input => {
    input.addEventListener("input", () => {
      const errorId = "error" + input.id.charAt(0).toUpperCase() + input.id.slice(1);
      const errorElement = document.getElementById(errorId);
      if (errorElement) errorElement.textContent = "";
    });
  });

  // Validación al enviar
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
    let valido = true;

    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const confirmar = document.getElementById("confirmarContrasena").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const comuna = document.getElementById("comuna").value;
    const telefono = document.getElementById("telefono").value.trim();
    const paginaWeb = document.getElementById("paginaWeb").value.trim();

    const usuarioRegex = /^[a-zA-Z]+[a-zA-Z]*(0|[1-9][0-9]*)?$/;
    if (!usuario) {
      errorUsuario.textContent = "Este campo es obligatorio.";
      valido = false;
    } else if (usuario.length < 5 || usuario.length > 10) {
      errorUsuario.textContent = "El nombre de usuario debe tener entre 5 y 10 caracteres.";
      valido = false;
    } else if (!usuarioRegex.test(usuario)) {
      errorUsuario.textContent = "El nombre debe comenzar con letras y solo puede tener dígitos al final. No se permiten caracteres especiales.";
      valido = false;
    }

    const contrasenaRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{3,6}$/;
    if (!contrasena) {
      errorContrasena.textContent = "La contraseña es obligatoria";
      valido = false;
    } else if (!contrasenaRegex.test(contrasena)) {
      errorContrasena.textContent = "La contraseña debe tener entre 3 y 6 caracteres, incluyendo al menos una letra y un número";
      valido = false;
    } else if (contrasena.includes(usuario)) {
      errorContrasena.textContent = "La contraseña no puede contener el nombre de usuario";
      valido = false;
    }

    if (!confirmar) {
      errorConfirmar.textContent = "Debe confirmar la contraseña";
      valido = false;
    } else if (confirmar !== contrasena) {
      errorConfirmar.textContent = "Las contraseñas no coinciden";
      valido = false;
    }

    if (!direccion) {
      errorDireccion.textContent = "La dirección es obligatoria";
      valido = false;
    }

    if (comuna === "") {
      errorComuna.textContent = "Debe seleccionar una comuna";
      valido = false;
    }

    const telefonoRegex = /^(\+56)?\s?(\d{9})$/;
    if (!telefono) {
      errorTelefono.textContent = "El número de teléfono es obligatorio";
      valido = false;
    } else if (!telefonoRegex.test(telefono)) {
      errorTelefono.textContent = "Formato válido: 912345678 o +56912345678 (9 dígitos)";
      valido = false;
    }

    const urlRegex = /^www\.[a-zA-Z0-9\-]+\.(cl|com|org|net|edu|gov|info|biz|[a-zA-Z]{2,})$/;
    if (paginaWeb && !urlRegex.test(paginaWeb)) {
      errorPaginaWeb.textContent = "Formato válido: www.ejemplo.cl o www.ejemplo.com";
      valido = false;
    }

    if (aficiones.length < 2) {
      errorAficiones.textContent = "Debe ingresar al menos 2 aficiones";
      valido = false;
    }

    if (valido) {
      const toast = new bootstrap.Toast(document.getElementById('toastExito'));
      toast.show();
    }
  });
});


