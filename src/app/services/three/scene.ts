import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  createScene(): THREE.Scene {
    return new THREE.Scene();
  }

}