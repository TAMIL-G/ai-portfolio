// import {
//   Component,
//   AfterViewInit,
//   OnDestroy,
//   ElementRef,
//   ViewChild
// } from '@angular/core';

// import * as THREE from 'three';
// import { GLTFLoader } from 'three-stdlib';

// @Component({
//   selector: 'app-avatar',
//   standalone: true,
//   imports: [],
//   templateUrl: './avatar.html',
//   styleUrl: './avatar.scss'
// })
// export class Avatar implements AfterViewInit, OnDestroy {

//   @ViewChild('canvasContainer', { static: true })
//   canvasContainer!: ElementRef<HTMLDivElement>;

//   private renderer!: THREE.WebGLRenderer;
//   private scene!: THREE.Scene;
//   private camera!: THREE.PerspectiveCamera;
//   private mixer?: THREE.AnimationMixer;
//   private clock = new THREE.Clock();
//   private frameId = 0;
//   private model?: THREE.Object3D;
//   private resizeObserver?: ResizeObserver;

//   // Lip sync (word-boundary driven, no external audio API needed)
//   private morphMesh?: THREE.Mesh & {
//     morphTargetDictionary: Record<string, number>;
//     morphTargetInfluences: number[];
//   };
//   private jawTarget = 0;
//   private jawCurrent = 0;
//   private isSpeaking = false;

//   ngAfterViewInit(): void {
//     this.createScene();
//   }

//   ngOnDestroy(): void {
//     cancelAnimationFrame(this.frameId);
//     this.resizeObserver?.disconnect();
//     this.renderer?.dispose();
//     speechSynthesis.cancel();
//   }

//   private createScene(): void {
//     const container = this.canvasContainer.nativeElement;

//     this.scene = new THREE.Scene();

//     this.camera = new THREE.PerspectiveCamera(
//       35,
//       container.clientWidth / container.clientHeight,
//       0.1,
//       1000
//     );

//     this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     this.renderer.setSize(container.clientWidth, container.clientHeight);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     // Fixes dark/muddy rendering — without these two lines colors
//     // read washed-out or crushed regardless of how many lights you add
//     this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     this.renderer.toneMappingExposure = 1.3;
//     this.renderer.outputColorSpace = THREE.SRGBColorSpace;

//     container.appendChild(this.renderer.domElement);

//     // --- Lighting rig ---
//     this.scene.add(new THREE.AmbientLight(0xffffff, 1.1)); // fills shadows, stops pure-black areas

//     this.scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x2a2040, 2.2));

//     const key = new THREE.DirectionalLight(0xffffff, 3.5);
//     key.position.set(2, 4, 5);
//     this.scene.add(key);

//     const fill = new THREE.DirectionalLight(0xffffff, 1.8); // softens far side of face
//     fill.position.set(-3, 2, 3);
//     this.scene.add(fill);

//     const rim = new THREE.DirectionalLight(0x8a63f2, 1.4);
//     rim.position.set(-3, 2, -4);
//     this.scene.add(rim);
//     // --- end lighting rig ---

//     const loader = new GLTFLoader();

//     loader.load(
//       '/assets/avatar/avatar.glb',
//       (gltf) => {
//         this.model = gltf.scene;
//         this.scene.add(this.model);

//         if (gltf.animations?.length) {
//           this.mixer = new THREE.AnimationMixer(this.model);
//           this.mixer.clipAction(gltf.animations[0]).play();
//         } else {
//           this.poseArmsDown(this.model);
//         }

//         this.findMorphMesh(this.model);
//         this.frameModel(container);
//       },
//       undefined,
//       (err) => console.error(err)
//     );

//     this.resizeObserver = new ResizeObserver(() => {
//       if (!container.clientWidth || !container.clientHeight) return;
//       this.camera.aspect = container.clientWidth / container.clientHeight;
//       this.camera.updateProjectionMatrix();
//       this.renderer.setSize(container.clientWidth, container.clientHeight);
//       if (this.model) this.frameModel(container);
//     });
//     this.resizeObserver.observe(container);

//     this.animate();
//   }

//   private frameModel(container: HTMLDivElement): void {
//     if (!this.model) return;

//     const box = new THREE.Box3().setFromObject(this.model);
//     const size = box.getSize(new THREE.Vector3());
//     const center = box.getCenter(new THREE.Vector3());

//     this.model.position.x -= center.x;
//     this.model.position.z -= center.z;
//     this.model.position.y -= box.min.y;

//     const height = size.y;
//     const fov = this.camera.fov * (Math.PI / 180);
//     const distance = (height / 2) / Math.tan(fov / 2) * 1.5;

//     this.camera.position.set(0, height * 0.55, distance);
//     this.camera.lookAt(0, height * 0.55, 0);
//   }

//   private poseArmsDown(root: THREE.Object3D): void {
//     root.traverse((child) => {
//       const bone = child as any;
//       if (!bone.isBone) return;

//       if (/^(mixamorig)?LeftArm$/i.test(bone.name)) {
//         bone.rotation.z = 1.2;
//       }
//       if (/^(mixamorig)?RightArm$/i.test(bone.name)) {
//         bone.rotation.z = -1.2;
//       }
//     });
//   }

//   private findMorphMesh(root: THREE.Object3D): void {
//     root.traverse((child) => {
//       const mesh = child as any;
//       if (mesh.morphTargetDictionary) {
//         this.morphMesh = mesh;
//         console.log('Morph targets found:', Object.keys(mesh.morphTargetDictionary));
//       }
//     });

//     if (!this.morphMesh) {
//       console.warn(
//         'No morph targets on this model — lip sync is not possible ' +
//         'until the avatar is re-exported with facial blend shapes.'
//       );
//     }
//   }

//   public speak(text: string): void {
//     if (!('speechSynthesis' in window)) {
//       console.warn('speechSynthesis not supported in this browser.');
//       return;
//     }

//     speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 1;
//     utterance.pitch = 1;

//     utterance.onstart = () => { this.isSpeaking = true; };
//     utterance.onend = () => { this.isSpeaking = false; this.jawTarget = 0; };
//     utterance.onerror = () => { this.isSpeaking = false; this.jawTarget = 0; };

//     utterance.onboundary = (event) => {
//       if (event.name !== 'word') return;
//       this.jawTarget = 0.35 + Math.random() * 0.35;
//       setTimeout(() => {
//         if (this.isSpeaking) this.jawTarget = 0.05;
//       }, 90);
//     };

//     speechSynthesis.speak(utterance);
//   }

//   private updateLipSync(delta: number): void {
//     if (!this.morphMesh) return;

//     this.jawCurrent += (this.jawTarget - this.jawCurrent) * Math.min(delta * 12, 1);

//     const idx = this.morphMesh.morphTargetDictionary['jawOpen'];
//     if (idx !== undefined) {
//       this.morphMesh.morphTargetInfluences[idx] = this.jawCurrent;
//     }
//   }

//   private animate = (): void => {
//     this.frameId = requestAnimationFrame(this.animate);

//     const delta = this.clock.getDelta();
//     this.mixer?.update(delta);

//     if (this.model && !this.mixer) {
//       this.model.rotation.y += delta * 0.15;
//     }

//     this.updateLipSync(delta);

//     this.renderer.render(this.scene, this.camera);
//   };
// }

import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';

import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss'
})
export class Avatar implements AfterViewInit, OnDestroy {

  @ViewChild('canvasContainer', { static: true })
  canvasContainer!: ElementRef<HTMLDivElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private mixer?: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private frameId = 0;
  private model?: THREE.Object3D;
  private resizeObserver?: ResizeObserver;

  // Lip sync (word-boundary driven, no external audio API needed)
  private morphMesh?: THREE.Mesh & {
    morphTargetDictionary: Record<string, number>;
    morphTargetInfluences: number[];
  };
  private jawTarget = 0;
  private jawCurrent = 0;
  private isSpeaking = false;

  ngAfterViewInit(): void {
    this.createScene();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();
    this.renderer?.dispose();
    speechSynthesis.cancel();
  }

  private createScene(): void {
    const container = this.canvasContainer.nativeElement;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(this.renderer.domElement);

    // --- Lighting rig ---
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    this.scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x2a2040, 2.2));

    const key = new THREE.DirectionalLight(0xffffff, 3.5);
    key.position.set(2, 4, 5);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 1.8);
    fill.position.set(-3, 2, 3);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0x8a63f2, 1.4);
    rim.position.set(-3, 2, -4);
    this.scene.add(rim);
    // --- end lighting rig ---

    const loader = new GLTFLoader();

    loader.load(
      '/assets/avatar/avatar.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);

        if (gltf.animations?.length) {
          this.mixer = new THREE.AnimationMixer(this.model);
          this.mixer.clipAction(gltf.animations[0]).play();
        } else {
          this.poseArmsDown(this.model);
        }

        this.findMorphMesh(this.model);
        this.frameModel(container);
      },
      undefined,
      (err) => console.error(err)
    );

    this.resizeObserver = new ResizeObserver(() => {
      if (!container.clientWidth || !container.clientHeight) return;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      if (this.model) this.frameModel(container);
    });
    this.resizeObserver.observe(container);

    this.animate();
  }

  private frameModel(container: HTMLDivElement): void {
    if (!this.model) return;

    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    this.model.position.x -= center.x;
    this.model.position.z -= center.z;
    this.model.position.y -= box.min.y;

    const height = size.y;
    const fov = this.camera.fov * (Math.PI / 180);
    const distance = (height / 2) / Math.tan(fov / 2) * 1.5;

    this.camera.position.set(0, height * 0.55, distance);
    this.camera.lookAt(0, height * 0.55, 0);
  }

  private poseArmsDown(root: THREE.Object3D): void {
    root.traverse((child) => {
      const bone = child as any;
      if (!bone.isBone) return;

      if (/^(mixamorig)?LeftArm$/i.test(bone.name)) {
        bone.rotation.z = 1.2;
      }
      if (/^(mixamorig)?RightArm$/i.test(bone.name)) {
        bone.rotation.z = -1.2;
      }
    });
  }

  private findMorphMesh(root: THREE.Object3D): void {
    root.traverse((child) => {
      const mesh = child as any;
      if (mesh.morphTargetDictionary) {
        this.morphMesh = mesh;
        console.log('Morph targets found:', Object.keys(mesh.morphTargetDictionary));
      }
    });

    if (!this.morphMesh) {
      console.warn(
        'No morph targets on this model — lip sync is not possible ' +
        'until the avatar is re-exported with facial blend shapes.'
      );
    }
  }

  /** Reads plain text aloud using the browser's built-in TTS — no AI,
   *  no external API. Reports word position via onWord so the UI can
   *  optionally react to speech progress. */
  public speak(
    text: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onWord?: (charIndex: number, charLength: number) => void;
    }
  ): void {
    if (!('speechSynthesis' in window)) {
      console.warn('speechSynthesis not supported in this browser.');
      return;
    }

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Explicitly pick a voice if one's available — some browsers
      // stay silent with no voice assigned even though it's "supported"
      const voices = speechSynthesis.getVoices();
      if (voices.length) {
        utterance.voice =
          voices.find(v => v.lang.startsWith('en')) ?? voices[0];
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        callbacks?.onStart?.();
      };
      utterance.onend = () => {
        this.isSpeaking = false;
        this.jawTarget = 0;
        callbacks?.onEnd?.();
      };
      utterance.onerror = (e) => {
        console.error('SpeechSynthesis error:', e.error); // NEW — this will finally tell us what's failing
        this.isSpeaking = false;
        this.jawTarget = 0;
        callbacks?.onEnd?.();
      };

      utterance.onboundary = (event) => {
        if (event.name !== 'word') return;
        this.jawTarget = 0.35 + Math.random() * 0.35;
        setTimeout(() => {
          if (this.isSpeaking) this.jawTarget = 0.05;
        }, 90);
        callbacks?.onWord?.(event.charIndex, event.charLength ?? 0);
      };

      speechSynthesis.speak(utterance);
    };

    speechSynthesis.cancel();
    // Small delay works around a known Chrome bug where speak()
    // called immediately after cancel() is silently dropped
    setTimeout(doSpeak, 50);
  }

  private updateLipSync(delta: number): void {
    if (!this.morphMesh) return;

    this.jawCurrent += (this.jawTarget - this.jawCurrent) * Math.min(delta * 12, 1);

    const idx = this.morphMesh.morphTargetDictionary['jawOpen'];
    if (idx !== undefined) {
      this.morphMesh.morphTargetInfluences[idx] = this.jawCurrent;
    }
  }

  private animate = (): void => {
    this.frameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    this.mixer?.update(delta);

    if (this.model && !this.mixer) {
      this.model.rotation.y += delta * 0.15;
    }

    this.updateLipSync(delta);

    this.renderer.render(this.scene, this.camera);
  };
}