import {generateOffer} from '../mock/offers.js';
import {generateDestination} from '../mock/destination.js';
import {generatePoint} from '../mock/event-points.js';
import {EVENTS_TYPES, CITIES, OFFER_COUNT} from '../constants.js';
import {getRandomArrayElement, getRandomIntFromDuration} from '../utils/common.js';

export default class MockService {
  destinations = [];
  offers = [];
  eventPoints = [];

  constructor() {
    this.destinations = this.generateDestinations();
    this.offers = this.generateOffers();
    this.eventPoints = this.generateEventPoints();
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getEventPoints() {
    return this.eventPoints;
  }

  generateDestinations() {
    return Array.from({length: CITIES.length}, generateDestination);
  }

  generateOffers() {
    return EVENTS_TYPES.map((type) => ({
      type,
      offers: Array.from({length: getRandomIntFromDuration(OFFER_COUNT.MIN, OFFER_COUNT.MAX)}, generateOffer)
    }));
  }

  generateEventPoints() {
    return Array.from({length: EVENTS_TYPES.length}, () => {
      const type = getRandomArrayElement(EVENTS_TYPES);
      const destination = getRandomArrayElement(this.destinations);
      const offersByType = this.offers.find((offer) => offer.type === type);

      const randomOffers = new Set();

      Array.from({length: getRandomIntFromDuration(1, offersByType.offers.length)}, () => {
        randomOffers.add(getRandomArrayElement(offersByType.offers));
      });

      const hasOffers = (randomOffers.size > 0 && [...randomOffers][0]);
      const offerIds = hasOffers ? [...randomOffers].map((offer) => offer.id) : [];

      return generatePoint(type, destination.id, offerIds);
    });
  }

  updatePoint(updatePoint) {
    return updatePoint;
  }

  addPoint(data) {
    return data;
  }

  deletePoint() {
  }
}
