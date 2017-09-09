import * as React from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { EditorControls } from 'three/extensions';

export interface IThreeComponentProps {
  width: number;
  height: number;
  z?: number;
  controls?: boolean;
}

export default abstract class ThreeComponent
<T extends IThreeComponentProps = IThreeComponentProps>
extends React.Component<T, {}> {
  static defaultProps: Partial<IThreeComponentProps> = {
    width: 200,
    height: 200,
    controls: false,
  };

  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  _requestAnimationFrameId: number;
  _ref: HTMLElement;

  start() {}  // tslint:disable-line
  update(delta: number) {}  // tslint:disable-line

  componentDidMount() {
    const camera = this.camera =
      new THREE.PerspectiveCamera(
        45,
        (this as ThreeComponent).props.width / (this as ThreeComponent).props.height,
        1,
        2000);
    const scene = this.scene = new THREE.Scene();
    // Lighting
    const ambient = new THREE.AmbientLight(0x101030);
    scene.add(ambient);
    const directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    const renderer = this.renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);

    const bound = this._ref.getBoundingClientRect();
    renderer.setSize(this.props.width, this.props.height);

    this._ref.appendChild(renderer.domElement);

    this.start();
    if (this.props.z !== null && typeof this.props.z !== 'undefined') {
      camera.position.z = this.props.z as number;
    }

    if (this.props.controls) {
      const controls = new EditorControls(camera);
    }

    let previous;
    const callUpdate: FrameRequestCallback = (now) => {
      this.update((now - previous) / 1000);
      previous = now;
      this._requestAnimationFrameId = requestAnimationFrame(callUpdate);
      renderer.render(scene, camera);
    };
    callUpdate(previous = performance.now());

  }

  componentWillUnmount() {
    cancelAnimationFrame(this._requestAnimationFrameId);
  }

  render() {
    return (
      <Container
        width={this.props.width}
        height={this.props.height}
        innerRef={this.ref}
      />
    );

  }

  ref = (ref) => {
    this._ref = ref;
  }

}

const Container = styled.div`
  width: ${(props: IThreeComponentProps) => props.width};
  height: ${(props: IThreeComponentProps) => props.height};
`;
