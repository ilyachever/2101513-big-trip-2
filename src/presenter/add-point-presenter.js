import {remove, render, RenderPosition} from '../framework/render.js';
import {EDIT_TYPE, UPDATE_TYPE, USER_ACTION} from '../constants.js';
import EditItemView from '../view/edit-item-view.js';

export default class AddPointPresenter {
  #container = null;
  #destinationModel = [];
  #offersModel = [];
  #addPointComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;

  constructor({container, destinationModel, offersModel, onDataChange, onDestroy}) {
    this.#container = container;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#addPointComponent !== null) {
      return;
    }
    this.#addPointComponent = new EditItemView ({
      destinations: this.#destinationModel.get(),
      offers: this.#offersModel.get(),
      onCloseClick: this.#cancelClickHandler,
      onSaveEdit: this.#formSubmitHandler,
      editorMode: EDIT_TYPE.CREATING,
    });

    render(this.#addPointComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy({isCanceled = true} = {}) {
    if (!this.#addPointComponent) {
      return;
    }

    remove(this.#addPointComponent);
    this.#addPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleDestroy({isCanceled});
  }

  setSaving = () => {
    this.#addPointComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#addPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#addPointComponent.shake(resetFormState);
  };

  #cancelClickHandler = () => {
    this.destroy({isCanceled: true});
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy({isCanceled: true});
    }
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      USER_ACTION.CREATE_POINT,
      UPDATE_TYPE.MINOR,
      point
    );

    this.destroy({isCanceled: false});
  };
}
