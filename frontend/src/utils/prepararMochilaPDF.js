export function prepararMochilaPDF({ mochila, usuarioNombre }) {
  const objetos = mochila?.objetos ?? [];
  const categorias = mochila?.categorias ?? [];

  const fechaExportacion = new Date().toLocaleDateString("es-ES");

  const pesoTotal = objetos.reduce(
    (acc, item) => acc + Number(item.peso || 0) * Number(item.cant || 1),
    0,
  );

  const categoriasPreparadas = categorias.map((categoria) => {
    const items = objetos
      .filter((item) => item.categoria === categoria)
      .map((item) => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: Number(item.cant || 1),
        pesoUnitario: Number(item.peso || 0),
        pesoLinea: Number(item.peso || 0) * Number(item.cant || 1),
        descripcion: item.descripcion ?? "",
      }));

    const pesoCategoria = items.reduce((acc, item) => acc + item.pesoLinea, 0);

    return {
      nombre: categoria,
      pesoCategoria,
      items,
    };
  });

  const totalItemsDistintos = objetos.length;
  const totalUnidades = objetos.reduce(
    (acc, item) => acc + Number(item.cant || 1),
    0,
  );

  return {
    nombreMochila: mochila?.nombre ?? "Mochila sin nombre",
    usuarioNombre: usuarioNombre ?? "Usuario",
    fechaExportacion,
    pesoTotal,
    totalItemsDistintos,
    totalUnidades,
    categorias: categoriasPreparadas,
  };
}