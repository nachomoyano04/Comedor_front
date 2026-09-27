import Swal from "sweetalert2";

// Toast flotante no-bloqueante (optimizado para celulares y tablets)
// No bloquea la pantalla, no interfiere con teclados virtuales y desaparece solo en 2.5s
const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.style.zIndex = "99999";
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export const notify = {
    success: (title, text = "") => {
        return Toast.fire({
            icon: "success",
            title: title,
            text: text
        });
    },

    error: (title, text = "") => {
        const errorMsg = typeof title === "string" ? title : (title?.response?.data?.error || title?.message || "Ocurrió un error");
        return Toast.fire({
            icon: "error",
            title: errorMsg,
            text: text,
            timer: 3500
        });
    },

    warning: (title, text = "") => {
        return Toast.fire({
            icon: "warning",
            title: title,
            text: text
        });
    },

    info: (title, text = "") => {
        return Toast.fire({
            icon: "info",
            title: title,
            text: text
        });
    },

    // Diálogo de confirmación táctil con botones grandes y diseño responsive
    confirm: async ({
        title = "¿Estás seguro?",
        text = "Esta acción no se puede deshacer",
        confirmButtonText = "Sí, confirmar",
        cancelButtonText = "Cancelar",
        icon = "warning"
    }) => {
        const res = await Swal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            reverseButtons: true,
            focusCancel: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#64748b",
            customClass: {
                popup: "rounded-4 shadow-lg border-0 p-3",
                confirmButton: "btn btn-primary px-4 py-2 fw-semibold",
                cancelButton: "btn btn-outline-secondary px-4 py-2 me-2"
            },
            buttonsStyling: false
        });
        return res.isConfirmed;
    }
};

export default notify;
