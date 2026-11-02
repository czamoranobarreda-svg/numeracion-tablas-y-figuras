# Numeración de Tablas y Figuras para Google Docs

Script de Google Apps Script que renumera automáticamente los títulos de
tablas y figuras en un Google Doc ("TABLA 1.", "FIGURA 2.", etc.), sin tener
que corregir los números a mano cada vez que agregas, borras o mueves una
tabla o figura.

Pensado para informes técnicos, tesis, papers y documentos largos con
muchas tablas y figuras, donde insertar o eliminar una en medio del
documento obliga a renumerar todas las que vienen después.

## Qué hace

- Agrega un menú propio **📊 Numeración** a tu Google Doc.
- **Renumerar tablas y figuras**: recorre todo el documento (incluso
  dentro de celdas de tabla) y corrige el número de cada título según el
  orden real en que aparecen. Antes de aplicar nada, te muestra qué va a
  cambiar y pide confirmación.
- **Listado de tablas y figuras (para copiar)**: genera un índice con
  todos los títulos, listo para copiar y pegar donde quieras.
- Reconoce títulos pendientes de rellenar escritos como `TABLA XX.` o
  `FIGURA XX.`, y les asigna el número que corresponde según su posición.

## Qué NO hace (a propósito)

- No es automático en tiempo real — hay que ir al menú y hacer clic cada
  vez que agregas o borras una tabla/figura.
- No toca menciones dentro del texto corrido (por ejemplo "en la Tabla 3
  se observa..."). Solo corrige el número en el título mismo
  (`TABLA 3.`), escrito en **mayúscula sostenida**. Esto es intencional:
  usar mayúsculas como señal evita que el script confunda un título con
  una mención casual en medio de un párrafo.

## Instalación

1. Abre tu Google Doc.
2. Ve a **Extensiones → Apps Script**.
3. Borra el contenido de `Código.gs` (o `Code.gs`) y pega todo el
   contenido de [`Codigo.gs`](./Codigo.gs) de este repositorio.
4. Guarda (icono de disco) y vuelve a la pestaña del documento (recarga
   la página).
5. La primera vez te pedirá autorizar el script — el permiso queda
   limitado a ese documento, no a tu cuenta completa.
6. Verás el menú **📊 Numeración** junto a Ayuda.

> **Nota sobre la advertencia "Google no ha verificado esta aplicación":**
> al autorizar por primera vez es normal que aparezca esta pantalla — es
> lo esperable para cualquier script personal/gratuito de Apps Script, no
> solo este, y no significa que algo esté mal. Simplemente:
> **Configuración avanzada → Ir a [nombre del proyecto] (no seguro) →
> Permitir**. El script solo pide acceso al documento donde lo instalas,
> nada más. Te puede volver a pedir esto cada cierto tiempo, o si lo
> instalas en otra cuenta de Google — también es normal.

## Uso

- Escribe tus títulos de tabla/figura en el documento como
  `TABLA 1. Descripción...` o `FIGURA 1. Descripción...` (mayúscula
  sostenida en la palabra TABLA/FIGURA).
- Si aún no sabes qué número va, usa `TABLA XX. Descripción...` como
  marcador — el script le asignará el número correcto según su posición.
- Cada vez que agregues, borres o reordenes una tabla o figura, ve a
  **📊 Numeración → Renumerar tablas y figuras**.
- Para generar tu índice de tablas/figuras, usa **📊 Numeración →
  Listado de tablas y figuras (para copiar)**.

## Licencia

Este proyecto usa la **[PolyForm Noncommercial License
1.0.0](./LICENSE)**: es gratis para cualquier uso no comercial (personal,
académico, dentro de una institución, etc.).

¿Quieres usarlo como base de un producto o servicio de pago, o integrarlo
en algo comercial? Contáctame antes:
**[LinkedIn — Camilo Zamorano Barreda](https://www.linkedin.com/in/camilo-zamorano-barreda-2a2b37120)**
