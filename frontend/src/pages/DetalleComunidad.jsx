import React, { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import ResumenPesos from "../components/ResumenPesos";
import FilaItem from "../components/FilaItem";
import { getMochilaPublicaDetalle } from "../services/apiMochilas";

export default function DetalleComunidad({ mochila, onVolver }) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDetalle = async () => {
      if (!mochila?.id) return;

      try {
        setLoading(true);
        setError("");
        const data = await getMochilaPublicaDetalle(mochila.id);
        setDetalle(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el detalle de la mochila pública.");
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle();
  }, [mochila?.id]);

  const detalleObjetos = useMemo(() => {
    if (!detalle?.items) return [];

    return detalle.items.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      peso: item.peso,
      descripcion: item.descripcion ?? "",
      enlace: item.enlace ?? "",
      categoria: item.categoriaNombre,
      cant: item.cantidad,
    }));
  }, [detalle]);

  const categorias = useMemo(() => {
    if (Array.isArray(detalle?.categorias) && detalle.categorias.length > 0) {
      return detalle.categorias;
    }

    return Array.from(
      new Set(detalleObjetos.map((o) => o.categoria).filter(Boolean)),
    );
  }, [detalle?.categorias, detalleObjetos]);

  const itemsAgrupados = useMemo(() => {
    return categorias.map((cat) => ({
      nombre: cat,
      items: detalleObjetos.filter((item) => item.categoria === cat),
    }));
  }, [categorias, detalleObjetos]);

  const pesoTotalGramos = detalle?.pesoTotal ?? 0;
  const pesoTotalKg = (pesoTotalGramos / 1000).toFixed(2);

  if (!mochila) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">

      <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onVolver}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {detalle?.nombre ?? mochila.nombre}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Por {detalle?.nickUsuario ?? mochila.nickUsuario}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-black text-blue-600">
            {pesoTotalKg} <span className="text-sm text-slate-400">KG</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            Peso de referencia
          </p>
        </div>
      </header>

      <main className="p-8 max-w-4xl mx-auto w-full space-y-10">
        {loading && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-slate-500 italic">
            Cargando detalle de la mochila...
          </section>
        )}

        {!loading && error && (
          <section className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm text-red-500">
            {error}
          </section>
        )}

        {!loading && !error && (
          <>
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">
                Distribución de peso
              </h3>
              <ResumenPesos
                listaDeObjetos={detalleObjetos}
                categorias={categorias}
              />
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Listado de equipamiento
                </h3>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                  {detalleObjetos.length} OBJETOS
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {itemsAgrupados.map((grupo) => (
                  <div key={grupo.nombre}>
                    <div className="bg-slate-50/70 px-6 py-3 border-y border-slate-100">
                      <h4 className="font-black text-slate-700 text-[10px] uppercase tracking-[0.15em]">
                        {grupo.nombre}
                      </h4>
                    </div>

                    {grupo.items.length > 0 ? (
                      grupo.items.map((item) => (
                        <FilaItem
                          key={item.id ?? `${item.nombre}-${item.peso}`}
                          item={item}
                          esLectura
                        />
                      ))
                    ) : (
                      <div className="px-6 py-4 text-xs text-slate-400 italic">
                        Sin objetos en esta categoría
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
