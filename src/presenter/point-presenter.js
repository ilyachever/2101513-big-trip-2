import {render, replace, remove} from '../framework/render.js';
import {EDIT_TYPE, MODE, UPDATE_TYPE, USER_ACTION,} from '../constants.js';
import EditItemView from '../view/edit-item-view.js';
import TripItemView from '../view/trip-item-view.js';
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
  #mode = MODE.DEFAULT;

  constructor({pointListContainer, destinationModel, offersModel, onPointChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onPointChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new TripItemView({
      destination: this.#destinationModel.getById(point.destination),
      eventPoint: this.#point,
      offers: this.#offersModel.getByType(point.type),
      onEditClick: this.#pointEditHandler,
      onFavoriteClick: this.#pointFavoriteHandler
    });
    this.#editPointComponent = new EditItemView({
      destinations: this.#destinationModel.get(),
      eventPoint: this.#point,
      offers: this.#offersModel.get(),
      editorMode: EDIT_TYPE.EDITING,
      onCloseClick: this.#pointCloseEditHandler,
      onSaveEdit: this.#pointEditSubmitHandler,
      onDeleteClick: this.#deleteClickHandler,
    });
    if (!prevPointComponent || !prevEditPointComponent) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === MODE.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === MODE.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  resetView() {
    if (this.#mode !== MODE.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #deleteClickHandler = (point) => {
    this.#handleDataChange(USER_ACTION.DELETE_POINT, UPDATE_TYPE.MINOR, point);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = MODE.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = MODE.DEFAULT;
  }

  #pointEditHandler = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #pointCloseEditHandler = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #pointEditSubmitHandler = (point) => {
    const currentTypeChange = isMinorChange(point, this.#point) ? UPDATE_TYPE.MINOR : UPDATE_TYPE.PATCH;
    this.#handleDataChange(
      USER_ACTION.UPDATE_POINT,
      currentTypeChange,
      point,
    );
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #pointFavoriteHandler = () => {
    this.#handleDataChange(USER_ACTION.UPDATE_POINT, UPDATE_TYPE.PATCH, {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };
}
