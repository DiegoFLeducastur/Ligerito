import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import MochilaPDFView from "../components/MochilaPDFView";

export function exportarMochilaPDF(data) {
  const ventana = window.open("", "_blank", "width=900,height=1200");

  if (!ventana) {
    alert("No se pudo abrir la ventana de impresión.");
    return;
  }

  // Escuchar load ANTES de escribir el HTML para no perder el evento
  ventana.addEventListener("load", () => {
    ventana.focus();
    ventana.print();
  });

  ventana.document.write(`
    <html>
      <head>
        <title>${data.nombreMochila}</title>
        <meta charset="utf-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { margin: 0; background: white; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div id="pdf-root"></div>
      </body>
    </html>
  `);

  ventana.document.close();

  const mountNode = ventana.document.getElementById("pdf-root");
  const root = createRoot(mountNode);
  // flushSync fuerza el render síncrono para que el contenido
  // esté en el DOM antes de que llegue el evento load
  flushSync(() => {
    root.render(<MochilaPDFView data={data} />);
  });
}
