import React from "react";

export default function MochilaPDFView({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-4xl mx-auto px-10 py-10">
        <header className="border-b border-slate-300 pb-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 mb-3">
            Ligerito
          </p>

          <div className="flex justify-between items-start gap-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                {data.nombreMochila}
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                Creador: <span className="font-semibold">{data.usuarioNombre}</span>
              </p>
              <p className="text-sm text-slate-600">
                Fecha: <span className="font-semibold">{data.fechaExportacion}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Peso total
              </p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {data.pesoTotal} g
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500 mt-5">
            {data.categorias.length} categorías · {data.totalItemsDistintos} items ·{" "}
            {data.totalUnidades} items en total.
          </p>
        </header>

        <main className="space-y-8">
          {data.categorias.map((categoria) => (
            <section key={categoria.nombre}>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-4">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                  {categoria.nombre}
                </h2>
                <span className="text-sm font-bold text-slate-600">
                  {categoria.pesoCategoria} g
                </span>
              </div>

              <div className="space-y-3">
                {categoria.items.length > 0 ? (
                  categoria.items.map((item) => (
                    <div key={item.id} className="pl-1">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-4 h-4 border border-slate-500 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 break-words">
                              {item.nombre} x{item.cantidad}
                            </p>
                            {item.descripcion && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                {item.descripcion}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-slate-700 shrink-0">
                          {item.pesoLinea} g
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm italic text-slate-400">
                    Sin objetos en esta categoría
                  </p>
                )}
              </div>
            </section>
          ))}
        </main>

        <footer className="border-t border-slate-300 mt-10 pt-4">
          <p className="text-xs text-slate-400">
            Exportado desde Ligerito
          </p>
        </footer>
      </div>
    </div>
  );
}