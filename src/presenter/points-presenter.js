import { render } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import EmptyEventPointBoard from '../view/no-event-points-view.js';
import ListSortView from '../view/list-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import PointPresenter from './point-presenter.js';

export default class PointsPresenter {
  #tripContainer = null;
  #destinationModel = null;
  #eventPointsModel = null;
  #offersModel = null;
  #tripListComponent = new TripListView();
  #eventPoints = [];
  #pointsPresenter = new Map();

  constructor ({ tripContainer, destinationModel, eventPointsModel, offersModel }) {
    this.#tripContainer = tripContainer;
    this.#destinationModel = destinationModel;
    this.#eventPointsModel = eventPointsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#eventPoints = [...this.#eventPointsModel.eventPoints];

    if (!this.#eventPoints.length) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderTripList();
  }

  #handleDataChange = (updatedPoint) => {
    this.#eventPoints = updateItem(this.#eventPoints, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderSort() {
    render(new ListSortView(), this.#tripContainer);
  }

  #renderTripList() {
    render(this.#tripListComponent, this.#tripContainer);
    this.#renderPoints();
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoints() {
    this.#eventPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderEmptyList() {
    render(new EmptyEventPointBoard(), this.#tripContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent.element,
      destinationModel: this.#destinationModel,
      offersModel: this.#offersModel,
      onPointChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointsPresenter.set(point.id, pointPresenter);
  }
}
