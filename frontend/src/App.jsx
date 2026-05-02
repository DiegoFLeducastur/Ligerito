import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ResumenPesos from "./components/ResumenPesos";
import ListaCategorias from "./components/ListaCategorias";
import Explorar from "./pages/Explorar";
import DetalleComunidad from "./pages/DetalleComunidad";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Landing from "./pages/Landing";
import { useMochilas } from "./hooks/useMochilas";
import { useArmario } from "./hooks/useArmario";
import { useMochilasBackend } from "./hooks/useMochilasBackend";
import {
  getCategorias,
  createCategoria as createCategoriaApi,
  deleteCategoria as deleteCategoriaApi,
} from "./services/apiCategorias";

function App() {
  const [pantallaActual, setPantallaActual] = useState("landing");
  const [mochilaSeleccionada, setMochilaSeleccionada] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const {
    armario: armarioBackend,
    cargar: cargarArmario,
    crear: crearArmario,
    eliminar: eliminarArmario,
  } = useArmario();

  const {
    cargar: cargarMochilasBackend,
    crear: crearMochilaBackend,
    actualizar: actualizarMochilaBackend,
    eliminar: eliminarMochilaBackend,
  } = useMochilasBackend();

  const manejarNuevoItemReal = async (datos) => {
    // Caso 1: ya viene del armario backend (por ejemplo desde el Sidebar)
    if (datos.itemArmarioId || datos.id) {
      manejarNuevoItem(datos);
      return;
    }

    // Caso 2: item nuevo creado desde una mochila
    try {
      const itemCreado = await crearArmario({
        nombre: datos.nombre,
        peso: Number(datos.peso),
        descripcion: datos.descripcion ?? "",
        enlace: datos.enlace ?? "",
        usuarioId: usuarioActual.id,
      });

      manejarNuevoItem({
        ...itemCreado,
        itemArmarioId: itemCreado.id,
        categoria: datos.categoria,
      });
    } catch (error) {
      console.error("Error creando item en backend:", error);
    }
  };

  const eliminarItemArmarioBackend = async (id) => {
    try {
      await eliminarArmario(id);
      eliminarItemInventario(id);
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el item del armario en el servidor");
    }
  };

  const borrarListaReal = async (id) => {
    try {
      await eliminarMochilaBackend(id);
      borrarLista(id);
    } catch (error) {
      console.error(error);
      alert("No se pudo borrar la mochila");
    }
  };

  const {
    actualizarDescripcionItem,
    listas,
    mochilaActiva,
    idListaActiva,
    setIdListaActiva,
    crearNuevaLista,
    borrarLista,
    actualizarNombreLista,
    togglePublica,
    manejarNuevoItem,
    cambiarCantidad,
    eliminarObjeto,
    añadirCategoria,
    eliminarCategoria,
    actualizarEnlaceItem,
    actualizarPesoItem,
    eliminarItemInventario,
    hidratarListasDesdeBackend,
    agregarListaPersistida,
  } = useMochilas(cargarArmario);

  const cargarMochilasConCategorias = async (usuarioId) => {
    const mochilas = await cargarMochilasBackend(usuarioId);

    const mochilasConCategorias = await Promise.all(
      mochilas.map(async (mochila) => {
        const categoriasResponse = await getCategorias(mochila.id);

        return {
          ...mochila,
          categorias: categoriasResponse.map((c) => c.nombre),
        };
      }),
    );

    hidratarListasDesdeBackend(mochilasConCategorias);
  };

  const añadirCategoriaReal = async (nombreCat) => {
    if (!idListaActiva) return;

    try {
      await createCategoriaApi({
        nombre: nombreCat,
        mochilaId: idListaActiva,
      });

      añadirCategoria(nombreCat);
      await cargarMochilasConCategorias(usuarioActual.id);
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la categoría");
    }
  };

  const eliminarCategoriaReal = async (nombreCat) => {
    if (!idListaActiva) return;

    try {
      const categoriasBackend = await getCategorias(idListaActiva);

      const categoria = categoriasBackend.find((c) => c.nombre === nombreCat);

      if (!categoria) {
        alert("No se encontró la categoría en el servidor");
        return;
      }

      await deleteCategoriaApi(categoria.id);

      eliminarCategoria(nombreCat);
      await cargarMochilasConCategorias(usuarioActual.id);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la categoría");
    }
  };

  const crearNuevaListaReal = async (nombre) => {
    try {
      const creada = await crearMochilaBackend({
        nombre,
        esPublica: false,
        usuarioId: usuarioActual.id,
      });

      agregarListaPersistida({
        ...creada,
        categorias: [],
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la mochila");
    }
  };

  const actualizarNombreListaReal = async (nuevoNombre) => {
    if (!idListaActiva) return;

    try {
      await actualizarMochilaBackend(idListaActiva, { nombre: nuevoNombre });
      actualizarNombreLista(nuevoNombre);
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el nombre");
    }
  };

  const togglePublicaReal = async () => {
    if (!idListaActiva) return;

    try {
      await actualizarMochilaBackend(idListaActiva, {
        esPublica: !mochilaActiva.publica,
      });
      togglePublica();
    } catch (error) {
      console.error(error);
      alert("No se pudo cambiar la visibilidad");
    }
  };

  // Gestión de sesión
  if (!usuarioActual) {
    if (pantallaActual === "landing") {
      return (
        <Landing
          onIrLogin={() => setPantallaActual("login")}
          onIrRegistro={() => setPantallaActual("registro")}
        />
      );
    }

    if (pantallaActual === "registro") {
      return (
        <Registro
          onRegistro={() => setPantallaActual("login")}
          onIrALogin={() => setPantallaActual("login")}
        />
      );
    }

    return (
      <Login
        onLogin={async (usuario) => {
          setUsuarioActual(usuario);
          await cargarArmario();
          await cargarMochilasConCategorias(usuario.id);
          setPantallaActual("principal");
        }}
        onIrARegistro={() => setPantallaActual("registro")}
      />
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-sans">
      <Sidebar
        listas={listas}
        idListaActiva={idListaActiva}
        onSeleccionarLista={(id) => {
          setIdListaActiva(id);
          setPantallaActual("principal");
        }}
        onCrearLista={crearNuevaListaReal}
        onBorrarLista={borrarListaReal}
        inventario={armarioBackend}
        onAñadirAlInventario={manejarNuevoItemReal}
        onEliminarDelInventario={eliminarItemArmarioBackend}
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
              onTogglePublica={togglePublicaReal}
              onActualizarNombre={actualizarNombreListaReal}
              onLogout={() => {
                setUsuarioActual(null);
                setPantallaActual("login");
              }}
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
                onAñadirCategoria={añadirCategoriaReal}
                onEliminarCategoria={eliminarCategoriaReal}
                onCambiarCantidad={cambiarCantidad}
                onEliminar={eliminarObjeto}
                onNuevoItem={manejarNuevoItemReal}
                onActualizarEnlace={actualizarEnlaceItem}
                onActualizarPeso={actualizarPesoItem}
                onActualizarDescripcion={actualizarDescripcionItem}
              />
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
