import * as React from 'react';
import { default as gdat } from 'dat.gui/build/dat.gui.js';
import Stats from 'vendor/Stats';
import palette from 'palette';

function defined(value: any) {
  return value !== null && typeof value !== 'undefined';
}

interface IDatOptions {
  min?: number;
  max?: number;
  step?: number;
}

export function dat(options: IDatOptions = {}) {
  if ((options.max !== null && typeof options.max !== 'undefined')
      && (options.min === null && typeof options.min !== 'undefined')) {
    throw new Error('`min` is required if `max` is defined.');
  }
  return (target: Object, key: string) => {
    target['__datFields'] = target['__datFields'] || [];
    target['__datFields'].push({ key, ...options });
  };
}

export interface ICanvasComponentProps {
  width: number;
  height: number;
  dat?: boolean;
  stats?: boolean;
}

export default
abstract class CanvasComponent<T extends ICanvasComponentProps = ICanvasComponentProps>
extends React.Component<T, {}> {

  public width: number;
  public height: number;

  public ref: HTMLCanvasElement;
  private dat: any;
  private stats: any;

  private _requestAnimationFrameId: number;

  abstract draw(context: CanvasRenderingContext2D, delta: number);

  componentDidMount() {
    const canvas = this.ref;
    const context = canvas.getContext('2d')!;

    canvas.width = this.props.width as number * window.devicePixelRatio;
    canvas.height = this.props.height as number * window.devicePixelRatio;
    this.width = this.props.width;
    this.height = this.props.height;
    canvas.style.width = this.props.width + 'px';
    canvas.style.height = this.props.height + 'px';
    context.scale(window.devicePixelRatio, window.devicePixelRatio);

    if (this.props.stats) {
      this.stats = Stats();
      this.stats.showPanel(0);
      document.body.appendChild(this.stats.dom);
    }

    let previous;

    context.strokeStyle = palette.u_white;
    const callDraw: FrameRequestCallback = (now) => {
      if (this.stats) { this.stats.begin(); }
      context.clearRect(0, 0, this.props.width, this.props.height);
      context.save();
      this.draw(context, (now - previous) / 1000);
      context.restore();
      previous = now;
      this._requestAnimationFrameId = requestAnimationFrame(callDraw);
      if (this.stats) { this.stats.end(); }
    };
    // leap to next 'cycle' to avoid null access in subclasses
    window.setTimeout(() => callDraw(previous = performance.now()), 0);

    if (this['onMouseMove']) {
      this.ref.addEventListener('mousemove', this.forwardMouseMove);
    }
    if (this['onMouseDown']) {
      this.ref.addEventListener('mousedown', this.forwardMouseDown);
    }
    if (this['onMouseUp']) {
      this.ref.addEventListener('mouseup', this.forwardMouseUp);
    }

    if (this.props.dat && this['__datFields']) {
      this.dat = new gdat.GUI();
      for (let datField of this['__datFields']) {
        const args = [this, datField.key];

        // Integer slide works with this, or it will have floating values
        if (datField.min) { args.push(datField.min); }
        if (datField.max) { args.push(datField.max); }

        const config = this.dat.add.apply(this.dat, args);

        // Without this floating slider won't work
        if (defined(datField.min)) { config.min(datField.min); }
        if (defined(datField.max)) { config.max(datField.max); }

        if (defined(datField.step)) { config.step(datField.step); }
      }
    }
  }

  componentWillUnmount() {
    if (this.dat) { this.dat.destroy(); }
    if (this.stats) {
      document.body.removeChild(this.stats.dom);
      delete this.stats;
    }
    cancelAnimationFrame(this._requestAnimationFrameId);
  }

  render() {
    return <canvas style={{userSelect: 'none'}} ref={this.captureRef} />;
  }

  captureRef = (ref) => {
    this.ref = ref;
  }

  private forwardMouseMove = (event: MouseEvent) => {
    const bounding = this.ref.getBoundingClientRect();
    if (this['onMouseMove']) {
      this['onMouseMove']({
        x: bounding.left + event.clientX,
        y: bounding.top + event.clientY
      });
    }
  }

  private forwardMouseDown = (event: MouseEvent) => {
    const bounding = this.ref.getBoundingClientRect();
    if (this['onMouseDown']) {
      this['onMouseDown']({
        x: bounding.left + event.clientX,
        y: bounding.top + event.clientY
      });
    }
  }

  private forwardMouseUp = (event: MouseEvent) => {
    const bounding = this.ref.getBoundingClientRect();
    if (this['onMouseUp']) {
      this['onMouseUp']({
        x: bounding.left + event.clientX,
        y: bounding.top + event.clientY
      });
    }
  }

}
