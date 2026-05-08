import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { getMochilasPublicas } from "../services/apiMochilas";

export default function Explorar({ onVolver, onVerDetalle }) {
  const [mochilasPublicas, setMochilasPublicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarMochilasPublicas = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getMochilasPublicas();
        setMochilasPublicas(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las mochilas públicas.");
      } finally {
        setLoading(false);
      }
    };

    cargarMochilasPublicas();
  }, []);

  return (
    <div className="flex flex-col min-h-full w-full animate-in fade-in duration-500">
      <div className="p-10 max-w-5xl mx-auto w-full flex-1">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Comunidad
          </h2>
          <p className="text-slate-500 mt-1 italic">
            Inspírate en las listas de otros viajeros y compara pesos.
          </p>
        </div>

        <button
          onClick={onVolver}
          className="px-6 py-2.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-sm transition-all active:scale-95"
        >
          Volver a mi mochila
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm text-slate-500 italic">
          Cargando mochilas públicas...
        </div>
      )}

      {!loading && error && (
        <div className="bg-white rounded-[2rem] p-8 border border-red-100 shadow-sm text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && mochilasPublicas.length === 0 && (
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm text-slate-500 italic">
          Todavía no hay mochilas públicas disponibles.
        </div>
      )}

      {!loading && !error && mochilasPublicas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mochilasPublicas.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-default"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-4 py-1.5 rounded-full">
                Pública
              </span>

              <h3 className="text-2xl font-black text-slate-800 mt-6 group-hover:text-blue-600 transition-colors">
                {m.nombre}
              </h3>

              <p className="text-sm text-slate-400 mb-8">
                Lista compartida por{" "}
                <span className="font-bold text-slate-600">
                  {m.nickUsuario}
                </span>
              </p>

              <div className="flex justify-between items-end border-t border-slate-50 pt-6">
                <div>
                  <div className="text-3xl font-black text-slate-800">
                    {m.pesoTotal}{" "}
                    <span className="text-sm text-slate-400">G</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                    Peso Total
                  </div>
                </div>

                <button
                  onClick={() => onVerDetalle(m)}
                  className="bg-slate-800 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-all font-bold text-sm cursor-pointer shadow-lg shadow-slate-200"
                >
                  Consultar Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
}