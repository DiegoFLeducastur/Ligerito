import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ResumenPesos from './components/ResumenPesos';
import ListaCategorias from './components/ListaCategorias';
import Explorar from './pages/Explorar';
import DetalleComunidad from './pages/DetalleComunidad'; 
import Login from './pages/Login'; 
import Registro from './pages/Registro';
import { useMochilas } from './hooks/useMochilas';

function App() {
  const [pantallaActual, setPantallaActual] = useState("principal");
  const [mochilaSeleccionada, setMochilaSeleccionada] = useState(null);

  const {
    listas,
    mochilaActiva,
    idListaActiva,
    setIdListaActiva,
    inventarioGeneral,
    crearNuevaLista,
    borrarLista,
    actualizarNombreLista,
    togglePublica,
    manejarNuevoItem,
    cambiarCantidad,
    eliminarObjeto,
    añadirCategoria,
    eliminarCategoria,
    actualizarEnlaceItem // <--- AÑADIDO AQUÍ (Importante extraerlo del Hook)
  } = useMochilas();

  // Gestión de sesión
  if (pantallaActual === "login") return <Login onLogin={() => setPantallaActual("principal")} onIrARegistro={() => setPantallaActual("registro")} />;
  if (pantallaActual === "registro") return <Registro onRegistro={() => setPantallaActual("principal")} onIrALogin={() => setPantallaActual("login")} />;

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-sans">
      <Sidebar 
        listas={listas} 
        idListaActiva={idListaActiva} 
        onSeleccionarLista={(id) => { 
          setIdListaActiva(id); 
          setPantallaActual("principal"); 
        }}
        onCrearLista={crearNuevaLista} 
        onBorrarLista={borrarLista}
        inventario={inventarioGeneral} 
        onAñadirAlInventario={manejarNuevoItem}
      />

      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        {/* COMUNIDAD */}
        {pantallaActual === "explorar" && (
          <Explorar 
            onVolver={() => setPantallaActual("principal")} 
            onVerDetalle={(m) => {
              setMochilaSeleccionada(m);
              setPantallaActual("detalle-comunidad");
            }}
          />
        )}

        {/* DETALLE DE MOCHILA AJENA */}
        {pantallaActual === "detalle-comunidad" && (
          <DetalleComunidad 
            mochila={mochilaSeleccionada} 
            onVolver={() => setPantallaActual("explorar")} 
          />
        )}

        {/* VISTA PRINCIPAL (Nuestra Mochila) */}
        {pantallaActual === "principal" && (
          <>
            <Header 
              nombreMochila={mochilaActiva.nombre} 
              esPublica={mochilaActiva.publica} 
              onTogglePublica={togglePublica}
              onActualizarNombre={actualizarNombreLista} 
              onLogout={() => setPantallaActual("login")}
              onIrAExplorar={() => setPantallaActual("explorar")}
            />
            <main className="p-6 max-w-4xl mx-auto w-full">
              <ResumenPesos 
                listaDeObjetos={mochilaActiva.objetos} 
                categorias={mochilaActiva.categorias || []} 
              />
              <ListaCategorias 
                listaDeObjetos={mochilaActiva.objetos} 
                categorias={mochilaActiva.categorias || []} 
                onAñadirCategoria={añadirCategoria}
                onEliminarCategoria={eliminarCategoria}
                onCambiarCantidad={cambiarCantidad} 
                onEliminar={eliminarObjeto} 
                onNuevoItem={manejarNuevoItem} 
                onActualizarEnlace={actualizarEnlaceItem} // <--- Pasamos la función al hijo
              />
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default App;