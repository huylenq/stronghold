import * as React from 'react';
import * as THREE from 'three';
import ThreeComponent from 'three/ThreeComponent';
import styled from 'styled-components';
import { OBJLoader } from 'three/extensions';

export default class Dentistry extends ThreeComponent {
  manager: THREE.LoadingManager;

  mouseX: number;
  mouseY: number;
  centerX: number;
  centerY: number;

  start() {
    const self = this;

    this.mouseX = 0;
    this.mouseY = 0;
    this.centerX = this.props.width / 2;
    this.centerY = this.props.height / 2;
    this.camera.position.z = 250;

    // Texture
    const manager = this.manager = new THREE.LoadingManager();
    manager.onProgress = (item, loaded, total) => {
      /* console.log(item, loaded, total);*/
    };
    const onProgress = (xhr) => {
      if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        /* console.log(Math.round(percentComplete) + '% downloaded');*/
      }
    };
    const onError = (xhr) => {
      /* console.error(xhr);*/
    };

    const loader = new THREE.ImageLoader(manager);

    const texture = new THREE.Texture();
    loader.load('three/UV_Grid_Sm.jpg', (image) => {
      texture.image = image;
      texture.needsUpdate = true;
    });

    // Model
    // It's tricky to get type-safe for this
    const objLoader = new OBJLoader(manager);

    function loadObj(resourcePath: string) {
      objLoader.load(
        resourcePath,
        (object) => {
          object.traverse(child => {
            if (child instanceof THREE.Mesh) {
              child.material['map'] = texture;
            }
          });
          const scale = 40;
          object.scale.x = scale;
          object.scale.y = scale;
          object.scale.z = scale;
          self.scene.add(object);
        },
        onProgress,
        onError);
    }
    loadObj('three/teeth/Model_Teeth.OBJ');
    loadObj('three/teeth/Model_Ancias.OBJ');
    loadObj('three/teeth/Model_Lengua.OBJ');

    window.addEventListener('resize', this.onWindowResize, false);
    /* document.addEventListener('mousemove', this.onDocumentMouseMove, false);*/
  }

  update() {
    /* this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05;*/
    /* this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * .05;*/
    /* this.camera.lookAt(this.scene.position);*/
  }

  /* onDocumentMouseMove = (event) => {*/
  /* this.mouseX = ( event.clientX - this.centerX) / 2;*/
  /* this.mouseY = ( event.clientY - this.centerY ) / 2;*/
  /* }*/

  onWindowResize = () => {
    this.centerX = this.props.width / 2,
    this.centerY = this.props.height / 2;
    this.camera.aspect = this.props.width / this.props.height;
    this.camera.updateProjectionMatrix();
    /* this.renderer.setSize( window.innerWidth, window.innerHeight );*/
  }

}
