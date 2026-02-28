import {remove, render, RenderPosition} from '../framework/render.js';
import {EditType, UpdateType, UserAction} from '../constants.js';
import EditPointView from '../view/edit-point-view.js';

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
    this.#addPointComponent = new EditPointView ({
      destinations: this.#destinationModel.get(),
      offers: this.#offersModel.get(),
      onCloseClick: this.#cancelClickHandler,
      onSaveEdit: this.#formSubmitHandler,
      editorMode: EditType.CREATING,
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
    this.#handleDestroy({isCanceled});
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving = () => {
    if(!this.#addPointComponent) {
      return;
    }
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
    document.addEventListener('keydown', this.#escKeyDownHandler);
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
      UserAction.CREATE_POINT,
      UpdateType.MINOR,
      point
    );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
