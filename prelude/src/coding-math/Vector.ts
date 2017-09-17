export default class Vector implements IPosition {
  _x: number;
  _y: number;

  static of(x: number, y: number): Vector {
    return new Vector(x, y);
  }

  static create(p1: IPosition, p2: IPosition): Vector {
    return new Vector(p2.x - p1.x, p2.y - p1.y);
  }

  constructor(x: number = 1, y: number = 1) {
    this._x = x;
    this._y = y;
  }

  get x() { return this._x; }
  set x(x: number) { this._x = x; }

  get y() { return this._y; }
  set y(y: number) { this._y = y; }

  get angle() {
    return Math.atan2(this.y, this.x);
  }
  set angle(angle: number) {
    const length = this.length;
    this.x = length * Math.cos(angle);
    this.y = length * Math.sin(angle);
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set length(length: number) {
    const angle = this.angle;
    this.x = length * Math.cos(angle);
    this.y = length * Math.sin(angle);
  }

  get cos() {
    return this._x / this.length;
  }

  get sin() {
    return this._y / this.length;
  }

  get tan() {
    return this._y / this._x;
  }

  withLength(length: number) {
    const newVector = new Vector(this.x, this.y);
    newVector.length = length;
    return newVector;
  }

  rotate(degree: number) {
    return new Vector(this.x, this.y).rotateBy(degree);
  }

  rotateBy(degree: number) {
    this.angle += degree;
    return this;
  }

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  subtract(other: IPosition) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  multiply(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number) {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  addTo(other: Vector) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  subtractFrom(other: Vector) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  multiplyBy(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  divideBy(scalar: number) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  toString() {
    return `[${this.x}, ${this.y}]`;
  }

}
