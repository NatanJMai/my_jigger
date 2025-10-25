/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Misc SweetAlerts
 */
import logoSm from '@/images/logo-sm.png'
import Swal from 'sweetalert2';
import cta from '@/images/landing-cta.jpg'

const defaultButtonClasses = {
    confirmButton: 'btn btn-primary mt-2',
    cancelButton: 'btn btn-danger mt-2',
};

const successToastConfig = {
    icon: 'success',
    text: 'Saved successfully!',
    showConfirmButton: false,
    timer: 1500,
    buttonsStyling: false,
    customClass: { confirmButton: defaultButtonClasses.confirmButton }
};

// Show a basic alert
const showAlert = (options) => {
    Swal.fire({
        buttonsStyling: false,
        customClass: { confirmButton: defaultButtonClasses.confirmButton },
        ...options
    });
};

const bindAlert = (id, options) => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener("click", () => showAlert(options));
    }
};

const bindPositionalAlert = (id, position) => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener("click", () => {
            Swal.fire({
                position,
                ...successToastConfig
            });
        });
    }
};


// Basic Alert
bindAlert("sweetalert-basic", {
    title: "Simple Alert",
    text: "This is a basic SweetAlert dialog."
});

// Title Alert
bindAlert("sweetalert-title", {
    title: "Notice",
    text: "This is a titled alert with additional details.",
    icon: "question",
    showCloseButton: true
});

// Long Content Alert
bindAlert("sweetalert-longcontent", {
    imageUrl: "https://placehold.co/300x1000/1ab394/white",
    imageHeight: 1000,
    imageAlt: "Very tall content image",
    showCloseButton: true,
    customClass: { confirmButton: "btn btn-secondary mt-2" }
});

// Confirm Button Alert
const confirmBtn = document.getElementById("sweetalert-confirm-button");
if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
        Swal.fire({
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this item?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            showCloseButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-primary me-2 mt-2",
                cancelButton: "btn btn-danger mt-2"
            }
        }).then(result => {
            if (result.isConfirmed) {
                showAlert({
                    title: "Deleted!",
                    text: "Your item has been successfully removed.",
                    icon: "success"
                });
            }
        });
    });
}

// Cancel Button Alert with Params
const paramsBtn = document.getElementById("sweetalert-params");
if (paramsBtn) {
    paramsBtn.addEventListener("click", () => {
        Swal.fire({
            title: "Delete File?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            showCloseButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: defaultButtonClasses.confirmButton + " me-2",
                cancelButton: defaultButtonClasses.cancelButton
            }
        }).then(result => {
            if (result.isConfirmed) {
                showAlert({
                    title: "Deleted!",
                    text: "The file has been deleted.",
                    icon: "success"
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                showAlert({
                    title: "Action Cancelled",
                    text: "Your file is safe.",
                    icon: "error"
                });
            }
        });
    });
}

// Image Alert
bindAlert("sweetalert-image", {
    title: "Custom Branding",
    text: "This alert includes a logo.",
    imageUrl: logoSm,
    imageHeight: 40,
    showCloseButton: true
});

// Auto-Close Alert
const closeButton = document.getElementById("sweetalert-close");
if (closeButton) {
    closeButton.addEventListener("click", () => {
        let timerInterval;
        Swal.fire({
            title: "Auto Dismiss",
            html: "Closing in <b></b> seconds...",
            timer: 2000,
            timerProgressBar: true,
            showCloseButton: true,
            didOpen: () => {
                Swal.showLoading();
                timerInterval = setInterval(() => {
                    const b = Swal.getHtmlContainer()?.querySelector("b");
                    if (b) {
                        b.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }
                }, 100);
            },
            willClose: () => clearInterval(timerInterval)
        }).then(result => {
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("Alert closed by timer");
            }
        });
    });
}

// Position Alerts
bindPositionalAlert("position-top-start", "top-start");
bindPositionalAlert("position-top-end", "top-end");
bindPositionalAlert("position-bottom-start", "bottom-start");
bindPositionalAlert("position-bottom-end", "bottom-end");

// Info Alert
bindAlert("sweetalert-info", {
    text: "This is an informational message to keep you updated.",
    icon: "info",
    confirmButtonText: "Understood",
    customClass: { confirmButton: "btn btn-info" }
});

// Warning Alert
bindAlert("sweetalert-warning", {
    text: "Heads up! Something might require your attention.",
    icon: "warning",
    confirmButtonText: "Got it",
    customClass: { confirmButton: "btn btn-warning" }
});

// Error Alert
bindAlert("sweetalert-error", {
    text: "An unexpected error occurred. Please try again.",
    icon: "error",
    confirmButtonText: "Dismiss",
    customClass: { confirmButton: "btn btn-danger" }
});

// Success Alert
bindAlert("sweetalert-success", {
    text: "Action completed successfully!",
    icon: "success",
    confirmButtonText: "Great!",
    customClass: { confirmButton: "btn btn-success" }
});

// Question Alert
bindAlert("sweetalert-question", {
    text: "Do you need more information about this feature?",
    icon: "question",
    confirmButtonText: "Yes, please"
});

// HTML Alert
bindAlert("custom-html-alert", {
    title: '<i>HTML</i> <u>Alert</u>',
    html: 'Use <b>bold</b>, <a href="#">links</a>, and other HTML here.',
    icon: 'info',
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonText: '<i class="ti ti-thumb-up-filled me-1"></i> Like it!',
    cancelButtonText: '<i class="ti ti-thumb-down-filled"></i>',
    customClass: {
        confirmButton: 'btn btn-success me-2',
        cancelButton: 'btn btn-danger'
    }
});

// Custom Styling Alert
bindAlert("custom-padding-width-alert", {
    title: "Custom Design",
    html: '<p class="text-white">This alert has custom size, padding, and background.</p>',
    width: 600,
    padding: "100px",
    color: "#fff",
    background: `var(--ins-secondary-bg) url('${cta}') no-repeat center`,
    customClass: { confirmButton: 'btn btn-primary' }
});

// Ajax Request Alert
const ajaxBtn = document.getElementById("ajax-alert");
if (ajaxBtn) {
    ajaxBtn.addEventListener("click", () => {
        Swal.fire({
            title: "<h4>Enter Your Email</h4>",
            input: "email",
            inputPlaceholder: "Enter your email address",
            showCancelButton: true,
            confirmButtonText: "Submit",
            showLoaderOnConfirm: true,
            showCloseButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-primary me-2",
                cancelButton: "btn btn-danger"
            },
            preConfirm: email => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (email === "taken@example.com") {
                            reject("This email is already registered.");
                        } else {
                            resolve(email);
                        }
                    }, 1500);
                });
            },
            allowOutsideClick: false
        }).then(result => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Submitted!",
                    html: `Your email: ${result.value}`,
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                });
            }
        });
    });
}