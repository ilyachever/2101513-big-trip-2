export default class EventPointsModel {
  #eventPoints = [];

  constructor(service) {
    this.#eventPoints = service.getEventPoints();
  }

  get() {
    return this.#eventPoints;
  }
}
