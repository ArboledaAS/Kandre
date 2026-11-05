/**
 * FORMULARIO DE CONTACTO DE KANDRE
 * ---------------------------------
 * 1. Valida los campos en el navegador con mensajes propios.
 * 2. Si el <form> tiene data-endpoint, envía los datos por fetch (Formspree,
 *    Netlify Forms, etc.) y muestra la confirmación sin recargar la página.
 * 3. Si no hay endpoint, abre la aplicación de correo del usuario con el
 *    mensaje ya redactado (funciona en cualquier hosting estático).
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const statusBox = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const fields = Array.from(form.querySelectorAll('input, select, textarea'));

    // Cambia esto si usas otro correo de atención
    const SITE_EMAIL = 'hola@kandre.com';
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const PHONE_RE = /^[0-9+\s().-]{7,20}$/;

    /* ==========================================
       MENSAJES DE VALIDACIÓN
       ========================================== */
    function validateField(field) {
        const value = (field.value || '').trim();

        switch (field.name) {
            case 'nombre':
                if (value.length < 3) return 'Escribe tu nombre completo.';
                break;

            case 'email':
                if (!value) return 'Tu correo es obligatorio.';
                if (!EMAIL_RE.test(value)) return 'Ingresa un correo válido (ej. nombre@correo.com).';
                break;

            case 'telefono':
                if (value && !PHONE_RE.test(value)) return 'Ingresa un teléfono válido.';
                break;

            case 'asunto':
                if (!value) return 'Selecciona un asunto.';
                break;

            case 'mensaje':
                if (value.length < 10) return 'Cuéntanos un poco más (mínimo 10 caracteres).';
                break;

            case 'acepto':
                if (!field.checked) return 'Debes autorizar el tratamiento de tus datos.';
                break;
        }

        return '';
    }

    /* ==========================================
       ESTADOS VISUALES DE LOS CAMPOS
       ========================================== */
    function setError(field, message) {
        const group = field.closest('.form-group');
        if (!group) return;

        group.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');

        const error = group.querySelector('.field-error');
        if (error) error.textContent = message;
    }

    function clearError(field) {
        const group = field.closest('.form-group');
        if (!group) return;

        group.classList.remove('invalid');
        field.removeAttribute('aria-invalid');

        const error = group.querySelector('.field-error');
        if (error) error.textContent = '';
    }

    function showStatus(message, isError = false) {
        if (!statusBox) return;

        statusBox.textContent = message;
        statusBox.className = 'form-status show' + (isError ? ' error' : '');
    }

    function hideStatus() {
        if (!statusBox) return;
        statusBox.className = 'form-status';
        statusBox.textContent = '';
    }

    /* ==========================================
       VALIDACIÓN EN TIEMPO REAL
       ========================================== */
    fields.forEach(field => {
        const eventName = field.tagName === 'SELECT' || field.type === 'checkbox' ? 'change' : 'input';

        field.addEventListener(eventName, () => {
            const group = field.closest('.form-group');
            if (!group || !group.classList.contains('invalid')) return;

            const message = validateField(field);
            if (message) {
                setError(field, message);
            } else {
                clearError(field);
            }
        });

        // Al salir del campo, validamos solo si ya tenía contenido o es obligatorio
        field.addEventListener('blur', () => {
            if (field.type === 'checkbox') return;
            if ((field.value || '').trim() === '' && !field.required) return;

            const message = validateField(field);
            if (message) {
                setError(field, message);
            } else {
                clearError(field);
            }
        });
    });

    /* ==========================================
       ENVÍO DEL FORMULARIO
       ========================================== */
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideStatus();

        let firstInvalid = null;

        fields.forEach(field => {
            const message = validateField(field);
            if (message) {
                setError(field, message);
                if (!firstInvalid) firstInvalid = field;
            } else {
                clearError(field);
            }
        });

        if (firstInvalid) {
            showStatus('Revisa los campos marcados en rojo antes de enviar.', true);
            firstInvalid.focus({ preventScroll: true });
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const data = new FormData(form);
        const firstName = (data.get('nombre') || '').trim().split(' ')[0];
        const endpoint = (form.dataset.endpoint || '').trim();

        if (endpoint) {
            await sendWithFetch(endpoint, data, firstName);
        } else {
            sendWithMailto(data, firstName);
        }
    });

    /* ------------------------------------------
       Opción A: envío a un backend / servicio
       ------------------------------------------ */
    async function sendWithFetch(endpoint, data, firstName) {
        const originalLabel = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando…';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: data
            });

            if (!response.ok) throw new Error('Error ' + response.status);

            showStatus(
                '¡Gracias, ' + firstName + '! Recibimos tu mensaje y te responderemos ' +
                'en menos de 24 horas hábiles.'
            );
            form.reset();
            fields.forEach(clearError);
        } catch (error) {
            showStatus(
                'No pudimos enviar el mensaje. Intenta de nuevo o escríbenos a ' +
                SITE_EMAIL + '.',
                true
            );
            console.error('Error al enviar el formulario:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
        }
    }

    /* ------------------------------------------
       Opción B: respaldo con mailto
       ------------------------------------------ */
    function sendWithMailto(data, firstName) {
        const nombre = (data.get('nombre') || '').trim();
        const asunto = data.get('asunto') || 'Contacto';
        const body = [
            'Nombre: ' + nombre,
            'Correo: ' + (data.get('email') || ''),
            'Teléfono: ' + (data.get('telefono') || 'No indicado'),
            '',
            'Mensaje:',
            (data.get('mensaje') || '')
        ].join('\r\n');

        const link = 'mailto:' + SITE_EMAIL +
            '?subject=' + encodeURIComponent('[KANDRE] ' + asunto + ' - ' + nombre) +
            '&body=' + encodeURIComponent(body);

        // Abre el gestor de correo del usuario con todo ya redactado
        window.location.href = link;

        showStatus(
            '¡Gracias, ' + firstName + '! Abrimos tu aplicación de correo con el ' +
            'mensaje listo para enviar. Si no se abrió, escríbenos a ' + SITE_EMAIL + '.'
        );
    }

    /* ==========================================
       PRESELECCIÓN DEL ASUNTO POR URL
       Ejemplo: contacto.html?asunto=Tallas
       ========================================== */
    const asuntoParam = new URLSearchParams(window.location.search).get('asunto');
    if (asuntoParam) {
        const select = form.querySelector('#asunto');
        const match = Array.from(select.options).find(
            option => option.value.toLowerCase() === asuntoParam.toLowerCase()
        );
        if (match) select.value = match.value;
    }
});
