// Ejecutar código JS cuando el contenido HTML haya cargado
document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formularioRegistro");
  const aficiones = [];
  const inputAficion = document.getElementById("aficion");
  const listaAficiones = document.getElementById("listaAficiones");
  const btnAgregar = document.getElementById("agregarAficion");
  const btnResetear = document.getElementById("btnResetear");
  const botonTema = document.getElementById("toggleTema");
  const pagina = document.getElementById("pagina");
  let modoOscuro = false;

  // Inicializar eventos
  inicializarTema(botonTema, formulario, pagina);
  inicializarAgregarAficion(btnAgregar, inputAficion, listaAficiones, aficiones);
  inicializarEliminarAficion(listaAficiones, aficiones);
  inicializarResetearFormulario(btnResetear, formulario, listaAficiones, aficiones);
  inicializarLimpiezaErrores();
  inicializarValidacionFormulario(formulario, aficiones);
});

// Función para alternar entre tema claro y oscuro
function inicializarTema(botonTema, formulario, pagina) {
  let modoOscuro = false;
  botonTema.addEventListener("click", () => {
    modoOscuro = !modoOscuro;
    if (modoOscuro) {
      cambiarTema(formulario, pagina, botonTema, "bg-dark", "text-white", "btn-outline-light", "Tema Claro", "bi-sun-fill");
    } else {
      cambiarTema(formulario, pagina, botonTema, "bg-light", "text-dark", "btn-outline-secondary", "Tema Oscuro", "bi-moon-stars-fill");
    }
  });
}

function cambiarTema(formulario, pagina, botonTema, bgClass, textClass, btnClass, textoBoton, icono) {
  formulario.classList.remove("bg-light", "text-dark", "bg-dark", "text-white");
  formulario.classList.add(bgClass, textClass);
  pagina.classList.remove("bg-light", "text-dark", "bg-dark", "text-white");
  pagina.classList.add(bgClass, textClass);
  botonTema.classList.remove("btn-outline-secondary", "btn-outline-light");
  botonTema.classList.add(btnClass);
  botonTema.innerHTML = `<i class="bi ${icono}"></i> ${textoBoton}`;
}

// Función para agregar aficiones
function inicializarAgregarAficion(btnAgregar, inputAficion, listaAficiones, aficiones) {
  const errorAficiones = document.getElementById("errorAficiones");
  btnAgregar.addEventListener("click", () => {
    const aficion = inputAficion.value.trim();
    if (aficion === "") return;

    if (aficiones.includes(aficion)) {
      errorAficiones.textContent = "Esta afición ya fue agregada.";
      return;
    }

    aficiones.push(aficion);
    errorAficiones.textContent = "";
    agregarAficionLista(aficion, listaAficiones);
    inputAficion.value = "";
  });
}

function agregarAficionLista(aficion, listaAficiones) {
  const li = document.createElement("li");
  li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
  li.innerHTML = `
    ${aficion}
    <button class="btn btn-sm btn-danger btnEliminarAficion">
      <i class="bi bi-x-circle"></i>
    </button>
  `;
  listaAficiones.appendChild(li);
}

// Función para eliminar aficiones
function inicializarEliminarAficion(listaAficiones, aficiones) {
  listaAficiones.addEventListener("click", function (e) {
    if (e.target.closest(".btnEliminarAficion")) {
      const item = e.target.closest("li");
      const aficionTexto = item.firstChild.textContent.trim();
      const index = aficiones.indexOf(aficionTexto);
      if (index !== -1) aficiones.splice(index, 1);
      item.remove();
    }
  });
}

// Función para resetear el formulario
function inicializarResetearFormulario(btnResetear, formulario, listaAficiones, aficiones) {
  btnResetear.addEventListener("click", () => {
    formulario.reset();
    aficiones.length = 0;
    listaAficiones.innerHTML = "";
    document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
  });
}

// Función para limpiar errores al escribir
function inicializarLimpiezaErrores() {
  document.querySelectorAll("input, select").forEach(input => {
    input.addEventListener("input", () => {
      const errorId = "error" + input.id.charAt(0).toUpperCase() + input.id.slice(1);
      const errorElement = document.getElementById(errorId);
      if (errorElement) errorElement.textContent = "";
    });
  });
}

// Función para validar el formulario al enviar
function inicializarValidacionFormulario(formulario, aficiones) {
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    document.querySelectorAll(".text-danger").forEach(el => el.textContent = "");
    if (validarFormulario(aficiones)) {
      const toast = new bootstrap.Toast(document.getElementById('toastExito'));
      toast.show();
    }
  });
}

function validarFormulario(aficiones) {
  let valido = true;

  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();
  const confirmar = document.getElementById("confirmarContrasena").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const comuna = document.getElementById("comuna").value;
  const telefono = document.getElementById("telefono").value.trim();
  const paginaWeb = document.getElementById("paginaWeb").value.trim();

  valido &= validarCampo(usuario, "errorUsuario", /^[a-zA-Z]+[a-zA-Z]*(0|[1-9][0-9]*)?$/, "El nombre de usuario debe tener entre 5 y 10 caracteres y comenzar con letras.");
  valido &= validarContrasena(contrasena, confirmar, usuario);
  valido &= validarCampo(direccion, "errorDireccion", /.+/, "La dirección es obligatoria.");
  valido &= validarCampo(comuna, "errorComuna", /.+/, "Debe seleccionar una comuna.");
  valido &= validarCampo(telefono, "errorTelefono", /^(\+56)?\s?(\d{9})$/, "Formato válido: 912345678 o +56912345678 (9 dígitos).");
  valido &= validarCampo(paginaWeb, "errorPaginaWeb", /^www\.[a-zA-Z0-9\-]+\.(cl|com|org|net|edu|gov|info|biz|[a-zA-Z]{2,})$/, "Formato válido: www.ejemplo.cl o www.ejemplo.com.", true);
  valido &= validarAficiones(aficiones);

  return !!valido;
}

function validarCampo(valor, errorId, regex, mensaje, opcional = false) {
  const errorElement = document.getElementById(errorId);
  if (!valor && !opcional) {
    errorElement.textContent = mensaje;
    return false;
  } else if (valor && !regex.test(valor)) {
    errorElement.textContent = mensaje;
    return false;
  }
  return true;
}

function validarContrasena(contrasena, confirmar, usuario) {
  const errorContrasena = document.getElementById("errorContrasena");
  const errorConfirmar = document.getElementById("errorConfirmar");
  const contrasenaRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{3,6}$/;

  if (!contrasena) {
    errorContrasena.textContent = "La contraseña es obligatoria.";
    return false;
  } else if (!contrasenaRegex.test(contrasena)) {
    errorContrasena.textContent = "La contraseña debe tener entre 3 y 6 caracteres, incluyendo al menos una letra y un número.";
    return false;
  } else if (contrasena.includes(usuario)) {
    errorContrasena.textContent = "La contraseña no puede contener el nombre de usuario.";
    return false;
  }

  if (!confirmar) {
    errorConfirmar.textContent = "Debe confirmar la contraseña.";
    return false;
  } else if (confirmar !== contrasena) {
    errorConfirmar.textContent = "Las contraseñas no coinciden.";
    return false;
  }

  return true;
}

function validarAficiones(aficiones) {
  const errorAficiones = document.getElementById("errorAficiones");
  if (aficiones.length < 2) {
    errorAficiones.textContent = "Debe ingresar al menos 2 aficiones.";
    return false;
  }
  return true;
}


