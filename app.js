// ---- UTIL ----
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  hamburger.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
  })
);

// ---- THREE.JS STARFIELD BG ----
const canvas = document.getElementById('bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 60;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

// Stars
const starCount = 1200;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 300;     // x
  positions[i + 1] = (Math.random() - 0.5) * 300; // y
  positions[i + 2] = (Math.random() - 0.5) * 300; // z
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ size: 0.7, transparent: true, opacity: 0.7 });
const stars = new THREE.Points(geometry, material);
scene.add(stars);

// Light parallax on mouse
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / innerWidth - 0.5) * 2;
  mouseY = (e.clientY / innerHeight - 0.5) * 2;
});

function animate() {
  stars.rotation.y += 0.0007;
  stars.rotation.x += 0.0002;

  // subtle parallax
  camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 3 - camera.position.y) * 0.02;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// handle resize
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---- GSAP ANIMATIONS ----
gsap.registerPlugin(ScrollTrigger);

// Intro timeline
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
tl.from(".site-header", { y: -40, opacity: 0, duration: 0.6 })
  .from(".hero .eyebrow", { y: 20, opacity: 0, duration: 0.4 }, "-=0.2")
  .from(".hero__title", { y: 20, opacity: 0, duration: 0.6 })
  .from(".hero__tagline", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
  .from(".cta .btn", { y: 10, opacity: 0, duration: 0.4, stagger: 0.1 }, "-=0.2")
  .from(".socials a", { y: 10, opacity: 0, duration: 0.3, stagger: 0.08 }, "-=0.3");

// Scroll reveals
gsap.utils.toArray('.reveal').forEach((elem) => {
  gsap.fromTo(elem, 
    { y: 50, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1, scrollTrigger: {
        trigger: elem,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );
});


// Section titles underline sweep
gsap.utils.toArray(".section__title").forEach((title) => {
  const underline = document.createElement("span");
  underline.className = "underline";
  title.appendChild(underline);
  gsap.fromTo(underline, { scaleX: 0 }, {
    scaleX: 1,
    transformOrigin: "0% 50%",
    duration: 0.8,
    scrollTrigger: { trigger: title, start: "top 80%" }
  });
});

// Skill bars animate width
gsap.utils.toArray(".skills li em").forEach((bar, i) => {
  const widths = [0.95, 0.9, 0.88, 0.92, 0.85]; // customize skill proficiency
  gsap.fromTo(bar, { scaleX: 0 }, {
    scaleX: widths[i] || 0.8,
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: { trigger: bar, start: "top 85%", toggleActions: "play none none reverse" }
  });
});

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Respect reduced motion
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  gsap.globalTimeline.timeScale(0.001);
}
