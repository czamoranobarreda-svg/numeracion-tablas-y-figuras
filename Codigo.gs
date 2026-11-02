/**
 * Renumera automáticamente los TÍTULOS de TABLA y FIGURA del
 * documento ("TABLA N." / "FIGURA N."), manteniendo la descripción
 * de cada una intacta.
 *
 * - Solo reconoce "TABLA" / "FIGURA" escritos en MAYÚSCULA sostenida.
 *   Las menciones dentro de párrafos ("en la Tabla 3...") se escriben
 *   normalmente con mayúscula inicial solamente, así que el script
 *   nunca las toca; esas las corriges tú a mano.
 * - Busca los títulos tanto en párrafos sueltos como dentro de
 *   celdas de tabla (por si el título va como fila de encabezado).
 * - Reconoce títulos pendientes de rellenar, escritos como
 *   "TABLA XX." o "FIGURA XX." (en mayúscula), y les asigna el
 *   número que corresponde según su posición real.
 * - NO toca menciones en el resto del texto; solo el número dentro
 *   del título.
 * - Antes de modificar nada, muestra qué cambios va a hacer y
 *   pide confirmación.
 *
 * Instalación:
 *  1. Abre el documento > Extensiones > Apps Script.
 *  2. Borra el contenido de Code.gs y pega todo este archivo.
 *  3. Guarda (icono de disco) y vuelve al documento (recarga la pestaña).
 *  4. La primera vez te pedirá autorizar el script (es tuyo, solo
 *     actúa sobre este documento).
 *  5. Aparecerá el menú "📊 Numeración" junto a Ayuda.
 *
 * Uso:
 *  - Cada vez que agregues, borres o muevas una tabla o figura,
 *    ve a 📊 Numeración > Renumerar tablas y figuras.
 *  - Para generar un índice que puedas copiar y pegar, usa
 *    📊 Numeración > Listado de tablas y figuras (para copiar).
 */

function onOpen() {
  DocumentApp.getUi()
    .createMenu('📊 Numeración')
    .addItem('Renumerar tablas y figuras', 'renumerarTablasYFiguras')
    .addSeparator()
    .addItem('Listado de tablas y figuras (para copiar)', 'listarTablasYFiguras')
    .addToUi();
}

// Solo "TABLA"/"FIGURA" en mayúscula sostenida cuentan como título.
// Acepta número (1, 2, 23...) o el marcador pendiente "XX" (mayúscula).
var CAPTION_REGEX = /^\s*(TABLA|FIGURA)\s+(\d+|XX)\s*\./;
var PREFIX_REGEX = /^\s*(?:TABLA|FIGURA)\s+/;

function recolectarTitulos(container, out) {
  var n = container.getNumChildren();
  for (var i = 0; i < n; i++) {
    var child = container.getChild(i);
    var type = child.getType();

    if (type === DocumentApp.ElementType.PARAGRAPH ||
        type === DocumentApp.ElementType.LIST_ITEM) {
      out.push(child);
    } else if (type === DocumentApp.ElementType.TABLE) {
      var table = child.asTable();
      var numRows = table.getNumRows();
      for (var r = 0; r < numRows; r++) {
        var row = table.getRow(r);
        var numCells = row.getNumCells();
        for (var c = 0; c < numCells; c++) {
          recolectarTitulos(row.getCell(c), out);
        }
      }
    }
  }
}

function renumerarTablasYFiguras() {
  var ui = DocumentApp.getUi();
  var body = DocumentApp.getActiveDocument().getBody();

  var elementos = [];
  recolectarTitulos(body, elementos);

  var counters = { TABLA: 0, FIGURA: 0 };
  var cambiosPlan = [];
  var resumenTexto = { TABLA: [], FIGURA: [] };

  for (var i = 0; i < elementos.length; i++) {
    var el = elementos[i];
    var text = el.getText();
    var m = CAPTION_REGEX.exec(text);
    if (!m) continue;

    var tipo = m[1];
    var oldToken = m[2];
    counters[tipo]++;
    var newNum = counters[tipo];

    if (String(newNum) === oldToken) continue;

    var prefixMatch = PREFIX_REGEX.exec(text);
    if (!prefixMatch) continue;
    var tokenStart = prefixMatch[0].length;
    var tokenEnd = tokenStart + oldToken.length - 1;

    cambiosPlan.push({
      element: el,
      tokenStart: tokenStart,
      tokenEnd: tokenEnd,
      newNum: newNum
    });
    resumenTexto[tipo].push(oldToken + ' → ' + newNum);
  }

  if (cambiosPlan.length === 0) {
    ui.alert('Numeración al día',
      'Tablas encontradas: ' + counters.TABLA + '\n' +
      'Figuras encontradas: ' + counters.FIGURA +
      '\n\nNo hay ningún número que corregir.',
      ui.ButtonSet.OK);
    return;
  }

  var detalle = '';
  if (resumenTexto.TABLA.length) {
    detalle += 'Tablas: ' + resumenTexto.TABLA.join(', ') + '\n';
  }
  if (resumenTexto.FIGURA.length) {
    detalle += 'Figuras: ' + resumenTexto.FIGURA.join(', ') + '\n';
  }

  var respuesta = ui.alert(
    'Confirmar renumeración',
    'Se van a corregir ' + cambiosPlan.length + ' título(s):\n\n' + detalle +
      '\nSolo se cambia el número del título; el resto del texto no se toca.' +
      '\n\n¿Aplicar estos cambios?',
    ui.ButtonSet.YES_NO
  );

  if (respuesta !== ui.Button.YES) {
    return;
  }

  for (var j = 0; j < cambiosPlan.length; j++) {
    var cambio = cambiosPlan[j];
    var textObj = cambio.element.editAsText();
    textObj.deleteText(cambio.tokenStart, cambio.tokenEnd);
    textObj.insertText(cambio.tokenStart, String(cambio.newNum));
  }

  ui.alert('Listo', cambiosPlan.length + ' título(s) renumerado(s) correctamente.', ui.ButtonSet.OK);
}

function listarTablasYFiguras() {
  var body = DocumentApp.getActiveDocument().getBody();
  var elementos = [];
  recolectarTitulos(body, elementos);

  var regex = /^\s*(TABLA|FIGURA)\s+(\d+|XX)\s*\.\s*(.*)$/;
  var tablas = [];
  var figuras = [];

  for (var i = 0; i < elementos.length; i++) {
    var text = elementos[i].getText();
    var m = regex.exec(text);
    if (!m) continue;

    var tipo = m[1];
    var num = m[2];
    var titulo = m[3].trim();
    var linea = (tipo === 'TABLA' ? 'Tabla ' : 'Figura ') + num + '. ' + titulo;

    if (tipo === 'TABLA') tablas.push(linea);
    else figuras.push(linea);
  }

  var texto = '';
  if (tablas.length) {
    texto += 'ÍNDICE DE TABLAS\n\n' + tablas.join('\n') + '\n\n';
  }
  if (figuras.length) {
    texto += 'ÍNDICE DE FIGURAS\n\n' + figuras.join('\n') + '\n';
  }
  if (!texto) {
    texto = 'No se encontraron tablas ni figuras con el formato "TABLA n." / "FIGURA n."';
  }

  var htmlContent = `
<textarea id="lista" style="width:95%;height:320px;font-family:monospace;font-size:12px;" readonly><?= texto ?></textarea>
<br><br>
<button onclick="copiar()">Copiar todo</button>
<span id="ok" style="margin-left:10px;color:green;"></span>
<script>
var ta = document.getElementById("lista");
ta.focus(); ta.select();
function copiar() {
  ta.focus(); ta.select();
  try {
    document.execCommand("copy");
    document.getElementById("ok").innerText = "¡Copiado!";
  } catch (e) {
    document.getElementById("ok").innerText = "Selecciona el texto y usa Ctrl+C";
  }
}
</script>
`;

  var tpl = HtmlService.createTemplate(htmlContent);
  tpl.texto = texto;

  var html = tpl.evaluate().setWidth(520).setHeight(460);
  DocumentApp.getUi().showModalDialog(html, 'Listado de tablas y figuras');
}
