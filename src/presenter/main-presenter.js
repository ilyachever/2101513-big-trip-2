import MockService from '../service/mock-service.js';
import HeaderPresenter from '../presenter/header-presenter.js';
import PointsPresenter from '../presenter/points-presenter.js';
import DestinationModel from '../model/destination-model.js';
import EventPointsModel from '../model/event-points-model.js';
import OffersModel from '../model/offers-model.js';

const headerTripMainContainer = document.querySelector('.trip-main');
const headerFilterContainer = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const mockService = new MockService();

const destinationModel = new DestinationModel(mockService);
const eventPointsModel = new EventPointsModel(mockService);
const offersModel = new OffersModel(mockService);

const headerPresenter = new HeaderPresenter({
  headerTripInfo: headerTripMainContainer,
  headerListFilter: headerFilterContainer,
  eventPointsModel
});
const pointsPresenter = new PointsPresenter({
  tripContainer: tripEventsElement,
  destinationModel,
  eventPointsModel,
  offersModel
});

export default class MainPresenter {
  init() {
    headerPresenter.init();
    pointsPresenter.init();
  }
}
