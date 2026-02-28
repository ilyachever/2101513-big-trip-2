import {render, replace, remove} from '../framework/render.js';
import {EditType, Mode, UpdateType, UserAction,} from '../constants.js';
import EditPointView from '../view/edit-point-view.js';
import TripPointView from '../view/trip-point-view.js';
import {isMinorChange} from '../utils/common.js';

export default class PointPresenter {
  #pointListContainer = null;
  #destinationModel = null;
  #offersModel = null;
  #point = null;
  #pointComponent = null;
  #editPointComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({pointListContainer, destinationModel, offersModel, onPointChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onPointChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const preventPointComponent = this.#pointComponent;
    const preventEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new TripPointView({
      destination: this.#destinationModel.getById(point.destination),
      eventPoint: this.#point,
      offers: this.#offersModel.getByType(point.type),
      onEditClick: this.#pointEditClickHandler,
      onFavoriteClick: this.#onFavoriteClickHandler
    });
    this.#editPointComponent = new EditPointView({
      destinations: this.#destinationModel.get(),
      eventPoint: this.#point,
      offers: this.#offersModel.get(),
      editorMode: EditType.EDITING,
      onCloseClick: this.#pointEditCloseCLickHandler,
      onSaveEdit: this.#pointEditSaveClickHandler,
      onDeleteClick: this.#pointDeleteClickHandler,
    });

    if (!preventPointComponent || !preventEditPointComponent) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, preventPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, preventEditPointComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(preventPointComponent);
    remove(preventEditPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  }

  #pointDeleteClickHandler = (point) => {
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToEditForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    this.#editPointComponent.reset(this.#point);
    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = Mode.DEFAULT;
  }

  #pointEditClickHandler = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #pointEditCloseCLickHandler = () => {
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #pointEditSaveClickHandler = (point) => {
    const currentTypeChange = isMinorChange(point, this.#point) ? UpdateType.MINOR : UpdateType.PATCH;
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      currentTypeChange,
      point,
    );
  };

  #onFavoriteClickHandler = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#editPointComponent.shake();
      this.#pointComponent.shake();
      return;
    }

    if (this.#mode === Mode.EDITING) {
      const resetFormState = () => {
        this.#editPointComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      };

      this.#editPointComponent.shake(resetFormState);
    }
  };

  setRemove = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };
}
