import React from 'react';

// Recibimos la lista de objetos desde App.jsx
export default function ResumenPesos({ listaDeObjetos = [] }) {
  
  // 1. Calculamos el peso total sumando (peso * cantidad) de cada objeto
  // Usamos un bucle simple para que sea código de estudiante
  let pesoTotalGramos = 0;
  listaDeObjetos.forEach(obj => {
    pesoTotalGramos += (obj.peso * obj.cant);
  });

  // Lo pasamos a kg para mostrarlo
  const pesoTotalKg = (pesoTotalGramos / 1000).toFixed(2);

  // 2. Calculamos el peso por categorías para las barras
  const calcularPesoCategoria = (cat) => {
    let total = 0;
    listaDeObjetos.filter(obj => obj.categoria === cat).forEach(obj => {
      total += (obj.peso * obj.cant);
    });
    return total;
  };

  const pesoRopa = calcularPesoCategoria("Ropa");
  const pesoElectro = calcularPesoCategoria("Electrónica");
  
  // Calculamos porcentajes para las barras (con seguridad de no dividir por cero)
  const porcenRopa = pesoTotalGramos > 0 ? (pesoRopa / pesoTotalGramos) * 100 : 0;
  const porcenElectro = pesoTotalGramos > 0 ? (pesoElectro / pesoTotalGramos) * 100 : 0;

  return (
    <div style={{ marginBottom: '40px' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase text-slate-400">Distribución de Peso</h3>
        <div className="text-2xl font-bold text-slate-800">
          {pesoTotalKg} <span className="text-sm text-slate-400">KG</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-5">
          {/* Barra de Ropa */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-600">Ropa</span>
              <span className="text-slate-400">{(pesoRopa/1000).toFixed(1)}kg ({Math.round(porcenRopa)}%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${porcenRopa}%` }}
              ></div>
            </div>
          </div>

          {/* Barra de Electrónica */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-600">Electrónica</span>
              <span className="text-slate-400">{(pesoElectro/1000).toFixed(1)}kg ({Math.round(porcenElectro)}%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full">
              <div 
                className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${porcenElectro}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}