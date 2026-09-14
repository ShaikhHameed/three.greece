'use client';
import { useEffect, useRef } from "react"
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Water } from 'three/addons/objects/Water.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';





export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 3000);


    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const loader = new GLTFLoader();

    // 4. Load your asset
    loader.load(
      '/assets/models/greece-wise-statue.glb',
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.position.set(0, -8, 0);
        console.log('Model loaded successfully!', gltf);
      },
      (xhr) => {
        // Progress callback (Optional)
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        // Error callback (Optional)
        console.error('An error occurred while loading the model:', error);
      }
    );


    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('/assets/images/waternormals.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.0,
    });
    water.rotation.x = - Math.PI / 2;
    scene.add(water);

    function AnimateWater() {
      const time = performance.now() * 0.001;
      water.material.uniforms['time'].value += 0.02;

    }

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/assets/hdris/hdr1.hdr', function (texture) {
      // Correctly project the 360 equirectangular texture
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
      console.log("HDRI loaded successfully!");
    });





    camera.position.z = 40;
    camera.position.y = 15;
    camera.position.x = -20;
    camera.aspect = (window.innerWidth / window.innerHeight);







    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      AnimateWater();
    }

    animate();

  }, []);

  return (
    <canvas id="canvas" ref={canvasRef}></canvas>
  )

}