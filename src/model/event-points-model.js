export default class EventPointsModel {
  #eventPoints = [];

  constructor(service) {
    this.#eventPoints = service.getEventPoints();
  }

  get eventPoints() {
    return this.#eventPoints;
  }
}
