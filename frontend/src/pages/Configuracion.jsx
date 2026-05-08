import React from "react";
import Footer from "../components/Footer";

export default function Configuracion({ usuario, onVolver, onEliminarCuenta }) {
  const iniciales = usuario?.nick
    ? usuario.nick.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-4xl mx-auto w-full">
        <button
          onClick={onVolver}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 space-y-1">
            {/* Perfil — sin funcionalidad por ahora
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 transition-colors text-sm font-medium cursor-pointer">
              <span className="material-symbols-outlined text-base">person</span>
              Perfil
            </button>
            */}
            {/* Preferencias — sin funcionalidad por ahora
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 transition-colors text-sm font-medium cursor-pointer">
              <span className="material-symbols-outlined text-base">settings</span>
              Preferencias
            </button>
            */}
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-700 font-semibold text-sm cursor-pointer">
              <span className="material-symbols-outlined text-base">delete_forever</span>
              Eliminar Cuenta
            </button>
          </aside>

          <section className="lg:col-span-9 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <header className="mb-8">
              <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Acción Crítica
              </span>
              <h1 className="text-2xl font-black text-slate-800 mb-1">
                Eliminar Cuenta
              </h1>
              <p className="text-slate-500 text-sm">
                Gestiona la permanencia de tus datos en la plataforma Ligerito.
              </p>
            </header>

            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg">
                  {iniciales}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    Usuario Actual
                  </p>
                  <p className="font-bold text-slate-800">{usuario?.nick}</p>
                  <p className="text-slate-500 text-sm">{usuario?.email}</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-red-100 bg-red-50 rounded-lg p-5 mb-8">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-red-500 text-3xl mt-0.5">warning</span>
                <div className="space-y-2">
                  <h4 className="font-bold text-red-700">
                    Advertencia: esta acción no se puede deshacer
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Al eliminar tu cuenta perderás todos tus listados de equipo,
                    mochilas y configuraciones de peso. No podremos recuperar
                    tus datos en el futuro.
                  </p>
                  <ul className="text-slate-600 text-sm list-disc list-inside space-y-1">
                    <li>Se eliminarán todas las mochilas creadas.</li>
                    <li>Se eliminará todo tu armario de equipamiento.</li>
                    <li>Perderás acceso a la comunidad Ligerito.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-6 border-t border-slate-200">
              <button
                onClick={onVolver}
                className="text-slate-500 hover:text-slate-800 text-sm font-medium px-6 py-3 transition-colors cursor-pointer"
              >
                Cancelar y volver
              </button>
              <button
                onClick={() => {
                  if (window.confirm("¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
                    onEliminarCuenta();
                  }
                }}
                className="bg-red-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">delete_forever</span>
                Eliminar Cuenta permanentemente
              </button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
