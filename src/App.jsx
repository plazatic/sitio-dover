import { useEffect, useMemo, useState } from "react";

// --- Datos de ejemplo: reemplaza con tus marcas reales ---
const MARCAS_INICIALES = [
  {
    id: "m1",
    nombre: "Dover Back",
    tipo: "Rubio",
    fortaleza: "Medio",
    nicotina: "0.7 mg*",
    alquitran: "8 mg*",
    monoxido: "10 mg*",
    pais: "Paraguay",
    formatos: ["20 cigarrillos"],
    descripcion:
      "Sabor equilibrado con notas clásicas. Hecho para fumadores que buscan un perfil tradicional.",
    popularidad: 95,
    lanzamiento: 2022,
    imagen: "/img/marcas/DOVER_BACK.webp",
  },
  {
    id: "m2",
    nombre: "Dover Fior",
    tipo: "Rubio",
    fortaleza: "Suave",
    nicotina: "0.5 mg*",
    alquitran: "6 mg*",
    monoxido: "7 mg*",
    pais: "Paraguay",
    formatos: ["20 cigarrillos"],
    descripcion:
      "Refrescante perfil mentolado con arranque suave y final limpio.",
    popularidad: 88,
    lanzamiento: 2023,
    imagen: "/img/marcas/DOVER_FIOR.webp",
  },
  {
    id: "m3",
    nombre: "Dover Rojo",
    tipo: "Rubio",
    fortaleza: "Suave",
    nicotina: "0.4 mg*",
    alquitran: "5 mg*",
    monoxido: "6 mg*",
    pais: "Paraguay",
    formatos: ["10 / 20 cigarrillos"],
    descripcion:
      "Mezcla rubia de cuerpo ligero, pensada para un quemado parejo.",
    popularidad: 76,
    lanzamiento: 2021,
    imagen: "/img/marcas/DOVER_ROJO.webp",
  },
  {
    id: "m4",
    nombre: "Dover Tabaco Negro",
    tipo: "Negro",
    fortaleza: "Fuerte",
    nicotina: "0.9 mg*",
    alquitran: "10 mg*",
    monoxido: "12 mg*",
    pais: "Paraguay",
    formatos: ["20 cigarrillos"],
    descripcion:
      "Perfil intenso y tostado, dirigido a fumadores que prefieren carácter.",
    popularidad: 81,
    lanzamiento: 2020,
    imagen: "/img/marcas/DOVER_TABACO_NEGRO.webp",
  },
];

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm transition-all hover:shadow ${
        active
          ? "bg-zinc-900 text-white border-zinc-900"
          : "bg-white text-zinc-700 border-zinc-300"
      }`}
    >
      {children}
    </button>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 max-h-[85vh] w-[min(780px,95vw)] overflow-auto rounded-2xl bg-white p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export default function TobaccoBrandShowcase() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [fortaleza, setFortaleza] = useState("Todas");
  const [pais, setPais] = useState("Todos");
  const [orden, setOrden] = useState("popularidad");
  const [marcas, setMarcas] = useState(MARCAS_INICIALES);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    const ok = localStorage.getItem("ageVerified");
    if (ok === "true") setAgeVerified(true);
  }, []);

  const resultados = useMemo(() => {
    let out = [...marcas];

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (m) =>
          m.nombre.toLowerCase().includes(q) ||
          m.descripcion.toLowerCase().includes(q) ||
          m.tipo.toLowerCase().includes(q) ||
          (m.pais || "").toLowerCase().includes(q)
      );
    }

    if (tipo !== "Todos") out = out.filter((m) => m.tipo === tipo);
    if (fortaleza !== "Todas")
      out = out.filter((m) => m.fortaleza === fortaleza);
    if (pais !== "Todos") out = out.filter((m) => (m.pais || "") === pais);

    switch (orden) {
      case "popularidad":
        out.sort((a, b) => b.popularidad - a.popularidad);
        break;
      case "nombre":
        out.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "lanzamiento":
        out.sort((a, b) => b.lanzamiento - a.lanzamiento);
        break;
    }

    return out;
  }, [marcas, search, tipo, fortaleza, pais, orden]);

  const paises = useMemo(() => {
    const set = new Set(marcas.map((m) => m.pais).filter(Boolean));
    return ["Todos", ...Array.from(set)];
  }, [marcas]);

  const handleAddMarca = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nueva = {
      id: crypto.randomUUID(),
      nombre: data.get("nombre")?.toString() || "Nueva Marca",
      tipo: data.get("tipo")?.toString() || "Rubio",
      fortaleza: data.get("fortaleza")?.toString() || "Medio",
      nicotina: data.get("nicotina")?.toString() || "—",
      alquitran: data.get("alquitran")?.toString() || "—",
      monoxido: data.get("monoxido")?.toString() || "—",
      pais: data.get("pais")?.toString() || "Paraguay",
      formatos: (data.get("formatos")?.toString() || "20 cigarrillos")
        .split(",")
        .map((s) => s.trim()),
      descripcion: data.get("descripcion")?.toString() || "Descripción pendiente.",
      popularidad: Number(data.get("popularidad") || 50),
      lanzamiento: Number(data.get("lanzamiento") || new Date().getFullYear()),
    };
    setMarcas((prev) => [nueva, ...prev]);

    // ✅ JS puro (sin TypeScript): cerrar el modal si existe
    const btn = document.getElementById("modal-add-close");
    if (btn && typeof btn.click === "function") btn.click();

    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Age Gate */}
      {!ageVerified && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-900/90 p-6">
          <div className="w-[min(680px,95vw)] rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-4 text-center">
              <h1 className="text-2xl font-semibold">Acceso solo para mayores de 18 años</h1>
              <p className="mt-2 text-sm text-neutral-600">
                Este sitio expone marcas de cigarrillos. <strong>Fumar es perjudicial para la salud</strong>.
                El ingreso está permitido únicamente a personas mayores de 18 años.
              </p>
            </div>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                className="w-full rounded-xl bg-neutral-900 px-5 py-3 text-white shadow hover:opacity-90 sm:w-auto"
                onClick={() => {
                  localStorage.setItem("ageVerified", "true");
                  setAgeVerified(true);
                }}
              >
                Soy mayor de 18 años
              </button>
              <a
                href="https://www.who.int/health-topics/tobacco#tab=tab_1"
                className="w-full rounded-xl border border-neutral-300 px-5 py-3 text-center text-neutral-700 hover:bg-neutral-100 sm:w-auto"
              >
                Más información sobre riesgos
              </a>
            </div>
            <p className="mt-4 text-center text-xs text-neutral-500">
              *Valores químicos ilustrativos. Reemplazar con datos oficiales de empaque según normativa local.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-900 text-white">TB</div>
            <div>
              <h2 className="text-lg font-semibold">Tabacos Dover</h2>
              <p className="text-xs text-neutral-500">Expositor de marcas</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <a href="#contacto" className="rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
              Contacto
            </a>
            <a href="#legal" className="rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
              Legal
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Marcas de cigarrillos</h1>
              <p className="mt-2 max-w-2xl text-neutral-600">
                Catálogo informativo para mayoristas y puntos de venta. <strong>Prohibida su venta a menores de 18 años.</strong>
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs text-neutral-600">
              <p className="leading-5"><strong>Advertencia sanitaria:</strong> Fumar es perjudicial para la salud. Contiene nicotina y genera adicción.</p>
            </div>
          </div>

          {/* Controles 
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-12">
            <input
              className="col-span-12 rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900 sm:col-span-5"
              placeholder="Buscar por nombre, tipo o país..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="col-span-12 flex flex-wrap items-center gap-2 sm:col-span-7 sm:justify-end">
              <div className="flex items-center gap-2">
                {["Todos", "Rubio", "Negro"].map((t) => (
                  <Pill key={t} active={tipo === t} onClick={() => setTipo(t)}>
                    {t}
                  </Pill>
                ))}
              </div>
              <div className="hidden h-6 w-px bg-neutral-300 sm:block" />
              <div className="flex items-center gap-2">
                {["Todas", "Suave", "Medio", "Fuerte"].map((f) => (
                  <Pill key={f} active={fortaleza === f} onClick={() => setFortaleza(f)}>
                    {f}
                  </Pill>
                ))}
              </div>
              <div className="hidden h-6 w-px bg-neutral-300 sm:block" />
              <select
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
              >
                {paises.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="popularidad">Ordenar: Popularidad</option>
                <option value="nombre">Ordenar: Nombre</option>
                <option value="lanzamiento">Ordenar: Lanzamiento</option>
              </select>

                {/* Botón: Agregar marca 
              <button
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:opacity-90"
                onClick={() => {
                  // ✅ JS puro (sin TypeScript): abrir el <dialog> si soporta showModal
                  const dialog = document.getElementById("modal-add");
                  if (dialog && "showModal" in dialog) dialog.showModal();
                }}
              >
                + Agregar marca
              </button> 
            </div> 
          </div>  */}
        </div> 
      </section> 

      {/* Grilla de tarjetas */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {resultados.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-neutral-600">
            No se encontraron resultados con los filtros aplicados.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resultados.map((m) => (
              <article
                key={m.id}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="absolute right-3 top-3 rounded-full bg-neutral-900 px-3 py-1 text-xs text-white">
                  {m.tipo}
                </div>
                <div className="h-52 w-full bg-neutral-100 p-4">
                  <img
                   src={m.imagen}
                   alt={`Presentación de ${m.nombre}`}
                   className="h-full w-full object-contain"
                   loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{m.nombre}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{m.descripcion}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                    <span className="rounded-full border border-neutral-300 px-2 py-1">{m.fortaleza}</span>
                    <span className="rounded-full border border-neutral-300 px-2 py-1">{m.pais}</span>
                    <span className="rounded-full border border-neutral-300 px-2 py-1">{m.lanzamiento}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-neutral-500">
                      Nicotina {m.nicotina} · Alquitrán {m.alquitran}
                    </div>
                    <button
                      onClick={() => setDetalle(m)}
                      className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
                <div className="border-t border-neutral-200 bg-neutral-50 p-3 text-center text-[11px] text-neutral-600">
                  <strong>Advertencia:</strong> Fumar es perjudicial para la salud.
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Detalle de marca */}
      <Modal open={!!detalle} onClose={() => setDetalle(null)}>
        {detalle && (
              <div className="space-y-4">
                <div className="flex justify-center rounded-xl bg-neutral-100 p-6">
                  <img
                    src={detalle.imagen}
                    alt={`Presentación de ${detalle.nombre}`}
                    className="max-h-80 max-w-full object-contain"
                  />
                </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{detalle.nombre}</h3>
                <p className="mt-1 text-sm text-neutral-600">{detalle.descripcion}</p>
              </div>
              <button
                className="rounded-lg border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
                onClick={() => setDetalle(null)}
              >
                Cerrar
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 p-4">
                <h4 className="text-sm font-medium">Características</h4>
                <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                  <li>Tipo: {detalle.tipo}</li>
                  <li>Fortaleza: {detalle.fortaleza}</li>
                  <li>País: {detalle.pais}</li>
                  <li>Lanzamiento: {detalle.lanzamiento}</li>
                </ul>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4">
                <h4 className="text-sm font-medium">Composición* (por cigarrillo)</h4>
                <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                  <li>Nicotina: {detalle.nicotina}</li>
                  <li>Alquitrán: {detalle.alquitran}</li>
                  <li>Monóxido de carbono: {detalle.monoxido}</li>
                </ul>
                <p className="mt-2 text-xs text-neutral-500">*Valores ilustrativos; sustituir por datos oficiales del empaque.</p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4">
                <h4 className="text-sm font-medium">Formatos</h4>
                <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                  {detalle.formatos?.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
              <strong>Advertencia:</strong> Fumar es perjudicial para la salud y genera adicción. Prohibida su venta a menores de 18 años.
            </div>
          </div>
        )}
      </Modal>

      {/* Modal agregar marca */}
      <dialog id="modal-add" className="rounded-2xl p-0">
        <form method="dialog">
          <button id="modal-add-close" className="absolute right-3 top-3 rounded-lg border border-neutral-300 px-2 py-1 text-sm">
            Cerrar
          </button>
        </form>
        <div className="w-[min(920px,95vw)] max-w-[92vw] rounded-2xl bg-white p-6 shadow-2xl">
          <h3 className="text-lg font-semibold">Agregar nueva marca</h3>
          <form className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleAddMarca}>
            <label className="text-sm">
              <span>Nombre</span>
              <input name="nombre" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" required />
            </label>
            <label className="text-sm">
              <span>Tipo</span>
              <select name="tipo" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2">
                <option>Rubio</option>
                <option>Negro</option>
              </select>
            </label>
            <label className="text-sm">
              <span>Fortaleza</span>
              <select name="fortaleza" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2">
                <option>Suave</option>
                <option>Medio</option>
                <option>Fuerte</option>
              </select>
            </label>
            <label className="text-sm">
              <span>País</span>
              <input name="pais" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" defaultValue="Paraguay" />
            </label>
            <label className="text-sm">
              <span>Nicotina</span>
              <input name="nicotina" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" placeholder="ej: 0.7 mg" />
            </label>
            <label className="text-sm">
              <span>Alquitrán</span>
              <input name="alquitran" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" placeholder="ej: 8 mg" />
            </label>
            <label className="text-sm">
              <span>Monóxido</span>
              <input name="monoxido" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" placeholder="ej: 10 mg" />
            </label>
            <label className="text-sm">
              <span>Formatos</span>
              <input name="formatos" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" placeholder="ej: 20 cigarrillos, 10 cigarrillos" />
            </label>
            <label className="col-span-1 sm:col-span-2 text-sm">
              <span>Descripción</span>
              <textarea name="descripcion" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" rows={3} />
            </label>
            <label className="text-sm">
              <span>Popularidad (0–100)</span>
              <input name="popularidad" type="number" min={0} max={100} defaultValue={50} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span>Año de lanzamiento</span>
              <input name="lanzamiento" type="number" defaultValue={new Date().getFullYear()} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" />
            </label>
            <div className="col-span-1 sm:col-span-2 mt-2 flex items-center justify-end gap-2">
              <button type="submit" className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white">Guardar</button>
            </div>
          </form>
        </div>
      </dialog>
      {/* Contacto */}
<section id="contacto" className="border-t border-neutral-200 bg-white">
  <div className="mx-auto max-w-6xl px-4 py-10">
    <h3 className="text-xl font-semibold">Contacto comercial</h3>
    <p className="mt-1 text-neutral-600">
      Para consultas comerciales, distribución o información sobre nuestros
      productos, completá el formulario.
    </p>
    <form
      action="https://formspree.io/f/xzdnkppa"
      method="POST"
      className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <label className="text-sm">
        <span>Nombre y apellido</span>
        <input
          type="text"
          name="nombre"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          required
        />
      </label>
      <label className="text-sm">
        <span>Correo electrónico</span>
        <input
          type="email"
          name="email"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          required
        />
      </label>
      <label className="text-sm">
        <span>Empresa</span>
        <input
          type="text"
          name="empresa"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>
      <label className="text-sm">
        <span>Teléfono</span>
        <input
          type="tel"
          name="telefono"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>
      <label className="col-span-1 text-sm sm:col-span-2">
        <span>Mensaje</span>
        <textarea
          name="message"
          rows={4}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          placeholder="Escribí tu consulta..."
          required
        />
      </label>
      <input
        type="hidden"
        name="_subject"
        value="Nueva consulta desde la web de Dover"
      />
      <div className="col-span-1 flex justify-end sm:col-span-2">
        <button
          type="submit"
          className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm text-white"
        >
          Enviar mensaje
        </button>
      </div>
    </form>
  </div>
</section>
      {/* Legal */}
      <section id="legal" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-700">
          <h3 className="text-lg font-semibold">Marketing responsable</h3>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Prohibida la venta a menores de 18 años (Paraguay).</li>
            <li>Evitar mensajes que incentiven el consumo. Este catálogo es informativo para canales comerciales.</li>
            <li>Incluir advertencias sanitarias visibles en cada ficha y en la página.</li>
            <li>Respetar la normativa local sobre publicidad, empaquetado y uso de marcas registradas.</li>
          </ul>
          <p className="mt-3 text-xs text-neutral-500">
            © {new Date().getFullYear()} Tabacos Dover.
          </p>
        </div>
      </section>
    </div>
  );
}