export default class Vector {
  _x: number
  _y: number

  static create({x: x1, y: y1}, {x: x2, y: y2}): Vector {
    return new Vector(x2 - x1, y2 - y1);
  }

  constructor(x = 1, y = 1) {
    this._x = x;
    this._y = y;
  }

  get x() { return this._x; }
  set x(x) { this._x = x; }

  get y() { return this._y; }
  set y(y) { this._y = y; }

  get angle() {
    return Math.atan2(this.y, this.x);
  }
  set angle(angle) {
    const length = this.length;
    this.x = length * Math.cos(angle);
    this.y = length * Math.sin(angle);
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set length(length) {
    const angle = this.angle;
    this.x = length * Math.cos(angle);
    this.y = length * Math.sin(angle);
  }

  rotate(degree) {
    return new Vector(this.x, this.y).rotateBy(degree);
  }

  rotateBy(degree) {
    this.angle += degree;
    return this;
  }

  add(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  addTo(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  subtractFrom(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  multiplyBy(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  divideBy(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  toString() {
    return `[${this.x}, ${this.y}]`;
  }

}
