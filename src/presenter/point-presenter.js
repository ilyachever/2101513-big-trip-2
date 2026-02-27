import { render, replace, remove } from '../framework/render.js';
import { MODE } from '../constants.js';
import EditItemView from '../view/edit-item-view.js';
import TripItemView from '../view/trip-item-view.js';

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

  constructor ({ pointListContainer, destinationModel, offersModel, onPointChange, onModeChange }) {
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
      destinations: this.#destinationModel.destinations,
      destination: this.#destinationModel.getById(point.destination),
      eventPoint: this.#point,
      offers: this.#offersModel.getByType(point.type),
      onCloseClick: this.#pointCloseEditHandler,
      onFormSubmit: this.#pointEditSubmitHandler
    });

    if (prevPointComponent === null || prevEditPointComponent === null) {
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
      this.#replaceFormToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToForm() {
    replace(this.#editPointComponent , this.#pointComponent);
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
    this.#replaceFormToPoint();
    this.#handleDataChange(point);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #pointFavoriteHandler = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
