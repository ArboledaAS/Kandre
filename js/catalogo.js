/**
 * ============================================================
 * KANDRE · MOTOR DEL CATÁLOGO
 * ============================================================
 * Este archivo se encarga de TODO el funcionamiento del catálogo:
 *
 *   1. Leer las prendas desde js/productos.js (variable PRODUCTOS).
 *   2. Crear los botones de filtro por categoría.
 *   3. Generar el HTML de cada tarjeta (imagen, miniaturas,
 *      colores, precio y botón de compra).
 *   4. Gestionar la galería: al elegir un color se cambia la foto
 *      principal y se reconstruyen las miniaturas.
 *   5. Mostrar un aviso al pulsar "Añadir al carrito" y lanzar un
 *      evento para conectar después un carrito real.
 *
 * AQUÍ NO SE EDITAN PRENDAS: eso se hace en js/productos.js.
 * ============================================================
 */

(function () {
    'use strict';

    /* ==========================================================
       1. CONFIGURACIÓN
       ----------------------------------------------------------
       Valores que podrías necesitar cambiar sin tocar la lógica.
       Los ID deben coincidir con los del index.html.
       ========================================================== */
    const CONFIG = {
        idGrilla: 'product-grid',        // contenedor de las tarjetas
        idFiltros: 'catalog-filters',    // contenedor de los filtros
        imagenRespaldo: 'img/placeholder.svg',
        textoDescripcionPendiente: '[LA DESCRIPCIÓN DE LA PRENDA]'
    };

    /* ==========================================================
       2. ESTADO DEL CATÁLOGO
       ----------------------------------------------------------
       Variables que cambian mientras el usuario navega.
       ========================================================== */
    let productos = [];              // copia de PRODUCTOS
    let categoriaActiva = 'Todas';   // filtro seleccionado
    let grilla = null;               // referencia al contenedor

    /* ==========================================================
       3. ARRANQUE
       ----------------------------------------------------------
       Esperamos a que el HTML esté listo (DOMContentLoaded) para
       que existan los contenedores donde vamos a pintar.
       ========================================================== */
    document.addEventListener('DOMContentLoaded', iniciar);

    function iniciar() {
        grilla = document.getElementById(CONFIG.idGrilla);

        // Si la página no tiene catálogo (por ejemplo contacto.html),
        // terminamos aquí sin errores.
        if (!grilla) return;

        // Validación básica: ¿existe productos.js y tiene prendas?
        if (typeof PRODUCTOS === 'undefined' || !Array.isArray(PRODUCTOS) || PRODUCTOS.length === 0) {
            grilla.innerHTML =
                '<p class="catalog-empty">Todavía no hay prendas publicadas. ' +
                'Agrega productos en <strong>js/productos.js</strong>.</p>';
            console.error('[KANDRE] No se encontró el arreglo PRODUCTOS. Revisa js/productos.js.');
            return;
        }

        // main.js debe cargarse antes porque aquí usamos KANDRE.*
        if (typeof KANDRE === 'undefined') {
            console.error('[KANDRE] Falta cargar js/main.js antes de js/catalogo.js.');
            return;
        }

        productos = PRODUCTOS;

        validarProductos();
        construirFiltros();
        pintarProductos();
        conectarEventos();
    }

    /**
     * Avisa por consola si algún producto quedó incompleto.
     * No detiene la página: solo ayuda a detectar errores de tipeo.
     */
    function validarProductos() {
        productos.forEach(function (producto) {
            if (!producto.id || !producto.nombre || !producto.carpeta) {
                console.warn('[KANDRE] Producto incompleto (falta id, nombre o carpeta):', producto);
            }

            if (!Array.isArray(producto.colores) || producto.colores.length === 0) {
                console.warn('[KANDRE] El producto "' + producto.nombre + '" no tiene colores definidos.');
                return;
            }

            producto.colores.forEach(function (color) {
                if (!Array.isArray(color.imagenes) || color.imagenes.length === 0) {
                    console.warn(
                        '[KANDRE] El color "' + color.nombre + '" de "' +
                        producto.nombre + '" no tiene imágenes.'
                    );
                }
            });
        });
    }

    /* ==========================================================
       4. RUTAS DE IMAGEN
       ----------------------------------------------------------
       Une la carpeta del producto con el archivo de la foto.
       encodeURI convierte los espacios en %20 y las tildes en
       caracteres seguros, así "Negro 1.jpeg" funciona en
       cualquier navegador.
       ========================================================== */
    function rutaImagen(carpeta, archivo) {
        return encodeURI('img/' + carpeta + '/' + archivo);
    }

    /* ==========================================================
       5. FILTROS POR CATEGORÍA
       ----------------------------------------------------------
       Los botones se crean solos a partir de las categorías que
       existan en productos.js. Si mañana agregas una categoría
       nueva ("Tops"), su botón aparece automáticamente.
       ========================================================== */
    function construirFiltros() {
        const contenedor = document.getElementById(CONFIG.idFiltros);
        if (!contenedor) return;

        // Set elimina categorías repetidas.
        const categorias = ['Todas'].concat(
            productos.map(function (producto) {
                return producto.categoria;
            }).filter(function (categoria, indice, lista) {
                return lista.indexOf(categoria) === indice;
            })
        );

        contenedor.innerHTML = categorias.map(function (categoria) {
            const activa = categoria === categoriaActiva;

            return (
                '<button type="button" class="filter-btn' + (activa ? ' active' : '') + '"' +
                ' data-categoria="' + KANDRE.escaparHTML(categoria) + '"' +
                ' aria-pressed="' + activa + '">' +
                KANDRE.escaparHTML(categoria) +
                '</button>'
            );
        }).join('');

        // Un solo listener para todos los botones (delegación de eventos).
        contenedor.addEventListener('click', function (evento) {
            const boton = evento.target.closest('.filter-btn');
            if (!boton) return;

            categoriaActiva = boton.dataset.categoria;

            // Marcamos visualmente el botón elegido.
            contenedor.querySelectorAll('.filter-btn').forEach(function (otro) {
                const esActivo = otro === boton;
                otro.classList.toggle('active', esActivo);
                otro.setAttribute('aria-pressed', String(esActivo));
            });

            aplicarFiltro();
        });
    }

    /**
     * Muestra u oculta cada tarjeta según la categoría activa.
     * El atributo [hidden] se oculta con CSS (.product-card[hidden]).
     */
    function aplicarFiltro() {
        grilla.querySelectorAll('.product-card').forEach(function (tarjeta) {
            const coincide = categoriaActiva === 'Todas' ||
                tarjeta.dataset.categoria === categoriaActiva;

            tarjeta.hidden = !coincide;
        });
    }

    /* ==========================================================
       6. PINTAR LAS TARJETAS
       ========================================================== */
    function pintarProductos() {
        grilla.innerHTML = productos.map(construirTarjeta).join('');
    }

    /**
     * Devuelve el HTML completo de una tarjeta.
     * Todos los datos vienen de js/productos.js.
     */
    function construirTarjeta(producto) {
        const colorInicial = producto.colores[0];

        // Si un producto no tiene colores, no se pinta (ya avisamos
        // por consola en validarProductos).
        if (!colorInicial || colorInicial.imagenes.length === 0) return '';

        const descripcion = (producto.descripcion || '').trim();
        const tieneDescripcion = descripcion.length > 0;
        const textoDescripcion = tieneDescripcion
            ? KANDRE.escaparHTML(descripcion)
            : KANDRE.escaparHTML(CONFIG.textoDescripcionPendiente);

        const etiqueta = producto.etiqueta
            ? '<span class="product-badge">' + KANDRE.escaparHTML(producto.etiqueta) + '</span>'
            : '';

        // Botones de color: uno por cada color del producto.
        const botonesColor = producto.colores.map(function (color, indice) {
            const activo = indice === 0;

            return (
                '<button type="button" class="color-btn' + (activo ? ' active' : '') + '"' +
                ' style="background-color: ' + KANDRE.escaparHTML(color.hex) + ';"' +
                ' data-color-index="' + indice + '"' +
                ' aria-label="Color ' + KANDRE.escaparHTML(color.nombre) + '"' +
                ' aria-pressed="' + activo + '"></button>'
            );
        }).join('');

        return (
            '<!-- ============================================= -->' +
            '<!-- TARJETA: ' + KANDRE.escaparHTML(producto.nombre) + ' -->' +
            '<!-- Datos editables en js/productos.js -->' +
            '<!-- ============================================= -->' +
            '<article class="product-card"' +
            ' data-id="' + KANDRE.escaparHTML(producto.id) + '"' +
            ' data-categoria="' + KANDRE.escaparHTML(producto.categoria) + '"' +
            ' data-color-index="0" data-image-index="0">' +

                // --- Imagen principal + etiqueta opcional ---
                '<div class="image-container">' +
                    etiqueta +
                    '<img class="product-image"' +
                    ' src="' + rutaImagen(producto.carpeta, colorInicial.imagenes[0]) + '"' +
                    ' alt="' + KANDRE.escaparHTML(producto.nombre + ' en color ' + colorInicial.nombre) + '"' +
                    ' width="400" height="500" loading="lazy" decoding="async">' +
                '</div>' +

                // --- Miniaturas del color activo ---
                // (se reconstruyen cada vez que se cambia de color)
                '<div class="thumb-row">' +
                    construirMiniaturas(producto, colorInicial, 0) +
                '</div>' +

                // --- Nombre ---
                '<h3 class="product-title">' +
                    KANDRE.escaparHTML(producto.nombre) +
                '</h3>' +

                // --- Descripción ---
                // Si el campo "descripcion" está vacío en productos.js,
                // se muestra el marcador para que sepas dónde escribir.
                '<p class="product-desc' + (tieneDescripcion ? '' : ' is-empty') + '">' +
                    textoDescripcion +
                '</p>' +

                // --- Precio ---
                '<p class="product-price">' +
                    KANDRE.formatearPrecio(producto.precio) +
                '</p>' +

                // --- Selector de colores ---
                '<div class="color-selector" role="group"' +
                ' aria-label="Colores disponibles de ' + KANDRE.escaparHTML(producto.nombre) + '">' +
                    botonesColor +
                '</div>' +

                // --- Texto "Color: Negro" que se actualiza con JS ---
                '<p class="color-display">Color: <span>' +
                    KANDRE.escaparHTML(colorInicial.nombre) +
                '</span></p>' +

                // --- Botón de compra ---
                '<button type="button" class="btn-add">Añadir al carrito</button>' +

            '</article>'
        );
    }

    /**
     * Genera las miniaturas de un color concreto.
     * Cada miniatura guarda su posición en data-image-index.
     *
     * Si el color solo tiene una foto no se generan miniaturas:
     * el contenedor queda vacío y el CSS lo oculta
     * (.thumb-row:empty). Así no aparece una miniatura repetida
     * de la misma imagen principal.
     */
    function construirMiniaturas(producto, color, indiceActivo) {
        if (color.imagenes.length < 2) return '';

        return color.imagenes.map(function (archivo, indice) {
            const activa = indice === indiceActivo;

            return (
                '<button type="button" class="thumb-btn' + (activa ? ' active' : '') + '"' +
                ' data-image-index="' + indice + '"' +
                ' aria-label="Ver imagen ' + (indice + 1) + ' de ' +
                KANDRE.escaparHTML(producto.nombre) + ' en ' + KANDRE.escaparHTML(color.nombre) + '"' +
                ' aria-pressed="' + activa + '">' +
                    '<img src="' + rutaImagen(producto.carpeta, archivo) + '"' +
                    ' alt="" width="56" height="56" loading="lazy" decoding="async">' +
                '</button>'
            );
        }).join('');
    }

    /* ==========================================================
       7. EVENTOS DE LA GRILLA
       ----------------------------------------------------------
       Se usa delegación: un listener en el contenedor escucha los
       clics de TODAS las tarjetas, incluso de las que se creen
       después. Así no hay que añadir listeners uno por uno.
       ========================================================== */
    function conectarEventos() {
        grilla.addEventListener('click', manejarClicGrilla);

        // Los eventos "error" de las imágenes NO burbujean, por eso
        // se escuchan en fase de captura (tercer parámetro true).
        // Si una foto no existe, mostramos img/placeholder.svg.
        grilla.addEventListener('error', function (evento) {
            if (evento.target.tagName === 'IMG') {
                aplicarImagenRespaldo(evento.target);
            }
        }, true);
    }

    function manejarClicGrilla(evento) {
        const tarjeta = evento.target.closest('.product-card');
        if (!tarjeta) return;

        // ¿Pulsó un color?
        const botonColor = evento.target.closest('.color-btn');
        if (botonColor) {
            cambiarColor(tarjeta, Number(botonColor.dataset.colorIndex));
            return;
        }

        // ¿Pulsó una miniatura?
        const miniatura = evento.target.closest('.thumb-btn');
        if (miniatura) {
            mostrarImagen(tarjeta, Number(miniatura.dataset.imageIndex));
            return;
        }

        // ¿Pulsó "Añadir al carrito"?
        const botonAgregar = evento.target.closest('.btn-add');
        if (botonAgregar) {
            agregarAlCarrito(tarjeta);
        }
    }

    /* ==========================================================
       8. GALERÍA: CAMBIO DE COLOR E IMAGEN
       ========================================================== */
    function obtenerProducto(tarjeta) {
        return productos.find(function (producto) {
            return producto.id === tarjeta.dataset.id;
        });
    }

    /**
     * Cambia el color activo de una tarjeta:
     *  - marca el botón correcto,
     *  - actualiza el texto "Color: X",
     *  - reconstruye las miniaturas de ese color,
     *  - muestra la primera foto del color.
     */
    function cambiarColor(tarjeta, indice) {
        const producto = obtenerProducto(tarjeta);
        if (!producto || !producto.colores[indice]) return;

        tarjeta.dataset.colorIndex = String(indice);

        tarjeta.querySelectorAll('.color-btn').forEach(function (boton, posicion) {
            const activo = posicion === indice;
            boton.classList.toggle('active', activo);
            boton.setAttribute('aria-pressed', String(activo));
        });

        const etiquetaColor = tarjeta.querySelector('.color-display span');
        if (etiquetaColor) {
            etiquetaColor.textContent = producto.colores[indice].nombre;
        }

        // Reconstruimos las miniaturas antes de mostrar la imagen 0.
        const filaMiniaturas = tarjeta.querySelector('.thumb-row');
        if (filaMiniaturas) {
            filaMiniaturas.innerHTML = construirMiniaturas(producto, producto.colores[indice], 0);
        }

        mostrarImagen(tarjeta, 0);
    }

    /**
     * Coloca una imagen concreta del color activo como imagen
     * principal y marca su miniatura.
     */
    function mostrarImagen(tarjeta, indiceImagen) {
        const producto = obtenerProducto(tarjeta);
        if (!producto) return;

        const indiceColor = Number(tarjeta.dataset.colorIndex || 0);
        const color = producto.colores[indiceColor];
        if (!color || !color.imagenes[indiceImagen]) return;

        const imagen = tarjeta.querySelector('.product-image');
        if (imagen) {
            imagen.src = rutaImagen(producto.carpeta, color.imagenes[indiceImagen]);
            imagen.alt = producto.nombre + ' en color ' + color.nombre;
        }

        tarjeta.dataset.imageIndex = String(indiceImagen);

        tarjeta.querySelectorAll('.thumb-btn').forEach(function (boton, posicion) {
            const activa = posicion === indiceImagen;
            boton.classList.toggle('active', activa);
            boton.setAttribute('aria-pressed', String(activa));
        });
    }

    /* ==========================================================
       9. AÑADIR AL CARRITO
       ----------------------------------------------------------
       Todavía no existe un carrito real, así que mostramos un
       aviso. Además lanzamos un evento personalizado con los datos
       de la prenda elegida; cuando tengas carrito, escucha ese
       evento en lugar de modificar este archivo.
       ========================================================== */
    function agregarAlCarrito(tarjeta) {
        const producto = obtenerProducto(tarjeta);
        if (!producto) return;

        const color = producto.colores[Number(tarjeta.dataset.colorIndex || 0)];
        if (!color) return;

        KANDRE.mostrarAviso(producto.nombre + ' · ' + color.nombre + ' añadido al carrito');

        // Evento que puedes escuchar desde otro script:
        //
        //   document.addEventListener('kandre:agregar-al-carrito', function (e) {
        //       console.log(e.detail); // { id, nombre, precio, color, imagen }
        //   });
        document.dispatchEvent(new CustomEvent('kandre:agregar-al-carrito', {
            detail: {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                color: color.nombre,
                imagen: rutaImagen(producto.carpeta, color.imagenes[0])
            }
        }));
    }

    /* ==========================================================
       10. IMAGEN DE RESPALDO
       ----------------------------------------------------------
       Si una foto no existe (nombre mal escrito, archivo borrado),
       se muestra img/placeholder.svg en lugar de un icono roto.
       ========================================================== */
    function aplicarImagenRespaldo(imagen) {
        // Evitamos un bucle infinito si el propio respaldo falla.
        if (imagen.dataset.respaldo === '1') return;

        imagen.dataset.respaldo = '1';
        imagen.src = CONFIG.imagenRespaldo;
        imagen.alt = 'Imagen no disponible';
    }
})();
