/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Form Wizard
 */

class FormWizard {
    constructor(wizardElement) {
        this.wizard = wizardElement;
        this.form = wizardElement.closest('form');
        this.validate = this.form?.hasAttribute('data-wizard-validation') ?? false;
        this.tabs = wizardElement.querySelectorAll('[data-wizard-nav] .nav-link');
        this.tabPanes = wizardElement.querySelectorAll('[data-wizard-content] .tab-pane');
        this.progressBar = wizardElement.querySelector('[data-wizard-progress]');
        this.currentIndex = 0;
    }

    init() {
        this.disableFutureTabs();
        this.bindTabClicks();
        this.bindButtons();
        this.updateProgress(this.currentIndex);
        this.showTab(this.currentIndex);
    }

    disableFutureTabs() {
        if (this.validate) {
            this.tabs.forEach((tab, index) => {
                if (index > 0) tab.classList.add('disabled');
            });
        }
    }

    bindTabClicks() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                if (this.validate && index > this.currentIndex && !this.validateStep(this.currentIndex)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            });

            tab.addEventListener('shown.bs.tab', () => {
                this.currentIndex = index;
                this.updateProgress(index);
            });
        });
    }

    bindButtons() {
        this.wizard.querySelectorAll('[data-wizard-next]').forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        this.wizard.querySelectorAll('[data-wizard-prev]').forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });

        if (this.form) {
            this.form.addEventListener('submit', () => {
                if (this.progressBar) {
                    this.progressBar.style.width = '100%';
                }
            });
        }
    }

    nextStep() {
        if (this.currentIndex >= this.tabs.length - 1) return;

        if (!this.validate || this.validateStep(this.currentIndex)) {
            if (this.validate) this.tabs[this.currentIndex + 1].classList.remove('disabled');
            this.tabs[this.currentIndex].classList.add('wizard-item-done');
            this.showTab(this.currentIndex + 1);
        }
    }

    prevStep() {
        if (this.currentIndex <= 0) return;
        this.tabs[this.currentIndex - 1].classList.remove('wizard-item-done');
        this.showTab(this.currentIndex - 1);
    }

    validateStep(index) {
        if (!this.validate) return true;

        const inputs = this.tabPanes[index].querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');

            if (!input.checkValidity()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.add('is-valid');
            }
        });

        return isValid;
    }

    updateProgress(index) {
        if (this.progressBar) {
            const percent = (index / (this.tabs.length - 1)) * 100;
            this.progressBar.style.width = `${Math.min(percent, 100)}%`;
        }
    }

    showTab(index) {
        if (index < 0 || index >= this.tabs.length) return;
        if (this.validate && this.tabs[index].classList.contains('disabled')) return;

        new bootstrap.Tab(this.tabs[index]).show();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-wizard]').forEach(wizardEl => {
        const wizard = new FormWizard(wizardEl);
        wizard.init();
    });
});