import * as THREE from 'three';
import EditorControlsExtension from 'three-editor-controls';
import OBJLoaderExtension from 'three-obj-loader';

OBJLoaderExtension(THREE);
const extractOBJLoader = (three: any): any => {
  return three['OBJLoader'];
};
export const OBJLoader = extractOBJLoader(THREE);

EditorControlsExtension(THREE);
const extractEditorControls = (three: any): any => {
  return three.EditorControls;
};
export const EditorControls = extractEditorControls(THREE);
