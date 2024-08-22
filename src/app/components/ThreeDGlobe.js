// components/ThreeDGlobe.js

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDGlobe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0077ff,
      wireframe: true,
      opacity: 0.5, // Adjusted opacity for a more subtle appearance
      transparent: true, // Ensure transparency is enabled
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    camera.position.z = 10;

    const animate = function () {
      requestAnimationFrame(animate);

      globe.rotation.x += 0.002; // Slower rotation speed
      globe.rotation.y += 0.002; // Slower rotation speed

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeDGlobe;
