/* ==========================================================
   Demo interactiva: planificador de mesas.
   - Escritorio: arrastra un invitado a una mesa.
   - Móvil: toca un invitado y después toca una mesa.
   - Toca un invitado sentado para devolverlo a la lista.
   ========================================================== */
(function () {
  var app = document.getElementById("seating");
  if (!app) return;

  var SEATS = 8;
  var GROUPS = {
    novia: { label: "Familia de la novia", color: "var(--g-novia)" },
    novio: { label: "Familia del novio", color: "var(--g-novio)" },
    amigos: { label: "Amigos", color: "var(--g-amigos)" }
  };

  var SAMPLE = [
    ["Carmen", "novia"], ["Luis", "novia"], ["Abuela Rosa", "novia"], ["Tía Pilar", "novia"],
    ["Sofía", "novia"], ["Jorge", "novio"], ["Elena", "novio"], ["Abuelo Paco", "novio"],
    ["Raúl", "novio"], ["Inés", "novio"], ["Marta", "amigos"], ["Andrés", "amigos"],
    ["Lucía", "amigos"], ["Dani", "amigos"], ["Bea", "amigos"], ["Pablo", "amigos"],
    ["Nuria", "amigos"], ["Hugo", "amigos"]
  ];

  var state, selected = null;

  function initial() {
    var guests = SAMPLE.map(function (g, i) { return { id: "g" + i, name: g[0], group: g[1], table: null }; });
    var tables = [{ id: "t0", name: "Mesa presidencial" }, { id: "t1", name: "Mesa 1" }, { id: "t2", name: "Mesa 2" }];
    // Algunos ya sentados para que la demo arranque con vida
    guests[0].table = "t0"; guests[5].table = "t0"; guests[2].table = "t0"; guests[7].table = "t0";
    guests[10].table = "t1"; guests[11].table = "t1"; guests[12].table = "t1";
    return { guests: guests, tables: tables };
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function initials(name) {
    return name.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
  }

  function guestsAt(tableId) {
    return state.guests.filter(function (g) { return g.table === tableId; });
  }

  function seat(guestId, tableId) {
    var g = state.guests.find(function (x) { return x.id === guestId; });
    if (!g) return;
    if (tableId && guestsAt(tableId).length >= SEATS) {
      flash("Esa mesa ya está completa (" + SEATS + " plazas).");
      return;
    }
    g.table = tableId;
    selected = null;
    render();
  }

  var toastTimer;
  function flash(msg) {
    var t = app.querySelector(".seating__toast");
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-visible"); }, 2200);
  }

  function chip(g) {
    var c = el("button", "guest", g.name);
    c.type = "button";
    c.draggable = true;
    c.style.setProperty("--c", GROUPS[g.group].color);
    if (selected === g.id) c.classList.add("is-selected");
    c.addEventListener("click", function () {
      selected = selected === g.id ? null : g.id;
      render();
    });
    c.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", g.id);
      e.dataTransfer.effectAllowed = "move";
    });
    return c;
  }

  function tableNode(t) {
    var seated = guestsAt(t.id);
    var wrap = el("div", "table");
    if (selected) wrap.classList.add("is-target");
    if (seated.length >= SEATS) wrap.classList.add("is-full");

    var round = el("div", "table__round");
    var center = el("div", "table__center");
    center.appendChild(el("strong", null, t.name));
    center.appendChild(el("span", null, seated.length + " / " + SEATS));
    round.appendChild(center);

    for (var i = 0; i < SEATS; i++) {
      var angle = (i / SEATS) * Math.PI * 2 - Math.PI / 2;
      var s = el("div", "seat");
      s.style.left = 50 + 46 * Math.cos(angle) + "%";
      s.style.top = 50 + 46 * Math.sin(angle) + "%";
      var g = seated[i];
      if (g) {
        s.classList.add("is-taken");
        s.textContent = initials(g.name);
        s.title = g.name + " · toca para quitar";
        s.style.setProperty("--c", GROUPS[g.group].color);
        s.setAttribute("role", "button");
        s.tabIndex = 0;
        (function (id) {
          function free(e) { e.stopPropagation(); seat(id, null); }
          s.addEventListener("click", free);
          s.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") free(e); });
        })(g.id);
      }
      round.appendChild(s);
    }

    wrap.appendChild(round);
    wrap.addEventListener("click", function () { if (selected) seat(selected, t.id); });
    wrap.addEventListener("dragover", function (e) { e.preventDefault(); wrap.classList.add("is-over"); });
    wrap.addEventListener("dragleave", function () { wrap.classList.remove("is-over"); });
    wrap.addEventListener("drop", function (e) {
      e.preventDefault();
      wrap.classList.remove("is-over");
      seat(e.dataTransfer.getData("text/plain"), t.id);
    });
    return wrap;
  }

  function render() {
    var list = app.querySelector(".seating__guests");
    var floor = app.querySelector(".seating__floor");
    var pending = state.guests.filter(function (g) { return !g.table; });

    list.innerHTML = "";
    Object.keys(GROUPS).forEach(function (key) {
      var inGroup = pending.filter(function (g) { return g.group === key; });
      if (!inGroup.length) return;
      var block = el("div", "guest-group");
      var h = el("p", "guest-group__title", GROUPS[key].label);
      h.style.setProperty("--c", GROUPS[key].color);
      block.appendChild(h);
      var row = el("div", "guest-group__chips");
      inGroup.forEach(function (g) { row.appendChild(chip(g)); });
      block.appendChild(row);
      list.appendChild(block);
    });
    if (!pending.length) list.appendChild(el("p", "seating__done", "¡Todos sentados! 🥂"));

    floor.innerHTML = "";
    state.tables.forEach(function (t) { floor.appendChild(tableNode(t)); });

    var total = state.guests.length;
    var done = total - pending.length;
    app.querySelector(".seating__count").textContent = done + " de " + total + " invitados sentados";
    app.querySelector(".seating__bar span").style.width = (done / total) * 100 + "%";
    app.querySelector(".seating__hint").textContent = selected
      ? "Ahora toca la mesa donde quieres sentar a " + state.guests.find(function (g) { return g.id === selected; }).name + "."
      : "Arrastra un invitado a una mesa, o tócalo y después toca la mesa.";
  }

  // Lista de invitados: soltar aquí devuelve al invitado
  var list = app.querySelector(".seating__guests");
  list.addEventListener("dragover", function (e) { e.preventDefault(); });
  list.addEventListener("drop", function (e) { e.preventDefault(); seat(e.dataTransfer.getData("text/plain"), null); });

  app.querySelector("[data-action=add]").addEventListener("click", function () {
    var n = state.tables.length;
    state.tables.push({ id: "t" + Date.now(), name: "Mesa " + n });
    render();
  });
  app.querySelector("[data-action=reset]").addEventListener("click", function () {
    state = initial(); selected = null; render();
  });

  state = initial();
  render();
})();
