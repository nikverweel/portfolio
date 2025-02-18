// script.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Background Gradient
const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.ShaderMaterial({
    uniforms: {
        color1: { value: new THREE.Color("#253B4B") },
        color2: { value: new THREE.Color("#50626E") } 
    },
    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;

            // Diagonal gradient:
            float diagonalFactor = uv.x * uv.y; // Or uv.x + uv.y for a different diagonal

            vec3 color = mix(color1, color2, diagonalFactor);

            gl_FragColor = vec4(color, 1.0);
        }
    `
});

const plane = new THREE.Mesh(geometry, material);
plane.position.z = -500;
scene.add(plane);

const loader = new THREE.GLTFLoader();
loader.load('earth_model.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Centering the model in the page
    const box = new THREE.Box3().setFromObject(model); // Get the bbox
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.x = -center.x; 
    model.position.y = -center.y; 
    model.position.z = 0; 

    // Scale model
    model.scale.set(0.275, 0.275, 0.275); 

    // Set camera position
    camera.position.z = 1;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        model.rotation.y += 0.0005;
        renderer.render(scene, camera);
    };
    animate();
});

const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Color, Intensity
directionalLight.position.set(1, 1, 1).normalize(); // Set direction
scene.add(directionalLight);

camera.position.z = 3;  // Adjust camera position

// Function to resize the plane
function resizePlane() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Adjust plane to cover the view
    plane.geometry.dispose();
    plane.geometry = new THREE.PlaneGeometry(2 * camera.aspect, 2); // Matches camera's view
    plane.geometry.needsUpdate = true;
}

// Initial resize
resizePlane();

// Resize handling
window.addEventListener('resize', resizePlane);