import { Modal } from 'bootstrap';
import Rails from '@rails/ujs';

const DEFAULTS = {
  title: 'Are you sure?',
  commit: 'Confirm',
  commitClass: 'btn-danger',
  cancel: 'Cancel',
  cancelClass: 'btn-default',
  fade: true,
  verifyClass: 'form-control',
  elements: ['a[data-confirm]', 'button[data-confirm]', 'input[type=submit][data-confirm]'],
  focus: 'commit',
  zIndex: 1050,
  modalClass: '',
  modalCloseLabel: 'Close',
  modalCloseContent: '<span aria-hidden="true">&times;</span>'
};

class DataConfirmModal {
  constructor() {
    this.settings = { ...DEFAULTS };
    this.init();
  }

  init() {
    document.addEventListener('click', (event) => {
      const element = event.target.closest('[data-confirm]');
      if (element) {
        event.preventDefault();
        this.showModal(element);
      }
    });
  }

  showModal(element) {
    const modal = this.buildModal(element);
    const modalInstance = new Modal(modal);
    modalInstance.show();

    const confirmBtn = modal.querySelector('.commit');
    confirmBtn.addEventListener('click', () => {
      element.dispatchEvent(new CustomEvent('confirm:complete', { bubbles: true }));
      modalInstance.hide();
    });
  }

  buildModal(element) {
    const modalId = `confirm-modal-${String(Math.random()).slice(2, -1)}`;
    const modalTemplate = document.createElement('div');
    modalTemplate.className = `modal fade ${this.settings.modalClass}`;
    modalTemplate.id = modalId;
    modalTemplate.tabIndex = -1;
    modalTemplate.role = 'dialog';
    modalTemplate.setAttribute('aria-labelledby', `${modalId}-title`);
    modalTemplate.setAttribute('aria-hidden', 'true');

    modalTemplate.innerHTML = `
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="${modalId}-title" class="modal-title">${element.getAttribute('data-title') || this.settings.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${this.settings.modalCloseLabel}"></button>
          </div>
          <div class="modal-body">${element.getAttribute('data-confirm') || ''}</div>
          <div class="modal-footer">
            <button type="button" class="btn cancel" data-bs-dismiss="modal">${element.getAttribute('data-cancel') || this.settings.cancel}</button>
            <button type="button" class="btn commit ${element.getAttribute('data-commit-class') || this.settings.commitClass}">
              ${element.getAttribute('data-commit') || this.settings.commit}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalTemplate);
    return modalTemplate;
  }
}

const dataConfirmModal = new DataConfirmModal();

Rails.confirm = (message, element) => {
  if (!element.getAttribute('data-confirm')) {
    return true; // proceed if no data-confirm is set
  }
  dataConfirmModal.showModal(element);
  return false; // prevent default confirmation
};
