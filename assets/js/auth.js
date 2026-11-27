/* ==========================================================
   Validación de los formularios de login y registro.
   Solo frontend: conecta aquí tu backend (Supabase, Firebase,
   API propia...) en las funciones onLogin / onRegister.
   ========================================================== */
(function () {
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, msg) {
    var field = input.closest(".field");
    var out = field && field.querySelector(".field__error");
    if (field) field.classList.toggle("is-invalid", !!msg);
    if (out) out.textContent = msg || "";
    return !msg;
  }

  function showMessage(form, text, ok) {
    var box = form.querySelector(".form__message");
    if (!box) return;
    box.textContent = text;
    box.className = "form__message is-visible " + (ok ? "form__message--ok" : "form__message--error");
  }

  // ---------- Login ----------
  var login = document.getElementById("login-form");
  if (login) {
    login.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = login.email, pass = login.password;
      var valid = [
        setError(email, EMAIL_RE.test(email.value.trim()) ? "" : "Introduce un correo válido."),
        setError(pass, pass.value ? "" : "Introduce tu contraseña.")
      ].every(Boolean);
      if (!valid) return;

      // TODO: sustituir por la llamada real de autenticación.
      showMessage(login, "¡Bienvenidos de nuevo! (demo: aún no hay backend conectado)", true);
    });
  }

  // ---------- Registro ----------
  var register = document.getElementById("register-form");
  if (register) {
    register.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = register;
      var valid = [
        setError(f.name, f.name.value.trim() ? "" : "Indica tu nombre."),
        setError(f.partner, f.partner.value.trim() ? "" : "Indica el nombre de tu pareja."),
        setError(f.email, EMAIL_RE.test(f.email.value.trim()) ? "" : "Introduce un correo válido."),
        setError(f.password, f.password.value.length >= 8 ? "" : "Mínimo 8 caracteres."),
        setError(f.confirm, f.confirm.value === f.password.value && f.confirm.value ? "" : "Las contraseñas no coinciden."),
        setError(f.terms, f.terms.checked ? "" : "Debes aceptar los términos y la política de privacidad.")
      ].every(Boolean);
      if (!valid) return;

      // TODO: sustituir por la llamada real de registro.
      showMessage(register, "¡Cuenta creada! Empieza a planificar vuestra boda. (demo: aún no hay backend conectado)", true);
      register.reset();
    });
  }

  // Limpia el error al escribir
  document.querySelectorAll(".form input").forEach(function (input) {
    input.addEventListener("input", function () { setError(input, ""); });
    input.addEventListener("change", function () { setError(input, ""); });
  });
})();
