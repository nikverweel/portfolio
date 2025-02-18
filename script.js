// script.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Background Gradient
const geometry = new THREE.PlaneGeometry(1000, 1000);
const material = new THREE.ShaderMaterial({
    uniforms: {
        color1: { value: new THREE.Color("darkblue") },
        color2: { value: new THREE.Color("black") }
    },
    vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;

        void main() {
            vec2 vUv = uv;
            vec3 color = mix(color1, color2, vUv.y); // Vertical gradient
            gl_FragColor = vec4(color, 1.0);
        }
    `
});
const plane = new THREE.Mesh(geometry, material);
plane.position.z = -500; // Position behind the model
scene.add(plane);

const loader = new THREE.GLTFLoader();
loader.load('earth_model.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Optional: Scale and position the model as needed
    model.scale.set(0.5, 0.5, 0.5); // Example scaling
    model.position.y = -0.5; // Example positioning

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Example rotation (adjust as needed)
        model.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    animate();
});

camera.position.z = 3;  // Adjust camera position

// Resize handling
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});