import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  createCamera(width: number, height: number): THREE.PerspectiveCamera {

    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );

    camera.position.set(0, 1.4, 2.3);
    camera.lookAt(0, 1, 0);

    return camera;
  }
}