export class Time {
  now = () => new Date();

  static now = () => new Time().now();
}
