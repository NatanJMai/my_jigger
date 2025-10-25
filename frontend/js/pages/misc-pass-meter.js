/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Misc Pass Meter
 */

class PasswordMeter {
    constructor(inputSelector = 'input[type="password"]', barClass = 'strong-bar', meterWrapperClass = 'password-bar', passwordBoxId = 'password-input', options = {}) {
        this.inputSelector = inputSelector
        this.barClass = barClass
        this.meterWrapperClass = meterWrapperClass
        this.passwordBoxId = passwordBoxId
    }

    init() {
        this.initProgressBar();
        this.initPasswordBox();
    }

    initProgressBar() {
        const inputs = document.querySelectorAll(this.inputSelector);
        if (inputs && inputs.length > 0) {
            inputs.forEach(input => {
                const meterWrapper = input.nextElementSibling;
                if (!meterWrapper || !meterWrapper.classList.contains(this.meterWrapperClass)) return;

                meterWrapper.innerHTML = '';

                // Create bars
                for (let i = 0; i < 4; i++) {
                    const bar = document.createElement('div');
                    bar.classList.add(this.barClass);
                    meterWrapper.appendChild(bar);
                }

                const bars = meterWrapper.querySelectorAll(`.${this.barClass}`);

                input.addEventListener('input', () => {
                    const value = input.value;
                    const score = this.getPasswordScore(value);

                    bars.forEach(bar => bar.className = this.barClass);
                    bars.forEach((bar, i) => {
                        if (i < score) bar.classList.add(`bar-active-${score}`);
                    });
                });
            });
        }

    }

    getPasswordScore(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[\W_]/.test(password)) score++;
        return score;
    }

    initPasswordBox() {
        const input = document.getElementById(this.passwordBoxId);
        const container = document.querySelector('.password-box');
        const checks = {
            lower: document.getElementById('pass-lower'),
            upper: document.getElementById('pass-upper'),
            number: document.getElementById('pass-number'),
            length: document.getElementById('pass-length')
        };

        if (!input || !container || !Object.values(checks).every(Boolean)) return;

        let collapseInstance = null;

        try {
            collapseInstance = new bootstrap.Collapse(container, {toggle: false});
        } catch (err) {
            console.warn("Bootstrap Collapse not available:", err);
        }

        input.addEventListener("focus", () => collapseInstance?.show());
        input.addEventListener("blur", () => {
            if (!input.value.length) collapseInstance?.hide();
        });

        input.addEventListener("keyup", () => {
            const value = input.value;
            this.toggleValidity(checks.lower, /[a-z]/.test(value));
            this.toggleValidity(checks.upper, /[A-Z]/.test(value));
            this.toggleValidity(checks.number, /[0-9]/.test(value));
            this.toggleValidity(checks.length, value.length >= 8);
        });
    }

    toggleValidity(element, isValid) {
        element.classList.toggle("valid", isValid);
        element.classList.toggle("invalid", !isValid);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PasswordMeter().init();
})
