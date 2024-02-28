import * as THREE from 'three';

export type Camera = {
  basis: THREE.Matrix4;
};

const rad = (deg: number): number => (deg * Math.PI) / 180;

export const Camera = {
  initialPosition: new THREE.Vector3(5, -10, 10),
  initialRotation: new THREE.Euler(rad(45), rad(0), rad(30), 'ZYX'),

  create(): Camera {
    const basis = new THREE.Matrix4();
    Camera.moveCamera({ basis }, Camera.initialPosition.x, Camera.initialPosition.y, Camera.initialPosition.z);
    Camera.rotateCamera({ basis }, Camera.initialRotation.x, Camera.initialRotation.y, Camera.initialRotation.z);

    return {
      basis,
    };
  },

  moveWorld(camera: Camera, x: number, y: number, z: number): void {
    const invMove = new THREE.Matrix4().makeTranslation(-x, -y, -z);
    camera.basis.premultiply(invMove);
  },

  rotateWorld(camera: Camera, x: number, y: number, z: number): void {
    const invRotate = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-x, -y, -z, 'XYZ'));
    camera.basis.premultiply(invRotate);
  },

  moveCamera(camera: Camera, x: number, y: number, z: number): void {
    const position = new THREE.Vector3(x, y, z).applyMatrix4(camera.basis);
    camera.basis.setPosition(position);
  },

  rotateCamera(camera: Camera, x: number, y: number, z: number): void {
    const position = new THREE.Vector3().setFromMatrixPosition(camera.basis);
    const rotate = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(x, y, z, 'ZYX'));
    camera.basis.premultiply(rotate);
    camera.basis.setPosition(position);
  },

  getPosition(camera: Camera): THREE.Vector3 {
    return new THREE.Vector3().setFromMatrixPosition(camera.basis);
  },

  getRotation(camera: Camera, order?: THREE.EulerOrder): THREE.Euler {
    const rotation = new THREE.Euler();
    rotation.setFromRotationMatrix(camera.basis, order);
    return rotation;
  },
};
