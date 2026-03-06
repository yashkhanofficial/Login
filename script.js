// ১. থ্রিডি সিনের প্রাথমিক সেটআপ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// ২. অ্যাডভান্সড থ্রিডি অবজেক্ট (পার্টিকেল সিস্টেম)
// এটি দেখতে অনেকটা মহাকাশের ডাটা ক্লাউডের মতো হবে
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000; // ৫০০০টি ছোট ছোট কণা

const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100; // কণাগুলো ছড়িয়ে থাকবে
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// কণাগুলোর লুক ও কালার
const material = new THREE.PointsMaterial({
    size: 0.005,
    color: '#00ff88',
    transparent: true,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

// ৩. মাউস ইন্টারঅ্যাকশন (মাউস নড়ালে থ্রিডি অবজেক্ট ঘুরবে)
document.addEventListener('mousemove', animateParticles);

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
    mouseY = event.clientY;
    mouseX = event.clientX;
}

// ৪. ফর্ম পাল্টানোর ফাংশন (Login <-> Signup)
function toggleForm(type) {
    const landing = document.getElementById('landing');
    const formBox = document.getElementById('form-box');
    const loginFields = document.getElementById('login-fields');
    const signupFields = document.getElementById('signup-fields');

    // GSAP অ্যানিমেশন দিয়ে স্মুথ ট্রানজিশন
    gsap.to(window, { duration: 1, scrollTo: 0 }); // পেজ টপে রাখা

    if (type === 'login') {
        landing.classList.add('hidden');
        formBox.classList.remove('hidden');
        loginFields.classList.remove('hidden');
        signupFields.classList.add('hidden');
        
        // ক্যামেরা জুম ইন অ্যানিমেশন
        gsap.to(camera.position, { z: 15, duration: 2, ease: "power2.inOut" });
    } else if (type === 'signup') {
        loginFields.classList.add('hidden');
        signupFields.classList.remove('hidden');
    }
}

// ৫. লুপ অ্যানিমেশন (সবকিছুকে জীবন্ত রাখা)
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // কণাগুলোকে ক্রমাগত ঘোরানো
    particlesMesh.rotation.y = elapsedTime * 0.1;
    
    // মাউস অনুযায়ী হালকা মুভমেন্ট
    if (mouseX > 0) {
        particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
        particlesMesh.rotation.y = mouseX * (elapsedTime * 0.00008);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// ৬. উইন্ডো রিসাইজ হ্যান্ডেলার
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
