import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsPresenter from './presenter/points-presenter.js';
import MockService from './service/mock-service.js';
import DestinationModel from './model/destination-model.js';
import EventPointsModel from './model/event-points-model.js';
import OffersModel from './model/offers-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import AddPointButtonPresenter from './presenter/add-point-button-presenter.js';

const siteTripMainContainer = document.querySelector('.trip-main');
const siteFilterContainer = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const mockService = new MockService();

const destinationModel = new DestinationModel(mockService);
const eventPointsModel = new EventPointsModel(mockService);
const offersModel = new OffersModel(mockService);
const filtersModel = new FilterModel();

const filtersPresenter = new FilterPresenter({
  filterContainer: siteFilterContainer,
  eventPointsModel,
  filtersModel,
});
const tripInfoPresenter = new TripInfoPresenter({
  container: siteTripMainContainer,
  headerListFilter: siteFilterContainer,
  eventPointsModel
});
const addPointButtonPresenter = new AddPointButtonPresenter({
  container: siteTripMainContainer,
});
const pointsPresenter = new PointsPresenter({
  tripContainer: tripEventsElement,
  destinationModel,
  eventPointsModel,
  offersModel,
  filtersModel,
  addPointButtonPresenter: addPointButtonPresenter,
});

export default class BigTripApp {
  init() {
    addPointButtonPresenter.init({onButtonClick: pointsPresenter.addPointButtonClickHandler});
    tripInfoPresenter.init();
    filtersPresenter.init();
    pointsPresenter.init();
  }
}
