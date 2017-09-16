import * as React from 'react';
import * as THREE from 'three';
import ThreeComponent, { IThreeComponentProps } from './ThreeComponent';
import Palette, { ThreePalette } from 'palette';
import * as Color from 'color';

export interface ICubeProps extends IThreeComponentProps {
  rotationSpeed?: number;
}

export default class Cube extends ThreeComponent<ICubeProps> {
  static defaultProps: Partial<ICubeProps> = {
    ...ThreeComponent.defaultProps,
    rotationSpeed: 2
  };

  cube: THREE.Mesh;

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
  }

  update(delta: number) {
    const rotationSpeed: number = this.props.rotationSpeed as number;
    this.cube.rotation.x += rotationSpeed * delta;
    this.cube.rotation.y += rotationSpeed * delta;
  }

}
