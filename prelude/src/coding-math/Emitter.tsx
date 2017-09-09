import * as React from 'react';
import dat from 'dat.gui/build/dat.gui.js';
import Particle from './Particle';

const CANVAS_ID = 'regen-canvas';

export default class Regen extends React.Component {
  gui: any;
  canvas: HTMLCanvasElement;
  requesttAnimationFrameId: number;

  render() {
    return <canvas ref={this.ref}/>;
  }

  componentWillUnmount() {
    this.gui.destroy();
    cancelAnimationFrame(this.requesttAnimationFrameId);
  }

  componentDidMount() {
    const self = this;
    const canvas = this.canvas,
          context = canvas.getContext('2d')!,
          width = window.innerWidth,
          height = window.innerHeight;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    context.scale(window.devicePixelRatio, window.devicePixelRatio);

    const randomDirection = () => (-Math.PI / 2 + config.angle / 2) - Math.random() * config.angle;
    const randomSpeed  = () => config.initVelocity + Math.random() * 6;

    const particles: Particle[] = [];

    const config = {
      _gravity: 0.1,
      get gravity() { return this._gravity; },
      set gravity(gravity: number) {
        this._gravity = gravity;
        particles.forEach(p => {
          p.gravity = gravity;
        });
      },
      initVelocity: 6,
      angle: Math.PI * 0.1,
      bounce: false,
      bounceFactor: 0.8
    };

    this.gui = new dat.GUI();
    this.gui.add(config, 'gravity', 0, 1);
    this.gui.add(config, 'initVelocity', 1, 20);
    this.gui.add(config, 'angle', Math.PI * .05, Math.PI * .5);
    const bouncingGui = this.gui.addFolder('Bouncing');
    bouncingGui.add(config, 'bounce');
    bouncingGui.add(config, 'bounceFactor', 0, 1);

    for (let i = 0; i < 500; i++) {
      particles.push(Particle.create({
        x: width * 0.5,
        y: height,
        direction: randomDirection(),
        gravity: config.gravity,
        radius: 2 + Math.random() * 10,
        speed: randomSpeed()
      }));
    }

    update();
    function update() {
      context.clearRect(0, 0, width, height);

      for (let p of particles) {
        p.update();
        if (config.bounce) {
          bounceParticles();
        } else {
          collectDeadParticles();
        }
        // removeDeadParticles();
        p.draw(context);
      }

      self.requesttAnimationFrameId = requestAnimationFrame(update);
    }

    function bounceParticles() {
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        if (p.x - p.radius < 0) {
          p.x = p.radius;
          p.vx = - config.bounceFactor * p.vx;
          p.vy = config.bounceFactor * p.vy;
        }
        if (p.x + p.radius > width) {
          p.x = width - p.radius;
          p.vx = - config.bounceFactor * p.vx;
          p.vy = config.bounceFactor * p.vy;
        }
        if (p.y - p.radius < 0) {
          p.y = p.radius;
          p.vx = config.bounceFactor * p.vx;
          p.vy = - config.bounceFactor * p.vy;
        }
        if (p.y + p.radius > height) {
          p.y = height - p.radius;
          p.vx = config.bounceFactor * p.vx;
          p.vy = - config.bounceFactor * p.vy;
        }
      }
    }

    function collectDeadParticles() {
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        if (p.x + p.radius < 0
            || p.x - p.radius > width
            || p.y + p.radius < 0
            || p.y - p.radius > height) {
          p.x = width / 2;
          p.y = height;
          p.direction =  randomDirection();
          p.speed = randomSpeed();
        }
      }
    }

    function removeDeadParticles() {
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        if (p.x + p.radius < 0
            || p.x - p.radius > width
            || p.y + p.radius < 0
            || p.y - p.radius > height) {
          particles.splice(i, 1);
        }
      }
    }
  }

  private ref = (ref) => {
    this.canvas = ref;
  }

}
