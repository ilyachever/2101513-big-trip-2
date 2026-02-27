import HeaderPresenter from './presenter/header-presenter.js';
import MainPresenter from './presenter/main-presenter.js';

const headerTripMainContainer = document.querySelector('.trip-main');
const headerFilterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const headerPresenter = new HeaderPresenter({
  headerTripInfo: headerTripMainContainer,
  headerListFilter: headerFilterContainer,
});
const mainPresenter = new MainPresenter({tripContainer: tripEventsContainer});

headerPresenter.init();
mainPresenter.init();
