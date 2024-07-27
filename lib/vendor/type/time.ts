export class Time {
  private now() {
    return new Date();
  }

  static now() {
    return new Time().now();
  }
}
