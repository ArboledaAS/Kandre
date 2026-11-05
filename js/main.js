/**
 * ============================================================
 * KANDRE · UTILIDADES GENERALES DEL SITIO
 * ============================================================
 * Este archivo NO contiene productos ni tarjetas. Solo funciones
 * pequeñas y reutilizables que otros scripts (como el catálogo)
 * necesitan.
 *
 * ORDEN DE CARGA EN EL HTML (importante):
 *   1. js/main.js       <- este archivo (utilidades)
 *   2. js/productos.js  <- datos de las prendas
 *   3. js/catalogo.js   <- construye el catálogo
 *
 * Todo se guarda dentro del objeto global KANDRE para no llenar
 * el navegador de variables sueltas que puedan chocar entre sí.
 * ============================================================
 */

const KANDRE = (function () {
    'use strict';

    /* ==========================================================
       1. FORMATO DE PRECIOS
       ----------------------------------------------------------
       Convierte un número (120000) en el texto que se muestra en
       la tarjeta ("$120.000"). Usa el formato colombiano, donde
       el punto separa los miles.

       Si el precio todavía no está definido (null o vacío), en
       lugar de mostrar "$0" muestra un texto claro para que sepas
       que falta completarlo en js/productos.js.
       ========================================================== */
    const TEXTO_PRECIO_PENDIENTE = 'Precio por confirmar';

    function formatearPrecio(valor) {
        // Ojo: Number(null) devuelve 0, por eso revisamos null antes.
        if (valor === null || valor === undefined || valor === '') {
            return TEXTO_PRECIO_PENDIENTE;
        }

        const numero = Number(valor);

        // Si el dato no es un número válido, mostramos el aviso.
        if (Number.isNaN(numero)) {
            return TEXTO_PRECIO_PENDIENTE;
        }

        return '$' + numero.toLocaleString('es-CO');
    }

    /* ==========================================================
       2. ESCAPAR TEXTO PARA HTML
       ----------------------------------------------------------
       Si un nombre o una descripción contiene caracteres como
       <, >, & o comillas, podrían romper el HTML o inyectar código.
       Esta función los convierte en entidades seguras antes de
       insertarlos en la página.
       ========================================================== */
    function escaparHTML(texto) {
        const caracteres = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return String(texto === null || texto === undefined ? '' : texto)
            .replace(/[&<>"']/g, function (caracter) {
                return caracteres[caracter];
            });
    }

    /* ==========================================================
       3. AVISO FLOTANTE (TOAST)
       ----------------------------------------------------------
       Muestra un mensaje breve en la parte inferior de la pantalla,
       por ejemplo al añadir una prenda al carrito. El elemento se
       crea una sola vez y luego solo cambia su texto.
       ========================================================== */
    let temporizadorAviso = null;

    function mostrarAviso(mensaje) {
        let aviso = document.getElementById('kandre-toast');

        // Si es la primera vez, creamos el contenedor del aviso.
        if (!aviso) {
            aviso = document.createElement('div');
            aviso.id = 'kandre-toast';
            aviso.className = 'toast';
            // role="status" hace que los lectores de pantalla anuncien el texto.
            aviso.setAttribute('role', 'status');
            aviso.setAttribute('aria-live', 'polite');
            document.body.appendChild(aviso);
        }

        aviso.textContent = mensaje;

        // Forzamos un "repintado" para que la animación se reinicie
        // aunque se pulse varias veces seguidas.
        void aviso.offsetWidth;
        aviso.classList.add('show');

        // Reiniciamos el temporizador para que el aviso dure 3 segundos
        // desde el último clic.
        clearTimeout(temporizadorAviso);
        temporizadorAviso = setTimeout(function () {
            aviso.classList.remove('show');
        }, 3000);
    }

    /* ==========================================================
       4. API PÚBLICA
       ----------------------------------------------------------
       Solo lo que está dentro de este return puede usarse desde
       otros archivos (por ejemplo: KANDRE.formatearPrecio(...)).
       ========================================================== */
    return {
        formatearPrecio: formatearPrecio,
        escaparHTML: escaparHTML,
        mostrarAviso: mostrarAviso,
        TEXTO_PRECIO_PENDIENTE: TEXTO_PRECIO_PENDIENTE
    };
})();
