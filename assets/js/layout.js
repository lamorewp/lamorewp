/* ==========================================================
   Cabecera, menú y footer compartidos por todas las páginas.
   Cada página declara <body data-root="./"> (o "../" en /legal/)
   y los contenedores <div id="site-header"> y <div id="site-footer">.
   ========================================================== */
(function () {
  var root = document.body.getAttribute("data-root") || "./";
  var current = location.pathname.split("/").pop() || "index.html";

  var menu = [
    { href: "index.html#servicios", label: "Servicios" },
    { href: "index.html#mesas", label: "Plan de mesas" },
    { href: "index.html#como-funciona", label: "Cómo funciona" },
    { href: "index.html#galeria", label: "Galería" },
    { href: "index.html#testimonios", label: "Testimonios" }
  ];

  var legal = [
    { href: "legal/aviso-legal.html", label: "Aviso legal" },
    { href: "legal/privacidad.html", label: "Política de privacidad" },
    { href: "legal/cookies.html", label: "Política de cookies" },
    { href: "legal/terminos.html", label: "Términos y condiciones" }
  ];

  function link(item) {
    var file = item.href.split("#")[0].split("/").pop();
    var isCurrent = file === current && item.href.indexOf("#") === -1;
    return '<li><a href="' + root + item.href + '"' +
      (isCurrent ? ' aria-current="page"' : "") + ">" + item.label + "</a></li>";
  }

  var header =
    '<header class="site-header">' +
      '<div class="container site-header__inner">' +
        '<a class="logo" href="' + root + 'index.html">L\'Amo<span>re</span></a>' +
        '<button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="main-nav">' +
          "<span></span><span></span><span></span>" +
        "</button>" +
        '<nav class="nav" id="main-nav" aria-label="Principal">' +
          '<ul class="nav__list">' + menu.map(link).join("") + "</ul>" +
          '<div class="nav__actions">' +
            '<a class="btn btn--ghost" href="' + root + 'login.html">Iniciar sesión</a>' +
            '<a class="btn" href="' + root + 'registro.html">Crear cuenta</a>' +
          "</div>" +
        "</nav>" +
      "</div>" +
    "</header>";

  var footer =
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="footer__grid">' +
          "<div>" +
            '<a class="logo" href="' + root + 'index.html">L\'Amo<span>re</span></a>' +
            '<p style="margin-top:14px;max-width:340px">Planificamos contigo cada detalle de tu boda: invitados, proveedores, presupuesto y el gran día.</p>' +
          "</div>" +
          "<div><h4>Explora</h4><ul>" + menu.map(link).join("") + "</ul></div>" +
          "<div><h4>Legal</h4><ul>" + legal.map(link).join("") + "</ul></div>" +
        "</div>" +
        '<div class="footer__bottom">' +
          "<span>© " + new Date().getFullYear() + " L'Amore. Todos los derechos reservados.</span>" +
          '<span><a href="mailto:hola@lamore.example">hola@lamore.example</a></span>' +
        "</div>" +
      "</div>" +
    "</footer>";

  var h = document.getElementById("site-header");
  var f = document.getElementById("site-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

  // Menú móvil
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
