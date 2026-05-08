import { useState } from "react";
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
import {
  getItemsMochila,
  createItemMochila as createItemMochilaApi,
  patchItemMochila as patchItemMochilaApi,
  deleteItemMochila as deleteItemMochilaApi,
} from "./services/apiItemMochila";
import { prepararMochilaPDF } from "./utils/prepararMochilaPDF";
import { exportarMochilaPDF } from "./utils/exportarMochilaPDF.jsx";

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

  const {
    actualizarDescripcionItem,
    listas,
    mochilaActiva,
    idListaActiva,
    setIdListaActiva,
    borrarLista,
    actualizarNombreLista,
    togglePublica,
    actualizarEnlaceItem,
    actualizarPesoItem,
    eliminarItemInventario,
    hidratarListasDesdeBackend,
    agregarListaPersistida,
  } = useMochilas(cargarArmario);

  const sincronizarMochilas = async (usuarioId) => {
    const mochilas = await cargarMochilasBackend(usuarioId);

    const mochilasCompletas = await Promise.all(
      mochilas.map(async (mochila) => {
        const categoriasResponse = await getCategorias(mochila.id);
        const itemsResponse = await getItemsMochila(mochila.id);

        return {
          ...mochila,
          categorias: categoriasResponse.map((c) => c.nombre),
          objetos: itemsResponse.map((item) => ({
            id: item.id,
            itemArmarioId: item.itemArmarioId,
            nombre: item.nombre,
            peso: item.peso,
            descripcion: item.descripcion ?? "",
            enlace: item.enlace ?? "",
            categoria: item.categoriaNombre,
            cant: item.cantidad,
          })),
        };
      }),
    );

    hidratarListasDesdeBackend(mochilasCompletas);
  };

  const obtenerCategoriaIdPorNombre = async (mochilaId, nombreCat) => {
    const categoriasBackend = await getCategorias(mochilaId);
    const categoria = categoriasBackend.find((c) => c.nombre === nombreCat);

    if (!categoria) {
      throw new Error("No se encontró la categoría en el servidor");
    }

    return categoria.id;
  };

  const manejarNuevoItemReal = async (datos) => {
    if (!idListaActiva) return;

    try {
      const categoriaId = await obtenerCategoriaIdPorNombre(
        idListaActiva,
        datos.categoria,
      );

      let itemArmarioId = datos.itemArmarioId ?? null;

      if (!itemArmarioId && datos.id) {
        itemArmarioId = datos.id;
      }

      if (!itemArmarioId) {
        const itemCreado = await crearArmario({
          nombre: datos.nombre,
          peso: Number(datos.peso),
          descripcion: datos.descripcion ?? "",
          enlace: datos.enlace ?? "",
          usuarioId: usuarioActual.id,
        });

        itemArmarioId = itemCreado.id;
        await cargarArmario();
      }

      await createItemMochilaApi({
        mochilaId: idListaActiva,
        categoriaId,
        itemArmarioId,
      });

      await sincronizarMochilas(usuarioActual.id);
    } catch (error) {
      console.error("Error añadiendo item a mochila:", error);
      alert("No se pudo añadir el item a la mochila");
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

  const añadirCategoriaReal = async (nombreCat) => {
    if (!idListaActiva) return;

    try {
      await createCategoriaApi({ nombre: nombreCat, mochilaId: idListaActiva });
      await sincronizarMochilas(usuarioActual.id);
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
      await sincronizarMochilas(usuarioActual.id);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la categoría");
    }
  };

  const cambiarCantidadReal = async (idItemMochila, incremento) => {
    try {
      const itemActual = mochilaActiva.objetos.find(
        (o) => o.id === idItemMochila,
      );
      if (!itemActual) return;

      const nuevaCantidad = itemActual.cant + incremento;

      if (nuevaCantidad <= 0) {
        await deleteItemMochilaApi(idItemMochila);
      } else {
        await patchItemMochilaApi(idItemMochila, { cantidad: nuevaCantidad });
      }

      await sincronizarMochilas(usuarioActual.id);
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar la cantidad");
    }
  };

  const eliminarObjetoReal = async (idItemMochila) => {
    try {
      await deleteItemMochilaApi(idItemMochila);
      await sincronizarMochilas(usuarioActual.id);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el item de la mochila");
    }
  };

  const crearNuevaListaReal = async (nombre) => {
    try {
      const creada = await crearMochilaBackend({
        nombre,
        esPublica: false,
        usuarioId: usuarioActual.id,
      });

      agregarListaPersistida({ ...creada, categorias: [] });
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

  const manejarExportarPDF = () => {
    if (!mochilaActiva) return;

    const data = prepararMochilaPDF({
      mochila: mochilaActiva,
      usuarioNombre: usuarioActual?.nick,
    });

    exportarMochilaPDF(data);
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
          await cargarArmario(usuario.id);
          await sincronizarMochilas(usuario.id);
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
              usuario={usuarioActual}
              onLogout={() => {
                setUsuarioActual(null);
                setPantallaActual("login");
              }}
              onIrAExplorar={() => setPantallaActual("explorar")}
              onExportarPDF={manejarExportarPDF}
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
                onCambiarCantidad={cambiarCantidadReal}
                onEliminar={eliminarObjetoReal}
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
