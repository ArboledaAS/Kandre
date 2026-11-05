/**
 * ============================================================
 * KANDRE · DATOS DEL CATÁLOGO
 * ============================================================
 * ESTE ES EL ÚNICO ARCHIVO QUE DEBES EDITAR PARA CAMBIAR EL
 * CATÁLOGO (agregar prendas, colores, precios o descripciones).
 *
 * ¿CÓMO ESTÁN ORGANIZADAS LAS IMÁGENES?
 * ------------------------------------------------------------
 *   img/
 *     Colecciones/
 *       Chaqueta-Deportiva/
 *         Azul cielo.jpeg
 *         Beige Arena.jpeg
 *         Rosado.jpeg
 *       Leggins/
 *         Negro 1.jpeg
 *         Negro 2.jpeg
 *       ...
 *
 * Convención de nombre:  [color] [número].extension
 *   - El color va primero y el número después ("Negro 1.jpeg").
 *   - Si para un color solo hay una foto, se puede llamar
 *     simplemente "Rosado.jpeg" (sin número) o "Rosado 1.jpeg".
 *   - La extensión puede ser .jpg, .jpeg, .png o .webp.
 *
 * ⚠ IMPORTANTE (mayúsculas y extensiones):
 *   Los nombres se escriben EXACTAMENTE como están en el disco.
 *   Aquí conviven "Azul cielo.jpeg" y "Azul Cielo.jpeg" en
 *   carpetas distintas, y hay .jpeg y .jpg mezclados. En Windows
 *   da igual, pero en un hosting Linux (o GitHub Pages) SÍ
 *   distingue mayúsculas y la imagen no cargaría. Copia y pega
 *   el nombre real del archivo.
 *
 * ⚠ IMPORTANTE (espacios en las rutas):
 *   No tienes que preocuparte por los espacios: el motor del
 *   catálogo los codifica automáticamente (%20). Solo escribe
 *   el nombre tal cual, con su espacio entre color y número.
 *
 * ¿QUÉ SIGNIFICA CADA CAMPO DE UN PRODUCTO?
 * ------------------------------------------------------------
 *   id          Identificador único, sin espacios ni tildes.
 *               Se usa para relacionar la tarjeta con sus datos.
 *   nombre      Título que ve el cliente.
 *   categoria   Agrupa los filtros del catálogo. Si todos los
 *               productos nuevos comparten categoría, el botón
 *               de filtro aparece automáticamente.
 *   carpeta     Ruta de la carpeta DENTRO de img/, sin "img/"
 *               y sin "/" al final.
 *   precio      Número sin puntos, sin "$" y sin decimales.
 *               Ej.: 85000. Si aún no lo definiste, déjalo en
 *               null y la tarjeta mostrará "Precio por confirmar".
 *   etiqueta    Texto corto sobre la foto ("Nuevo", "Más
 *               vendido"...). Déjalo en null para no mostrarla.
 *   descripcion Texto de la prenda. Si está vacío, la tarjeta
 *               muestra el marcador visible
 *               "[AQUÍ PUEDES AGREGAR LA DESCRIPCIÓN DE LA PRENDA]".
 *   colores     Lista de colores disponibles. Cada color tiene:
 *                 nombre   -> texto visible ("Azul cielo").
 *                 hex      -> color de la muestra circular.
 *                 imagenes -> archivos de ESA carpeta, en orden.
 *                             La primera es la que se ve al abrir.
 * ============================================================
 */

const PRODUCTOS = [
    /* ============================================================
       PRODUCTO 1 · CHAQUETA DEPORTIVA
       Carpeta: img/Colecciones/Chaqueta-Deportiva/
       ============================================================ */
    {
        id: 'chaqueta-deportiva',
        nombre: 'Chaqueta Deportiva',
        categoria: 'Chaquetas',
        carpeta: 'Colecciones/Chaqueta-Deportiva',
        precio: null,        // TODO: reemplaza null por el precio real, ej. 160000
        etiqueta: null,      // Ej.: 'Nuevo' si quieres resaltarla
        // [AQUÍ PUEDES AGREGAR LA DESCRIPCIÓN DE LA PRENDA]
        descripcion: 'Buena enlogacion, Calidad gruesa,Variedad de colores',
        colores: [
            {
                nombre: 'Azul cielo',
                hex: '#A8C8E4',
                imagenes: ['Azul cielo.jpeg']
            },
            {
                nombre: 'Beige Arena',
                hex: '#D8C6A5',
                imagenes: ['Beige Arena.jpeg']
            },
            {
                nombre: 'Rosado',
                hex: '#EFA9B8',
                imagenes: ['Rosado.jpeg']
            }
        ]
    },

    /* ============================================================
       PRODUCTO 2 · LEGGINS
       Carpeta: img/Colecciones/Leggins/
       Dos fotos del mismo color -> galería con miniaturas.
       ============================================================ */
    {
        id: 'leggins',
        nombre: 'Leggins',
        categoria: 'Leggins',
        carpeta: 'Colecciones/Leggins',
        precio: null,        // TODO: reemplaza null por el precio real, ej. 85000
        etiqueta: null,
        // [AQUÍ PUEDES AGREGAR LA DESCRIPCIÓN DE LA PRENDA]
        descripcion: 'Americanos, Teala Rib Gruesa, Push Up, No marca celulitis, No transpatenta',
        colores: [
            {
                nombre: 'Negro',
                hex: '#1A1A1A',
                imagenes: ['Negro 1.jpeg', 'Negro 2.jpeg']
            }
        ]
    },

    /* ============================================================
       PRODUCTO 3 · LEGGING RIB
       Carpeta: img/Colecciones/Legging-Rib/
       ============================================================ */
    {
        id: 'legging-rib',
        nombre: 'Legging Rib',
        categoria: 'Leggins',
        carpeta: 'Colecciones/Legging-Rib',
        precio: null,        // TODO: reemplaza null por el precio real
        etiqueta: null,
        // [AQUÍ PUEDES AGREGAR LA DESCRIPCIÓN DE LA PRENDA]
        descripcion: 'No transparenta, Tela Americana, Excelente elongacion, super comodo',
        colores: [
            {
                nombre: 'Azul Cielo',
                hex: '#A8C8E4',
                imagenes: ['Azul Cielo.jpeg']
            },
            {
                nombre: 'Rosado',
                hex: '#EFA9B8',
                imagenes: ['Rosado.jpeg']
            }
        ]
    },

    /* ============================================================
       PRODUCTO 4 · SHORT FRANCIA
       Carpeta: img/Colecciones/Short-Francia/
       Ojo: aquí los archivos están en minúscula.
       ============================================================ */
    {
        id: 'short-francia',
        nombre: 'Short Francia',
        categoria: 'Shorts',
        carpeta: 'Colecciones/Short-Francia',
        precio: null,        // TODO: reemplaza null por el precio real
        etiqueta: null,
        // [AQUÍ PUEDES AGREGAR LA DESCRIPCIÓN DE LA PRENDA]
        descripcion: 'Push up, Colores divinos, Control abdomen, No transparenta',
        colores: [
            {
                nombre: 'Azul cielo',
                hex: '#A8C8E4',
                imagenes: ['azul cielo.jpeg']
            },
            {
                nombre: 'Azul oscuro',
                hex: '#24395C',
                imagenes: ['azul oscuro.jpeg']
            }
        ]
    },

    /* ============================================================
       PRODUCTO 5 · SHORT MANHATTAN
       Carpeta: img/Colecciones/Short-Manhattan/
       El gris oscuro tiene 2 fotos, y están en formatos distintos:
       "Gris oscuro 1.jpeg" y "Gris oscuro 2.jpg".
       ============================================================ */
    {
        id: 'short-manhattan',
        nombre: 'Short Manhattan',
        categoria: 'Shorts',
        carpeta: 'Colecciones/Short-Manhattan',
        precio: null,        // TODO: reemplaza null por el precio real
        etiqueta: null,
        // [AQUÍ PUEDES AGREGAR LA DESCRIPCIÓN DE LA PRENDA]
        descripcion: 'Push up, Control abdomen, No transparenta',
        colores: [
            {
                nombre: 'Azul oscuro',
                hex: '#24395C',
                imagenes: ['Azul oscuro.jpeg']
            },
            {
                nombre: 'Gris oscuro',
                hex: '#4A4A4A',
                imagenes: ['Gris oscuro 1.jpeg', 'Gris oscuro 2.jpg']
            },
            {
                nombre: 'Rosado',
                hex: '#EFA9B8',
                imagenes: ['Rosado.jpeg']
            }
        ]
    },

    /* ============================================================
       PRODUCTO 6 · SHORT VOLCANO
       Carpeta: img/Colecciones/Short-volcano/
       Ojo: la "v" de volcano va en minúscula en el nombre real.
       ============================================================ */
    {
        id: 'short-volcano',
        nombre: 'Short Volcano',
        categoria: 'Shorts',
        carpeta: 'Colecciones/Short-volcano',
        precio: null,        // TODO: reemplaza null por el precio real
        etiqueta: null,
        // [AQUÍ PUEDES AGREGAR LA DESCRIPCIÓN DE LA PRENDA]
        descripcion: 'No transparenta, No marca celulitis, Excelente elongacion, Control abdomen',
        colores: [
            {
                nombre: 'Azul claro',
                hex: '#C4DAE8',
                imagenes: ['azul claro.jpeg']
            }
        ]
    }
];
