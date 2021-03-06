import * as React from 'react';
import * as THREE from 'three';
import ThreeComponent, { IThreeComponentProps } from './ThreeComponent';
import Palette, { ThreePalette } from 'palette';
import * as Color from 'color';
import Vector from 'coding-math/Vector';

export interface ICubeProps extends IThreeComponentProps {
  autoRotate?: boolean;
  rotationSpeed?: number;
  angle?: 0;
}

export default class Cube extends ThreeComponent<ICubeProps> {
  static defaultProps: Partial<ICubeProps> = {
    ...ThreeComponent.defaultProps,
    autoRotate: false,
    rotationSpeed: 2,
  };

  cube: THREE.Mesh;

  onMouseMoveOnBody = (e) => {
    this.cube.rotation.x = e.clientY * 0.005;
    this.cube.rotation.y = e.clientX * 0.005;
  }

  componentDidMount() {
    super.componentDidMount();
    if (!this.props.autoRotate) {
      document.body.addEventListener('mousemove', this.onMouseMoveOnBody);
    }

  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (!this.props.autoRotate) {
      document.body.removeEventListener('mousemove', this.onMouseMoveOnBody);
    }
  }

  start() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 'white',
      transparent: true,
      opacity: 0.7
    });
    const cube = this.cube = new THREE.Mesh(geometry, material);
    this.camera.position.z = 4;
    this.scene.add(cube);
    this.cube.rotation.x = Math.PI / 4;
    this.cube.rotation.y = Math.PI / 4;
  }

  update(delta: number) {
    if (this.props.autoRotate) {
      const rotationSpeed: number = this.props.rotationSpeed as number;
      this.cube.rotation.x += rotationSpeed * delta;
      this.cube.rotation.y += rotationSpeed * delta;
    }
  }

}
