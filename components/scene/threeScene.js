'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export default function ThreeJsScene({ onProgress, onLoaded }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        /*
        =========================================
        LOADING MANAGER
        Tracks every loader below (GLTF model,
        HDR environment, water normal texture) so
        the loading screen reflects true overall
        progress and only disappears once
        everything has actually loaded.
        =========================================
        */

        const manager = new THREE.LoadingManager();

        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const percent = Math.round(
                (itemsLoaded / itemsTotal) * 100
            );

            onProgress?.(percent);
        };

        manager.onLoad = () => {
            onProgress?.(100);
            onLoaded?.();
        };

        manager.onError = (url) => {
            console.error("Error loading:", url);
        };

        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.outputColorSpace = THREE.SRGBColorSpace;

        renderer.toneMapping =
            THREE.ACESFilmicToneMapping;

        renderer.toneMappingExposure = 1;

        let camera = null;
        let mixer = null;
        let action = null;
        let clipDuration = 0;
        let composer = null;

        /*
        =========================================
        GLTF
        =========================================
        */

        const loader = new GLTFLoader(manager);

        loader.load(
            "/assets/models/greece-wise-statue.glb",

            (gltf) => {
                scene.add(gltf.scene);

                camera = gltf.cameras[0];

                if (!camera) {
                    console.error(
                        "No camera found in GLB"
                    );

                    return;
                }

                camera.aspect =
                    window.innerWidth /
                    window.innerHeight;

                camera.updateProjectionMatrix();

                camera.setFocalLength(15);

                console.log(
                    "Animations:",
                    gltf.animations.map(
                        (animation) =>
                            animation.name
                    )
                );

                let clip =
                    THREE.AnimationClip.findByName(
                        gltf.animations,
                        "CameraAction"
                    );

                if (
                    !clip &&
                    gltf.animations.length
                ) {
                    clip = gltf.animations[0];

                    console.warn(
                        "CameraAction not found. Using:",
                        clip.name
                    );
                }

                /*
                =========================================
                CAMERA ANIMATION
                =========================================
                */

                if (clip) {
                    mixer =
                        new THREE.AnimationMixer(
                            camera
                        );

                    action =
                        mixer.clipAction(clip);

                    clipDuration =
                        clip.duration;

                    action.play();

                    action.paused = true;

                    console.log(
                        "Camera animation duration:",
                        clipDuration
                    );
                }

                /*
                =========================================
                POST PROCESSING
                =========================================
                */

                composer =
                    new EffectComposer(
                        renderer
                    );

                const renderPass =
                    new RenderPass(
                        scene,
                        camera
                    );

                composer.addPass(
                    renderPass
                );

                const resolution =
                    new THREE.Vector2(
                        window.innerWidth,
                        window.innerHeight
                    );

                const bloomPass =
                    new UnrealBloomPass(
                        resolution,
                        1,
                        0.01,
                        1.4
                    );

                composer.addPass(
                    bloomPass
                );

                const outputPass =
                    new OutputPass();

                composer.addPass(
                    outputPass
                );
            },

            (xhr) => {
                console.log(
                    "Loading:",
                    (
                        xhr.loaded /
                        xhr.total
                    ) *
                        100 +
                        "%"
                );
            },

            (error) => {
                console.error(
                    "GLB error:",
                    error
                );
            }
        );

        /*
        =========================================
        WATER
        =========================================
        */

        const waterGeometry =
            new THREE.PlaneGeometry(
                10000,
                10000
            );

        const water =
            new Water(
                waterGeometry,
                {
                    textureWidth: 512,
                    textureHeight: 512,

                    waterNormals:
                        new THREE.TextureLoader(manager).load(
                            "/assets/images/waternormals.jpg",
                            (texture) => {
                                texture.wrapS =
                                    THREE.RepeatWrapping;

                                texture.wrapT =
                                    THREE.RepeatWrapping;
                            }
                        ),

                    sunDirection:
                        new THREE.Vector3(),

                    sunColor: 0xffffff,

                    waterColor: 0x001e0f,

                    distortionScale: 3,
                }
            );

        water.rotation.x =
            -Math.PI / 2;

        scene.add(water);

        /*
        =========================================
        HDR
        =========================================
        */

        const rgbeLoader =
            new RGBELoader(manager);

        rgbeLoader.load(
            "/assets/hdris/hdr2.hdr",
            (texture) => {
                texture.mapping =
                    THREE.EquirectangularReflectionMapping;

                scene.background =
                    texture;

                scene.environment =
                    texture;
            }
        );

        /*
        =========================================
        SCROLL
        =========================================
        */

        let targetProgress = 0;
        let currentProgress = 0;

        function updateScroll() {
            const scrollTop =
                window.scrollY;

            const maxScroll =
                document.documentElement
                    .scrollHeight -
                window.innerHeight;

            if (maxScroll <= 0) {
                targetProgress = 0;
                return;
            }

            targetProgress =
                THREE.MathUtils.clamp(
                    scrollTop / maxScroll,
                    0,
                    1
                );
        }

        window.addEventListener(
            "scroll",
            updateScroll,
            { passive: true }
        );

        updateScroll();

        /*
        =========================================
        RESIZE
        =========================================
        */

        function onResize() {
            const width =
                window.innerWidth;

            const height =
                window.innerHeight;

            renderer.setSize(
                width,
                height
            );

            if (camera) {
                camera.aspect =
                    width / height;

                camera.updateProjectionMatrix();
            }

            if (composer) {
                composer.setSize(
                    width,
                    height
                );
            }

            updateScroll();
        }

        window.addEventListener(
            "resize",
            onResize
        );

        /*
        =========================================
        RENDER LOOP
        =========================================
        */

        let rafId;

        function animate() {
            rafId =
                requestAnimationFrame(
                    animate
                );

            /*
            Smooth camera animation
            */

            currentProgress =
                THREE.MathUtils.lerp(
                    currentProgress,
                    targetProgress,
                    0.08
                );

            if (
                action &&
                mixer &&
                clipDuration
            ) {
                action.time =
                    currentProgress *
                    clipDuration;

                mixer.update(0);
            }

            /*
            Water
            */

            water.material.uniforms.time.value +=
                0.02;

            /*
            Render
            */

            if (
                camera &&
                composer
            ) {
                composer.render();
            }
        }

        animate();

        /*
        =========================================
        CLEANUP
        =========================================
        */

        return () => {
            cancelAnimationFrame(
                rafId
            );

            window.removeEventListener(
                "scroll",
                updateScroll
            );

            window.removeEventListener(
                "resize",
                onResize
            );

            renderer.dispose();

            waterGeometry.dispose();

            water.material.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-screen h-screen -z-10"
        />
    );
}