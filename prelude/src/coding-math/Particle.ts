interface IVector {
  x: number;
  y: number;
}

export default class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  gravity: number;
  radius: number;
  friction: number;

  public static create({
    x = 0,
    y = 0,
    speed = 0,
    direction = 0,
    mass = 0,
    gravity = 0,
    radius = 1,
    friction = 0}: {
      x?: number,
      y?: number,
      speed?: number
      direction?: number,
      mass?: number,
      gravity?: number,
      radius?: number,
      friction?: number,
    }) {
    const particle = new Particle();
    particle.x = x;
    particle.y = y;
    particle.vx = Math.cos(direction) * speed;
    particle.vy = Math.sin(direction) * speed;
    particle.mass = mass;
    particle.gravity = gravity;
    particle.radius = radius;
    particle.friction = friction;
    return particle;
  }

  accelerate({vx, vy}:
             {vx: number, vy: number}) {
    this.vx += vx;
    this.vy += vy;
  }

  get direction() {
    return Math.atan2(this.vy, this.vx);
  }
  set direction(direction: number) {
    const speed = this.speed;
    this.vx = Math.cos(direction) * speed;
    this.vy = Math.sin(direction) * speed;
  }

  get speed() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }
  set speed(speed: number) {
    const direction = this.direction;
    this.vx = Math.cos(direction) * speed;
    this.vy = Math.sin(direction) * speed;
  }

  update() {
    this.vy += this.gravity;
    this.vx *= 1 - this.friction;
    this.vy *= 1 - this.friction;
    this.x += this.vx;
    this.y += this.vy;
  }

  distanceTo({x, y}: IVector) {
    return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
  }

  angleTo({x, y}: IVector) {
    return Math.atan2(y - this.y, x - this.x);
  }

  gravitateTo(p2: Particle) {
    const dx = p2.x - this.x,
    dy = p2.y - this.y,
    dist = this.distanceTo(p2),
    length = p2.mass / (dist * dist),
    gx = dx / dist * length,
    gy = dy / dist * length;

    this.accelerate({vx: gx, vy: gy});
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x,
                this.y,
                this.radius,
                0, Math.PI * 2,
                false);
    context.fill();
  }

}
