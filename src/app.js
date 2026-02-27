import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsPresenter from './presenter/points-presenter.js';
import DestinationModel from './model/destination-model.js';
import EventPointsModel from './model/event-points-model.js';
import OffersModel from './model/offers-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import AddPointButtonPresenter from './presenter/add-point-button-presenter.js';
import PointsApiService from './service/points-api-service.js';

const siteTripMainContainer = document.querySelector('.trip-main');
const siteFilterContainer = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const AUTHORIZATION = 'Basic eo0w590ik29889a';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const destinationModel = new DestinationModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);
const eventPointsModel = new EventPointsModel(
  pointsApiService,
  destinationModel,
  offersModel,
);
const filtersModel = new FilterModel();
const filtersPresenter = new FilterPresenter({
  filterContainer: siteFilterContainer,
  eventPointsModel,
  filtersModel,
});

const tripInfoPresenter = new TripInfoPresenter({
  container: siteTripMainContainer,
  eventPointsModel,
  destinationModel,
  offersModel,
  headerListFilter: siteFilterContainer
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
    eventPointsModel.init();
  }
}
