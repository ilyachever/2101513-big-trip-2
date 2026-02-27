import {render, replace} from '../framework/render.js';
import ListSortView from '../view/list-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripItemView from '../view/trip-item-view.js';
import EditItemView from '../view/edit-item-view.js';
import EmptyEventPointBoard from '../view/no-event-points-view.js';

export default class MainPresenter {
  #tripContainer = null;
  #destinationModel = null;
  #eventPointsModel = null;
  #offersModel = null;
  #sortComponent = new ListSortView();
  #tripListComponent = new TripListView();
  #eventPoints = [];
  #destinations = [];

  constructor({tripContainer, destinationModel, eventPointsModel, offersModel}) {
    this.#tripContainer = tripContainer;
    this.#destinationModel = destinationModel;
    this.#eventPointsModel = eventPointsModel;
    this.#offersModel = offersModel;
    this.#eventPoints = this.#eventPointsModel.get();
    this.offers = this.#offersModel.get();
    this.#destinations = this.#destinationModel.get();
  }

  init() {
    render(this.#sortComponent, this.#tripContainer);
    render(this.#tripListComponent, this.#tripContainer);

    if (!this.#eventPoints.length) {
      render(new EmptyEventPointBoard(), this.#tripContainer);

      return;
    }

    this.#eventPoints.forEach((eventPoint) => {
      const destination = this.#destinationModel.getById(eventPoint.destination);
      this.#renderEventPoint(this.#destinations, destination, eventPoint, this.#offersModel.getByType(eventPoint.type));
    });
  }

  #renderEventPoint(destinations, destination, eventPoint, offers) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const eventPointComponent = new TripItemView({
      destination,
      eventPoint,
      offers,
      onEditClick: () => {
        editPointHandler();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const eventEditPointComponent = new EditItemView({
      destinations,
      destination,
      eventPoint,
      offers,
      onCloseClick: () => {
        editPointCloseHandler();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onSaveEdit: () => {
        editPointSubmitHandler();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToEditForm() {
      replace(eventEditPointComponent, eventPointComponent);
    }

    function replaceEditFormToPoint() {
      replace(eventPointComponent, eventEditPointComponent);
    }

    function editPointHandler() {
      replacePointToEditForm();
    }

    function editPointCloseHandler() {
      replaceEditFormToPoint();
    }

    function editPointSubmitHandler() {
      replaceEditFormToPoint();
    }

    render(eventPointComponent, this.#tripListComponent.element);
  }
}
