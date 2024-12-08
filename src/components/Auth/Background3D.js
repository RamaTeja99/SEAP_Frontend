import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const Background3D = () => {
    const mountRef = useRef(null);
    const basketballsRef = useRef([]);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        const ballModel = '/models/basketball.fbx';
        const loader = new FBXLoader();
        const numBalls = 5;

        const loadBalls = async () => {
            for (let i = 0; i < numBalls; i++) {
                try {
                    const basketball = await loader.loadAsync(ballModel);
                    basketball.scale.set(0.01, 0.01, 0.01);
                    basketball.position.set(
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10
                    );
                    basketball.userData = { originalScale: basketball.scale.clone() };
                    scene.add(basketball);
                    basketballsRef.current.push(basketball);
                } catch (error) {
                    console.error('Error loading model:', error);
                }
            }
        };

        loadBalls();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        camera.position.z = 5;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const animate = () => {
            requestAnimationFrame(animate);
            basketballsRef.current.forEach(basketball => {
                basketball.rotation.x += 0.005;
                basketball.rotation.y += 0.005;
                basketball.position.y += Math.sin(Date.now() * 0.001 + basketball.position.x) * 0.002;
            });
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        const handleMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(basketballsRef.current, true);

            basketballsRef.current.forEach(basketball => {
                if (intersects.find(intersect => intersect.object === basketball || basketball.children.includes(intersect.object))) {
                    basketball.scale.lerp(basketball.userData.originalScale.clone().multiplyScalar(1.2), 0.1);
                    const direction = new THREE.Vector3().subVectors(basketball.position, camera.position).normalize();
                    basketball.position.add(direction.multiplyScalar(0.1));
                } else {
                    basketball.scale.lerp(basketball.userData.originalScale, 0.1);
                }
            });
        };
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            basketballsRef.current.forEach(basketball => {
                scene.remove(basketball);
                basketball.geometry?.dispose();
                basketball.material?.dispose();
            });
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default Background3D;
