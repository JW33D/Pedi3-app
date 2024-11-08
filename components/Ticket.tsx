import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const imprimirTicket = async (jsonTicket) => {
  try {
    // Genera el contenido HTML del ticket
    const ticketHTML = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            h1 { font-size: 24px; margin-bottom: 10px; }
            table { width: 100%; margin-top: 10px; }
            td { padding: 5px; text-align: left; }
            .total, .efectivo, .cambio { font-weight: bold; }
            .thank-you { margin-top: 20px; font-size: 18px; }
          </style>
        </head>
        <body>
          <h1>Ticket de Pago</h1>
          <table>
            ${jsonTicket.productos.map(producto => `
              <tr>
                <td>${producto.nombre}</td>
                <td>x${producto.cantidad}</td>
                <td>$${producto.precio}</td>
              </tr>
            `).join('')}
          </table>
          <p class="total">Total: $${jsonTicket.total}</p>
          <p class="efectivo">Efectivo: $${jsonTicket.efectivo}</p>
          <p class="cambio">Cambio: $${jsonTicket.cambio}</p>
          <p class="thank-you">¡Gracias por su compra!</p>
        </body>
      </html>
    `;

    // Genera el PDF con expo-print
    const { uri } = await Print.printToFileAsync({
      html: ticketHTML,
      base64: false,
    });

    // Compartir el archivo PDF generado
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error("Error al imprimir o compartir el ticket:", error);
  }
};
