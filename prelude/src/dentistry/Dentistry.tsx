import * as React from 'react';
import * as THREE from 'three';
import objLoaderExtension from 'three-obj-loader';
import styled from 'styled-components';

objLoaderExtension(THREE);
const unsafeObjLoaderCreator = (three: any): any => {
  return three['OBJLoader'];
};
const OBJLoader = unsafeObjLoaderCreator(THREE);

const CANVAS_ID = 'dentistry';

export default class Dentistry extends React.Component {
  container: HTMLElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  cube: THREE.Mesh;
  manager: THREE.LoadingManager;

  requestAnimationFrameId: number;

  mouseX: number;
  mouseY: number;
  centerX: number;
  centerY: number;

  componentDidMount() {
    this.setupObj();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.requestAnimationFrameId);
  }

  setupObj() {
    this.mouseX = 0;
    this.mouseY = 0;
    this.centerX = window.innerWidth / 2;
    this.centerY = window.innerHeight / 2;
    const camera = this.camera =
      new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 250;
    const scene = this.scene = new THREE.Scene();

    // Lighting
    const ambient = new THREE.AmbientLight(0x101030);
    scene.add(ambient);
    const directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

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
          scene.add(object);
        },
        onProgress,
        onError);
    }
    loadObj('three/teeth/Model_Teeth.OBJ');
    loadObj('three/teeth/Model_Ancias.OBJ');
    loadObj('three/teeth/Model_Lengua.OBJ');

    // Rendering
    const renderer = this.renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(renderer.domElement);

    window.addEventListener('resize', this.onWindowResize, false);
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);

    this.tAnimate();
  }

  onDocumentMouseMove = (event) => {
    this.mouseX = ( event.clientX - this.centerX) / 2;
    this.mouseY = ( event.clientY - this.centerY ) / 2;
  }

  onWindowResize = () => {
    this.centerX = window.innerWidth / 2,
    this.centerY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  tRender() {
    this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05;
    this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * .05;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

  tAnimate = () => {
    this.requestAnimationFrameId = requestAnimationFrame(this.tAnimate);
    this.tRender();
  }

  setupCube() {
    const scene = this.scene = new THREE.Scene();
    const camera = this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000);
    const renderer = this.renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = this.cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    this.animateCube();
  }

  animateCube = () => {
    requestAnimationFrame(this.animateCube);
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return <Container id="dentistry" innerRef={this.ref} />;
  }

  ref = (ref) => {
    this.container = ref;
  }

}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
