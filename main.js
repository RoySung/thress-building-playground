/**
 * Three.js 3D 街景遊樂場
 * 使用來自 threejsassets.com 的免費 Low-Poly 3D 模型
 *
 * 授權：threejsassets.com Free Tier — 可商用，無需署名
 * 來源：https://threejsassets.com/assets/free
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

/* ========================================================================
   Model manifest — every entry records the slug, display name,
   source URL on threejsassets.com, and the local file path.
   All assets are marked "Free" and licensed for commercial use
   without attribution (threejsassets.com Free Tier).
   ======================================================================== */

const MODEL_MANIFEST = [
  // ── Roads ─────────────────────────────────────────────────────────
  {
    slug: 'road-straight-01',
    name: 'Road Straight 01',
    category: 'Roads & Streets',
    url: 'https://threejsassets.com/assets/road-straight-01',
    file: '/models/road-straight-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  {
    slug: 'road-avenue-4way-01',
    name: 'Avenue 4-Way Intersection 01',
    category: 'Roads & Avenues',
    url: 'https://threejsassets.com/assets/road-avenue-4way-01',
    file: '/models/road-avenue-4way-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  {
    slug: 'road-corner-01',
    name: 'Road Corner 01',
    category: 'Roads & Streets',
    url: 'https://threejsassets.com/assets/road-corner-01',
    file: '/models/road-corner-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  {
    slug: 'road-avenue-tjunction-01',
    name: 'Avenue T-Junction 01',
    category: 'Roads & Avenues',
    url: 'https://threejsassets.com/assets/road-avenue-tjunction-01',
    file: '/models/road-avenue-tjunction-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  // ── Buildings ─────────────────────────────────────────────────────
  {
    slug: 'apartment-block-01',
    name: 'Apartment Block 01',
    category: 'Low & Mid-Rise',
    url: 'https://threejsassets.com/assets/apartment-block-01',
    file: '/models/apartment-block-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  {
    slug: 'corner-store-01',
    name: 'Corner Store 01',
    category: 'Low & Mid-Rise',
    url: 'https://threejsassets.com/assets/corner-store-01',
    file: '/models/corner-store-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  {
    slug: 'convenience-store-01',
    name: 'Convenience Store 01',
    category: 'Towers & Civic',
    url: 'https://threejsassets.com/assets/convenience-store-01',
    file: '/models/convenience-store-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  // ── Vehicles ──────────────────────────────────────────────────────
  {
    slug: 'car-sedan-01',
    name: 'Car Sedan 01',
    category: 'Vehicles',
    url: 'https://threejsassets.com/assets/car-sedan-01',
    file: '/models/car-sedan-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  {
    slug: 'taxi-01',
    name: 'Taxi 01',
    category: 'Vehicles',
    url: 'https://threejsassets.com/assets/taxi-01',
    file: '/models/taxi-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  {
    slug: 'delivery-van-01',
    name: 'Delivery Van 01',
    category: 'Vehicles',
    url: 'https://threejsassets.com/assets/delivery-van-01',
    file: '/models/delivery-van-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  // ── Nature ────────────────────────────────────────────────────────
  {
    slug: 'street-tree-01',
    name: 'Street Tree 01',
    category: 'Nature',
    url: 'https://threejsassets.com/assets/street-tree-01',
    file: '/models/street-tree-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  {
    slug: 'bush-round-01',
    name: 'Bush Round 01',
    category: 'Nature',
    url: 'https://threejsassets.com/assets/bush-round-01',
    file: '/models/bush-round-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  // ── Street Furniture ──────────────────────────────────────────────
  {
    slug: 'street-lamp-01',
    name: 'Street Lamp 01',
    category: 'Street Furniture',
    url: 'https://threejsassets.com/assets/street-lamp-01',
    file: '/models/street-lamp-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  {
    slug: 'bench-01',
    name: 'Bench 01',
    category: 'Street Furniture',
    url: 'https://threejsassets.com/assets/bench-01',
    file: '/models/bench-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  {
    slug: 'bus-shelter-01',
    name: 'Bus Shelter 01',
    category: 'Street Furniture',
    url: 'https://threejsassets.com/assets/bus-shelter-01',
    file: '/models/bus-shelter-01.glb',
    license: 'Free — commercial use, no attribution',
  },
  // ── Sky ───────────────────────────────────────────────────────────
  {
    slug: 'cloud-puff-01',
    name: 'Cloud Puff 01',
    category: 'Sky',
    url: 'https://threejsassets.com/assets/cloud-puff-01',
    file: '/models/cloud-puff-01.glb',
    license: 'Free — commercial use, no attribution',
  },
];

/* ========================================================================
   Globals & Lighting Presets
   ======================================================================== */

let scene, camera, renderer, controls;
let autoRotate = false;
const loadedModels = new Map();
const clock = new THREE.Clock();

// Animated objects
const movingCars = [];
const clouds = [];

// Lights & Weather state
let ambientLight, hemiLight, sunLight, fillLight, rimLight;
const streetLampLights = [];
let rainParticles = null;
let rainGeometry = null;

const LIGHTING_PRESETS = {
  day: {
    name: '白天',
    bgColor: new THREE.Color(0x87ceeb),
    fogColor: new THREE.Color(0xc8e6ff),
    fogDensity: 0.008,
    sunColor: new THREE.Color(0xfff8e7),
    sunIntensity: 1.8,
    sunPosition: new THREE.Vector3(25, 35, 30),
    ambientColor: new THREE.Color(0xfff5e6),
    ambientIntensity: 0.5,
    hemiSkyColor: new THREE.Color(0x87ceeb),
    hemiGroundColor: new THREE.Color(0x556b2f),
    hemiIntensity: 0.4,
    fillColor: new THREE.Color(0xb0d4f1),
    fillIntensity: 0.4,
    rimColor: new THREE.Color(0xffecd2),
    rimIntensity: 0.3,
    exposure: 1.2,
    lampIntensity: 0.0,
    cloudColor: new THREE.Color(0xffffff),
    rain: false,
  },
  rainy: {
    name: '雨天',
    bgColor: new THREE.Color(0x3a4856),
    fogColor: new THREE.Color(0x3a4856),
    fogDensity: 0.018,
    sunColor: new THREE.Color(0x8aa0b5),
    sunIntensity: 0.6,
    sunPosition: new THREE.Vector3(15, 40, 15),
    ambientColor: new THREE.Color(0x506275),
    ambientIntensity: 0.45,
    hemiSkyColor: new THREE.Color(0x4a5d6e),
    hemiGroundColor: new THREE.Color(0x232d37),
    hemiIntensity: 0.35,
    fillColor: new THREE.Color(0x64748b),
    fillIntensity: 0.3,
    rimColor: new THREE.Color(0x94a3b8),
    rimIntensity: 0.2,
    exposure: 0.9,
    lampIntensity: 1.4,
    cloudColor: new THREE.Color(0x52606d),
    rain: true,
  },
  sunset: {
    name: '黃昏',
    bgColor: new THREE.Color(0xe06d53),
    fogColor: new THREE.Color(0xee8e73),
    fogDensity: 0.009,
    sunColor: new THREE.Color(0xff7700),
    sunIntensity: 2.2,
    sunPosition: new THREE.Vector3(55, 10, 15),
    ambientColor: new THREE.Color(0xffd1b3),
    ambientIntensity: 0.55,
    hemiSkyColor: new THREE.Color(0xf97316),
    hemiGroundColor: new THREE.Color(0x7c2d12),
    hemiIntensity: 0.5,
    fillColor: new THREE.Color(0xc084fc),
    fillIntensity: 0.4,
    rimColor: new THREE.Color(0xfde047),
    rimIntensity: 0.6,
    exposure: 1.1,
    lampIntensity: 0.8,
    cloudColor: new THREE.Color(0xfcbba1),
    rain: false,
  },
  night: {
    name: '夜晚',
    bgColor: new THREE.Color(0x090d16),
    fogColor: new THREE.Color(0x0b1324),
    fogDensity: 0.012,
    sunColor: new THREE.Color(0x60a5fa),
    sunIntensity: 0.3,
    sunPosition: new THREE.Vector3(-20, 35, -25),
    ambientColor: new THREE.Color(0x1e293b),
    ambientIntensity: 0.2,
    hemiSkyColor: new THREE.Color(0x1e1b4b),
    hemiGroundColor: new THREE.Color(0x0f172a),
    hemiIntensity: 0.25,
    fillColor: new THREE.Color(0x3b82f6),
    fillIntensity: 0.2,
    rimColor: new THREE.Color(0x818cf8),
    rimIntensity: 0.2,
    exposure: 0.85,
    lampIntensity: 2.4,
    cloudColor: new THREE.Color(0x1e293b),
    rain: false,
  },
};

let currentPresetKey = 'day';
let targetPreset = LIGHTING_PRESETS.day;
let currentLampIntensity = 0.0;

/* ========================================================================
   Constants — Grid & Perimeter Road layout
   ======================================================================== */

let ROAD_SEG = 4;
let ROAD_SURFACE_Y = 0.16; // height of top of road asphalt surface
const SEGS_PER_ARM = 4;

/* ========================================================================
   Init
   ======================================================================== */

function init() {
  const canvas = document.getElementById('scene-canvas');
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.FogExp2(0xc8e6ff, 0.008);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.set(42, 32, 42);

  controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 1, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minDistance = 10;
  controls.maxDistance = 120;
  controls.autoRotate = false;
  controls.update();

  setupLights();
  createGround();
  createRain();
  loadAllModels();

  window.addEventListener('resize', onResize);
  setupUI();
  animate();
}

/* ========================================================================
   Lights & Presets
   ======================================================================== */

function setupLights() {
  ambientLight = new THREE.AmbientLight(0xfff5e6, 0.5);
  scene.add(ambientLight);

  hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x556b2f, 0.4);
  scene.add(hemiLight);

  sunLight = new THREE.DirectionalLight(0xfff8e7, 1.8);
  sunLight.position.set(25, 35, 30);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 140;
  sunLight.shadow.camera.left = -60;
  sunLight.shadow.camera.right = 60;
  sunLight.shadow.camera.top = 60;
  sunLight.shadow.camera.bottom = -60;
  sunLight.shadow.bias = -0.0005;
  sunLight.shadow.normalBias = 0.02;
  scene.add(sunLight);

  fillLight = new THREE.DirectionalLight(0xb0d4f1, 0.4);
  fillLight.position.set(-15, 10, -20);
  scene.add(fillLight);

  rimLight = new THREE.DirectionalLight(0xffecd2, 0.3);
  rimLight.position.set(-8, 15, 25);
  scene.add(rimLight);
}

function createRain() {
  const count = 2800;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = Math.random() * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
    velocities[i] = 30 + Math.random() * 20;
  }

  rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const rainMaterial = new THREE.PointsMaterial({
    color: 0xa5f3fc,
    size: 0.3,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });

  rainParticles = new THREE.Points(rainGeometry, rainMaterial);
  rainParticles.visible = false;
  rainParticles.userData = { velocities };
  scene.add(rainParticles);
}

function updateRain(dt) {
  if (!rainParticles || !rainParticles.visible) return;
  const positions = rainGeometry.attributes.position.array;
  const velocities = rainParticles.userData.velocities;
  const count = positions.length / 3;

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] -= velocities[i] * dt;
    positions[i * 3] += Math.sin(clock.getElapsedTime() * 3 + i) * 0.04;
    if (positions[i * 3 + 1] < 0) {
      positions[i * 3 + 1] = 55 + Math.random() * 5;
    }
  }
  rainGeometry.attributes.position.needsUpdate = true;
}

function attachStreetLampLight(lampObj) {
  const pointLight = new THREE.PointLight(0xffe082, 0, 16, 1.2);
  pointLight.position.set(0, 4.2, 0);

  const bulbGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const bulbMat = new THREE.MeshBasicMaterial({
    color: 0xfff3c4,
    transparent: true,
    opacity: 0,
  });
  const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
  bulbMesh.position.set(0, 4.2, 0);

  lampObj.add(pointLight);
  lampObj.add(bulbMesh);

  streetLampLights.push({ light: pointLight, bulb: bulbMesh });
}

function setLightingPreset(key) {
  if (!LIGHTING_PRESETS[key]) return;
  currentPresetKey = key;
  targetPreset = LIGHTING_PRESETS[key];

  if (rainParticles) {
    if (targetPreset.rain) {
      rainParticles.visible = true;
      rainParticles.material.opacity = 0.75;
    } else {
      rainParticles.visible = false;
    }
  }

  const icons = {
    day: '☀️',
    rainy: '🌧️',
    sunset: '🌅',
    night: '🌙',
  };

  showCameraToast(`${icons[key] || '🌆'} 切換氣氛：${targetPreset.name}模式`);
}

function updateLighting(dt) {
  if (!targetPreset) return;

  const speed = Math.min(dt * 3.5, 1.0);

  if (scene.background) {
    scene.background.lerp(targetPreset.bgColor, speed);
  }

  if (scene.fog) {
    scene.fog.color.lerp(targetPreset.fogColor, speed);
    scene.fog.density += (targetPreset.fogDensity - scene.fog.density) * speed;
  }

  if (sunLight) {
    sunLight.color.lerp(targetPreset.sunColor, speed);
    sunLight.intensity += (targetPreset.sunIntensity - sunLight.intensity) * speed;
    sunLight.position.lerp(targetPreset.sunPosition, speed);
  }

  if (ambientLight) {
    ambientLight.color.lerp(targetPreset.ambientColor, speed);
    ambientLight.intensity += (targetPreset.ambientIntensity - ambientLight.intensity) * speed;
  }

  if (hemiLight) {
    hemiLight.color.lerp(targetPreset.hemiSkyColor, speed);
    hemiLight.groundColor.lerp(targetPreset.hemiGroundColor, speed);
    hemiLight.intensity += (targetPreset.hemiIntensity - hemiLight.intensity) * speed;
  }

  if (fillLight) {
    fillLight.color.lerp(targetPreset.fillColor, speed);
    fillLight.intensity += (targetPreset.fillIntensity - fillLight.intensity) * speed;
  }

  if (rimLight) {
    rimLight.color.lerp(targetPreset.rimColor, speed);
    rimLight.intensity += (targetPreset.rimIntensity - rimLight.intensity) * speed;
  }

  if (renderer) {
    renderer.toneMappingExposure += (targetPreset.exposure - renderer.toneMappingExposure) * speed;
  }

  currentLampIntensity += (targetPreset.lampIntensity - currentLampIntensity) * speed;
  streetLampLights.forEach(({ light, bulb }) => {
    if (light) light.intensity = currentLampIntensity * 1.5;
    if (bulb) {
      bulb.material.opacity = Math.min(currentLampIntensity / 2.0, 1.0);
      bulb.visible = currentLampIntensity > 0.05;
    }
  });

  if (rainParticles && targetPreset.rain) {
    updateRain(dt);
  }

  clouds.forEach((c) => {
    c.mesh.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.lerp(targetPreset.cloudColor, speed);
      }
    });
  });
}

/* ========================================================================
   Ground plane
   ======================================================================== */

function createGround() {
  const groundGeo = new THREE.PlaneGeometry(300, 300);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x5c8a47,
    roughness: 0.9,
    metalness: 0.0,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);
}

/* ========================================================================
   Model loading & ground alignment
   ======================================================================== */

function loadAllModels() {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  loader.setDRACOLoader(dracoLoader);

  const total = MODEL_MANIFEST.length;
  let loaded = 0;

  const updateProgress = (name) => {
    loaded++;
    const pct = Math.round((loaded / total) * 100);
    document.getElementById('loading-status').textContent = `載入 ${name}…`;
    document.getElementById('progress-fill').style.width = `${pct}%`;
    document.getElementById('loading-percent').textContent = `${pct}%`;

    if (loaded === total) {
      setTimeout(() => {
        document.getElementById('loading-overlay').classList.add('fade-out');
        document.getElementById('ui-overlay').classList.add('visible');
      }, 400);
    }
  };

  MODEL_MANIFEST.forEach((entry) => {
    loader.load(
      entry.file,
      (gltf) => {
        const model = gltf.scene;
        model.name = entry.slug;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        model.userData.minY = box.min.y;
        model.userData.maxY = box.max.y;
        model.userData.height = box.max.y - box.min.y;

        loadedModels.set(entry.slug, model);
        updateProgress(entry.name);
        if (loadedModels.size === total) {
          arrangeScene();
        }
      },
      undefined,
      (err) => {
        console.warn(`Failed to load ${entry.slug}:`, err);
        updateProgress(entry.name);
        if (loaded === total) arrangeScene();
      }
    );
  });
}

/* ========================================================================
   Helper: clone & place a model (bottom rests at target Y)
   ======================================================================== */

function place(slug, position, rotation = 0, scale = 1) {
  const original = loadedModels.get(slug);
  if (!original) return null;

  const clone = original.clone();
  const minY = original.userData.minY !== undefined ? original.userData.minY : 0;
  const adjustedY = position.y - minY * scale;

  clone.position.set(position.x, adjustedY, position.z);
  clone.rotation.y = rotation;

  if (typeof scale === 'number') {
    clone.scale.setScalar(scale);
  }

  scene.add(clone);
  return clone;
}

/* ========================================================================
   Scene arrangement — 田字型中央十字 + 圍繞外圈道路 (Perimeter Ring Road)
   ======================================================================== */

function arrangeScene() {
  const roadModel = loadedModels.get('road-straight-01');
  if (roadModel) {
    const box = new THREE.Box3().setFromObject(roadModel);
    const size = new THREE.Vector3();
    box.getSize(size);
    ROAD_SEG = Math.max(size.x, size.z);
    if (ROAD_SEG < 1) ROAD_SEG = 4;

    // Top surface of road asphalt above ground plane
    ROAD_SURFACE_Y = 0.01 + (box.max.y - box.min.y);
  }

  const R = SEGS_PER_ARM * ROAD_SEG; // R = 16

  // ── 1. Center 4-way intersection ─────────────────────────────────
  place('road-avenue-4way-01', { x: 0, y: 0.01, z: 0 });

  // ── 2. Inner cross roads ─────────────────────────────────────────
  for (let i = 1; i < SEGS_PER_ARM; i++) {
    place('road-straight-01', { x: 0, y: 0.01, z: -i * ROAD_SEG });           // North arm
    place('road-straight-01', { x: 0, y: 0.01, z: i * ROAD_SEG });            // South arm
    place('road-straight-01', { x: i * ROAD_SEG, y: 0.01, z: 0 }, Math.PI / 2);  // East arm
    place('road-straight-01', { x: -i * ROAD_SEG, y: 0.01, z: 0 }, Math.PI / 2); // West arm
  }

  // ── 3. T-Junctions ───────────────────────────────────────────────
  place('road-avenue-tjunction-01', { x: 0, y: 0.01, z: -R }, 0);             // North T
  place('road-avenue-tjunction-01', { x: 0, y: 0.01, z: R }, Math.PI);        // South T
  place('road-avenue-tjunction-01', { x: R, y: 0.01, z: 0 }, -Math.PI / 2);   // East T
  place('road-avenue-tjunction-01', { x: -R, y: 0.01, z: 0 }, Math.PI / 2);   // West T

  // ── 4. Corner roads ───────────────────────────────────────────────
  place('road-corner-01', { x: -R, y: 0.01, z: -R }, Math.PI / 2);   // NW Corner
  place('road-corner-01', { x: R, y: 0.01, z: -R }, 0);              // NE Corner
  place('road-corner-01', { x: R, y: 0.01, z: R }, -Math.PI / 2);    // SE Corner
  place('road-corner-01', { x: -R, y: 0.01, z: R }, Math.PI);        // SW Corner

  // ── 5. Outer perimeter straight segments ─────────────────────────
  for (let i = 1; i < SEGS_PER_ARM; i++) {
    const offset = i * ROAD_SEG;
    place('road-straight-01', { x: -offset, y: 0.01, z: -R }, Math.PI / 2);
    place('road-straight-01', { x: offset, y: 0.01, z: -R }, Math.PI / 2);
    place('road-straight-01', { x: -offset, y: 0.01, z: R }, Math.PI / 2);
    place('road-straight-01', { x: offset, y: 0.01, z: R }, Math.PI / 2);
    place('road-straight-01', { x: -R, y: 0.01, z: -offset }, 0);
    place('road-straight-01', { x: -R, y: 0.01, z: offset }, 0);
    place('road-straight-01', { x: R, y: 0.01, z: -offset }, 0);
    place('road-straight-01', { x: R, y: 0.01, z: offset }, 0);
  }

  // ── Buildings in 4 city blocks
  layoutQuadrantBuildings();

  // ── Street trees & bushes ─────────────────────────────────────────
  layoutTrees();

  // ── Street furniture ──────────────────────────────────────────────
  layoutFurniture();

  // ── Animated vehicles ─────────────────────────────────────────────
  setupAnimatedCars();

  // ── Dynamic clouds ────────────────────────────────────────────────
  setupClouds();

  // ── Populate info panel ───────────────────────────────────────────
  populateInfoPanel();
}

/* ========================================================================
   Buildings in the 4 quadrants inside the perimeter ring
   ======================================================================== */

function layoutQuadrantBuildings() {
  // ── Q1 — Northeast (X > 0, Z < 0) ─────────────────────────────────
  place('apartment-block-01', { x: 7.5, y: 0, z: -7.0 }, Math.PI);
  place('corner-store-01', { x: 10.2, y: 0, z: -7.5 }, Math.PI * 0.5);
  place('convenience-store-01', { x: 7.5, y: 0, z: -10.5 }, 0);

  // ── Q2 — Northwest (X < 0, Z < 0) ─────────────────────────────────
  place('apartment-block-01', { x: -7.5, y: 0, z: -7.0 }, 0);
  place('corner-store-01', { x: -10.2, y: 0, z: -7.5 }, -Math.PI * 0.5);
  place('apartment-block-01', { x: -7.5, y: 0, z: -10.5 }, 0, 0.85);

  // ── Q3 — Southwest (X < 0, Z > 0) ─────────────────────────────────
  place('convenience-store-01', { x: -7.5, y: 0, z: 7.0 }, Math.PI);
  place('corner-store-01', { x: -10.2, y: 0, z: 7.5 }, -Math.PI * 0.5);
  place('apartment-block-01', { x: -7.5, y: 0, z: 10.5 }, Math.PI);

  // ── Q4 — Southeast (X > 0, Z > 0) ─────────────────────────────────
  place('apartment-block-01', { x: 7.5, y: 0, z: 7.0 }, Math.PI);
  place('convenience-store-01', { x: 10.2, y: 0, z: 7.5 }, Math.PI * 0.5);
  place('corner-store-01', { x: 7.5, y: 0, z: 10.5 }, 0);
}

/* ========================================================================
   Street trees & bushes
   ======================================================================== */

function layoutTrees() {
  const R = SEGS_PER_ARM * ROAD_SEG; // 16

  // Inner cross trees (avoiding bus shelter locations at x=3.2, z=-7.0 and x=-3.2, z=7.0)
  for (let z = -R + 4; z <= R - 4; z += 5) {
    if (Math.abs(z) < 4) continue;
    if (z === -7) {
      place('street-tree-01', { x: -3.8, y: 0, z }, Math.random() * Math.PI * 2, 0.65);
    } else if (z === 7) {
      place('street-tree-01', { x: 3.8, y: 0, z }, Math.random() * Math.PI * 2, 0.65);
    } else {
      place('street-tree-01', { x: -3.8, y: 0, z }, Math.random() * Math.PI * 2, 0.65);
      place('street-tree-01', { x: 3.8, y: 0, z }, Math.random() * Math.PI * 2, 0.65);
    }
  }
  for (let x = -R + 4; x <= R - 4; x += 5) {
    if (Math.abs(x) < 4) continue;
    place('street-tree-01', { x, y: 0, z: -3.8 }, Math.random() * Math.PI * 2, 0.65);
    place('street-tree-01', { x, y: 0, z: 3.8 }, Math.random() * Math.PI * 2, 0.65);
  }

  // Outer perimeter trees
  for (let x = -R + 2; x <= R - 2; x += 6) {
    place('street-tree-01', { x, y: 0, z: -R - 3.5 }, Math.random() * Math.PI * 2, 0.7);
    place('street-tree-01', { x, y: 0, z: R + 3.5 }, Math.random() * Math.PI * 2, 0.7);
  }
  for (let z = -R + 2; z <= R - 2; z += 6) {
    place('street-tree-01', { x: -R - 3.5, y: 0, z }, Math.random() * Math.PI * 2, 0.7);
    place('street-tree-01', { x: R + 3.5, y: 0, z }, Math.random() * Math.PI * 2, 0.7);
  }

  // Bushes safely inside block corners
  const bushPositions = [
    { x: 4.8, z: -4.8 }, { x: 10.5, z: -10.5 }, { x: 4.8, z: -10.5 },
    { x: -4.8, z: -4.8 }, { x: -10.5, z: -10.5 }, { x: -4.8, z: -10.5 },
    { x: -4.8, z: 4.8 }, { x: -10.5, z: 10.5 }, { x: -4.8, z: 10.5 },
    { x: 4.8, z: 4.8 }, { x: 10.5, z: 10.5 }, { x: 4.8, z: 10.5 },
  ];
  bushPositions.forEach((p) => {
    place('bush-round-01', { x: p.x, y: 0, z: p.z }, Math.random() * Math.PI * 2, 0.6 + Math.random() * 0.3);
  });
}

/* ========================================================================
   Street furniture
   ======================================================================== */

function layoutFurniture() {
  [-10, -5, 5, 10].forEach((pos) => {
    const p1 = place('street-lamp-01', { x: -3.2, y: 0, z: pos });
    const p2 = place('street-lamp-01', { x: 3.2, y: 0, z: pos });
    const p3 = place('street-lamp-01', { x: pos, y: 0, z: -3.2 });
    const p4 = place('street-lamp-01', { x: pos, y: 0, z: 3.2 });

    [p1, p2, p3, p4].forEach((lampObj) => {
      if (lampObj) attachStreetLampLight(lampObj);
    });
  });

  place('bench-01', { x: -3.4, y: 0, z: -6 }, Math.PI / 2);
  place('bench-01', { x: 3.4, y: 0, z: -6 }, -Math.PI / 2);
  place('bench-01', { x: -3.4, y: 0, z: 6 }, Math.PI / 2);
  place('bench-01', { x: 3.4, y: 0, z: 6 }, -Math.PI / 2);

  // Bus shelters properly positioned on sidewalks, oriented parallel to the avenue and facing the road
  place('bus-shelter-01', { x: -3.2, y: 0, z: 7.0 }, Math.PI / 2);
  place('bus-shelter-01', { x: 3.2, y: 0, z: -7.0 }, -Math.PI / 2);
}

/* ========================================================================
   Animated vehicles — Smooth rounded turn routes & elevated wheel base
   ======================================================================== */

function getLoopPosition(car, dist) {
  let d = dist % car.totalLength;
  if (d < 0) d += car.totalLength;

  let segIdx = 0;
  while (segIdx < car.segLengths.length - 1 && d > car.segLengths[segIdx]) {
    d -= car.segLengths[segIdx];
    segIdx++;
  }

  const segLen = car.segLengths[segIdx] || 1;
  const fraction = d / segLen;
  const from = car.route[segIdx];
  const to = car.route[segIdx + 1] || car.route[0];

  return {
    x: from.x + (to.x - from.x) * fraction,
    z: from.z + (to.z - from.z) * fraction,
  };
}

function addArc(points, cx, cz, radius, startAngle, endAngle, steps = 6) {
  for (let i = 1; i <= steps; i++) {
    const a = startAngle + (endAngle - startAngle) * (i / steps);
    points.push({
      x: Number((cx + radius * Math.cos(a)).toFixed(3)),
      z: Number((cz + radius * Math.sin(a)).toFixed(3)),
    });
  }
}

function addRightTurn(pts, X_in, Z_in, X_out, Z_out, dirIn, r = 0.75) {
  if (dirIn === 'N') { // North (-Z) -> East (+X)
    pts.push({ x: X_in, z: Z_out + r });
    addArc(pts, X_in + r, Z_out + r, r, Math.PI, Math.PI * 1.5);
  } else if (dirIn === 'E') { // East (+X) -> South (+Z)
    pts.push({ x: X_out - r, z: Z_in });
    addArc(pts, X_out - r, Z_in + r, r, -Math.PI / 2, 0);
  } else if (dirIn === 'S') { // South (+Z) -> West (-X)
    pts.push({ x: X_in, z: Z_out - r });
    addArc(pts, X_in - r, Z_out - r, r, 0, Math.PI / 2);
  } else if (dirIn === 'W') { // West (-X) -> North (-Z)
    pts.push({ x: X_out + r, z: Z_in });
    addArc(pts, X_out + r, Z_in - r, r, Math.PI / 2, Math.PI);
  }
}

function addLeftTurn(pts, X_in, Z_in, X_out, Z_out, dirIn, r = 2.25) {
  if (dirIn === 'N') { // North (-Z) -> West (-X)
    pts.push({ x: X_in, z: Z_out + r });
    addArc(pts, X_in - r, Z_out + r, r, 0, -Math.PI / 2);
  } else if (dirIn === 'W') { // West (-X) -> South (+Z)
    pts.push({ x: X_out + r, z: Z_in });
    addArc(pts, X_out + r, Z_in + r, r, -Math.PI / 2, -Math.PI);
  } else if (dirIn === 'S') { // South (+Z) -> East (+X)
    pts.push({ x: X_in, z: Z_out - r });
    addArc(pts, X_in + r, Z_out - r, r, Math.PI, Math.PI / 2);
  } else if (dirIn === 'E') { // East (+X) -> North (-Z)
    pts.push({ x: X_out - r, z: Z_in });
    addArc(pts, X_out - r, Z_in - r, r, Math.PI / 2, 0);
  }
}

function setupAnimatedCars() {
  const R = SEGS_PER_ARM * ROAD_SEG; // 16
  const L1 = 0.75; // inner lane center offset
  const L2 = 0.75; // outer lane center offset

  // Route 1: Outer Ring Clockwise (with smooth rounded right turn arcs at corners)
  const outerRingCW = [];
  addRightTurn(outerRingCW, R - L1, -R + L1, R - L1, R - L1, 'E');
  addRightTurn(outerRingCW, R - L1, R - L1, -R + L1, R - L1, 'S');
  addRightTurn(outerRingCW, -R + L1, R - L1, -R + L1, -R + L1, 'W');
  addRightTurn(outerRingCW, -R + L1, -R + L1, R - L1, -R + L1, 'N');

  // Route 2: Outer Ring Counter-Clockwise (with smooth rounded left turn arcs at corners)
  const outerRingCCW = [];
  addLeftTurn(outerRingCCW, -R - L2, -R - L2, -R - L2, R + L2, 'N');
  addLeftTurn(outerRingCCW, -R - L2, R + L2, R + L2, R + L2, 'W');
  addLeftTurn(outerRingCCW, R + L2, R + L2, R + L2, -R - L2, 'S');
  addLeftTurn(outerRingCCW, R + L2, -R - L2, -R - L2, -R - L2, 'E');

  // Route 3: Inner East Loop (Northeast quadrant loop)
  const innerEastLoop = [];
  addRightTurn(innerEastLoop, L1, -R + L1, R - L1, -R + L1, 'N');
  addRightTurn(innerEastLoop, R - L1, -R + L1, R - L1, L1, 'E');
  addRightTurn(innerEastLoop, R - L1, L1, L1, L1, 'S');
  addRightTurn(innerEastLoop, L1, L1, L1, -R + L1, 'W');

  // Route 4: Inner West Loop (Northwest quadrant loop)
  const innerWestLoop = [];
  addRightTurn(innerWestLoop, -L1, R - L1, -R + L1, R - L1, 'S');
  addRightTurn(innerWestLoop, -R + L1, R - L1, -R + L1, -R + L1, 'W');
  addRightTurn(innerWestLoop, -R + L1, -R + L1, -L1, -R + L1, 'N');
  addRightTurn(innerWestLoop, -L1, -R + L1, -L1, R - L1, 'E');

  // Route 5: Inner South Loop (Southwest quadrant loop)
  const innerSouthLoop = [];
  addRightTurn(innerSouthLoop, R - L1, L1, R - L1, R - L1, 'E');
  addRightTurn(innerSouthLoop, R - L1, R - L1, -R + L1, R - L1, 'S');
  addRightTurn(innerSouthLoop, -R + L1, R - L1, -R + L1, L1, 'W');
  addRightTurn(innerSouthLoop, -R + L1, L1, R - L1, L1, 'N');

  // Route 6: Inner North Loop (Northwest/Northeast top loop)
  const innerNorthLoop = [];
  addRightTurn(innerNorthLoop, -R + L1, -L1, -R + L1, -R + L1, 'W');
  addRightTurn(innerNorthLoop, -R + L1, -R + L1, R - L1, -R + L1, 'N');
  addRightTurn(innerNorthLoop, R - L1, -R + L1, R - L1, -L1, 'E');
  addRightTurn(innerNorthLoop, R - L1, -L1, -R + L1, -L1, 'S');

  const carConfigs = [
    { slug: 'car-sedan-01', route: outerRingCW, speed: 4.0, startT: 0.0 },
    { slug: 'taxi-01',      route: outerRingCW, speed: 4.0, startT: 0.5 },
    { slug: 'delivery-van-01', route: outerRingCCW, speed: 3.8, startT: 0.1 },
    { slug: 'car-sedan-01', route: outerRingCCW, speed: 3.8, startT: 0.6 },

    { slug: 'car-sedan-01', route: innerEastLoop, speed: 3.5, startT: 0.0 },
    { slug: 'taxi-01',      route: innerWestLoop, speed: 3.5, startT: 0.25 },
    { slug: 'delivery-van-01', route: innerSouthLoop, speed: 3.2, startT: 0.5 },
    { slug: 'taxi-01',      route: innerNorthLoop, speed: 3.2, startT: 0.75 },
  ];

  carConfigs.forEach(({ slug, route, speed, startT }) => {
    const original = loadedModels.get(slug);
    if (!original) return;

    const mesh = original.clone();
    const minY = original.userData.minY !== undefined ? original.userData.minY : 0;

    // Elevate vehicle base so car wheels sit proudly at +0.10 above the asphalt road surface
    const yOffset = ROAD_SURFACE_Y - minY + 0.10;

    scene.add(mesh);

    let totalLength = 0;
    const segLengths = [];
    for (let i = 0; i < route.length - 1; i++) {
      const dx = route[i + 1].x - route[i].x;
      const dz = route[i + 1].z - route[i].z;
      const len = Math.sqrt(dx * dx + dz * dz);
      segLengths.push(len);
      totalLength += len;
    }

    const car = {
      mesh,
      route,
      segLengths,
      totalLength,
      baseSpeed: speed,
      currentSpeed: speed,
      t: startT * totalLength,
      yOffset,
    };

    const currPos = getLoopPosition(car, car.t);
    const aheadPos = getLoopPosition(car, car.t + 0.6);
    mesh.position.set(currPos.x, yOffset, currPos.z);
    mesh.rotation.y = Math.atan2(aheadPos.x - currPos.x, aheadPos.z - currPos.z);

    movingCars.push(car);
  });
}

function updateCars(dt) {
  const SAFE_FORWARD = 4.5; // safe trailing distance ahead (units)
  const MIN_STOP = 2.4;    // distance to come to complete stop
  const MAX_LATERAL = 1.1; // max lateral offset to consider car in same lane

  movingCars.forEach((car, i) => {
    if (car.currentSpeed === undefined) {
      car.currentSpeed = car.baseSpeed;
    }

    // 1. Calculate target speed based on distance to vehicle ahead
    let targetSpeed = car.baseSpeed;

    const carX = car.mesh.position.x;
    const carZ = car.mesh.position.z;
    const rot = car.mesh.rotation.y;
    const fwdX = Math.sin(rot);
    const fwdZ = Math.cos(rot);

    movingCars.forEach((other, j) => {
      if (i === j) return;

      const dx = other.mesh.position.x - carX;
      const dz = other.mesh.position.z - carZ;
      const forwardDist = dx * fwdX + dz * fwdZ;

      if (forwardDist > 0.1 && forwardDist < SAFE_FORWARD) {
        const distSq = dx * dx + dz * dz;
        const lateralDist = Math.sqrt(Math.max(0, distSq - forwardDist * forwardDist));

        if (lateralDist < MAX_LATERAL) {
          if (forwardDist <= MIN_STOP) {
            targetSpeed = 0;
          } else {
            const speedFactor = (forwardDist - MIN_STOP) / (SAFE_FORWARD - MIN_STOP);
            targetSpeed = Math.min(targetSpeed, car.baseSpeed * speedFactor);
          }
        }
      }
    });

    // 2. Smoothly adjust current speed (adaptive cruise control)
    car.currentSpeed += (targetSpeed - car.currentSpeed) * Math.min(1, dt * 6.0);
    if (car.currentSpeed < 0.01) car.currentSpeed = 0;

    // 3. Move vehicle forward along its path
    car.t += car.currentSpeed * dt;
    if (car.t >= car.totalLength) car.t -= car.totalLength;
    if (car.t < 0) car.t += car.totalLength;

    const currPos = getLoopPosition(car, car.t);
    car.mesh.position.x = currPos.x;
    car.mesh.position.z = currPos.z;
    car.mesh.position.y = car.yOffset;

    const aheadPos = getLoopPosition(car, car.t + 0.6);
    const mDx = aheadPos.x - currPos.x;
    const mDz = aheadPos.z - currPos.z;
    if (Math.abs(mDx) > 0.001 || Math.abs(mDz) > 0.001) {
      const targetAngle = Math.atan2(mDx, mDz);
      let diff = targetAngle - car.mesh.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      car.mesh.rotation.y += diff * Math.min(1, dt * 8);
    }
  });
}

/* ========================================================================
   Dynamic clouds
   ======================================================================== */

function setupClouds() {
  const cloudModel = loadedModels.get('cloud-puff-01');
  if (!cloudModel) return;

  const cloudCount = 14;
  const spreadX = 25;
  const spreadZ = 20;

  for (let i = 0; i < cloudCount; i++) {
    const clone = cloudModel.clone();
    const scale = 1.8 + Math.random() * 2.5;
    clone.scale.setScalar(scale);

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material) {
          child.material = child.material.clone();
          child.material.transparent = true;
          child.material.opacity = 0.75 + Math.random() * 0.2;
        }
      }
    });

    const startX = -spreadX + Math.random() * spreadX * 2;
    const y = 13.5 + Math.random() * 5;
    const z = -spreadZ + Math.random() * spreadZ * 2;
    clone.position.set(startX, y, z);
    clone.rotation.y = Math.random() * Math.PI * 2;

    scene.add(clone);

    clouds.push({
      mesh: clone,
      speed: 0.5 + Math.random() * 1.2,
      boundX: spreadX + 20,
      y,
      z,
    });
  }
}

function updateClouds(dt) {
  clouds.forEach((c) => {
    c.mesh.position.x += c.speed * dt;
    c.mesh.position.y = c.y + Math.sin(clock.elapsedTime * 0.3 + c.z) * 0.3;
    if (c.mesh.position.x > c.boundX) {
      c.mesh.position.x = -c.boundX;
      c.mesh.position.z = c.z + (Math.random() - 0.5) * 10;
    }
  });
}

/* ========================================================================
   Dynamic Auto Camera Choreography System
   ======================================================================== */

const cameraState = {
  enabled: true,
  mode: 'cinematic',
  time: 0,
  isUserInteracting: false,
  userInteractionEndTime: 0,
  resumeDelay: 2.5,

  radius: 60,
  theta: Math.PI / 4,
  phi: 1.05,
  currentTargetPos: new THREE.Vector3(0, 1, 0),

  sequenceTimer: 0,
  sequenceIndex: 0,
  sequenceModes: ['cinematic', 'street', 'poi', 'panorama'],
  sequenceDuration: 14,

  poiTimer: 0,
  poiIndex: 0,
  poiList: [
    { name: '十字路口車流中心', target: new THREE.Vector3(0, 1, 0), dist: 42, phi: 1.05 },
    { name: '公寓社區與巷弄', target: new THREE.Vector3(18, 5, -18), dist: 35, phi: 1.12 },
    { name: '轉角便利店與計程車', target: new THREE.Vector3(-16, 3, 16), dist: 32, phi: 1.20 },
    { name: '綠樹公車亭與林蔭道', target: new THREE.Vector3(16, 2, 16), dist: 34, phi: 1.08 },
  ],

  toastTimer: null,
};

function showCameraToast(text) {
  const toast = document.getElementById('camera-toast');
  const toastText = document.getElementById('camera-toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = text;
  toast.classList.remove('hidden');

  if (cameraState.toastTimer) clearTimeout(cameraState.toastTimer);
  cameraState.toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

function syncCameraSphericalFromCurrent() {
  if (!camera || !controls) return;
  const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
  cameraState.radius = offset.length();
  cameraState.theta = Math.atan2(offset.x, offset.z);
  cameraState.phi = Math.acos(THREE.MathUtils.clamp(offset.y / Math.max(cameraState.radius, 0.1), -1, 1));
  cameraState.currentTargetPos.copy(controls.target);
}

function setupCameraControlsEvents() {
  if (!controls) return;
  controls.autoRotate = false;

  controls.addEventListener('start', () => {
    cameraState.isUserInteracting = true;
  });

  controls.addEventListener('end', () => {
    cameraState.isUserInteracting = false;
    cameraState.userInteractionEndTime = clock.getElapsedTime();
  });
}

function updateAutoCamera(dt) {
  if (!cameraState.enabled) return;

  const now = clock.getElapsedTime();
  if (cameraState.isUserInteracting || (now - cameraState.userInteractionEndTime < cameraState.resumeDelay)) {
    syncCameraSphericalFromCurrent();
    return;
  }

  cameraState.time += dt;
  const t = cameraState.time;

  let activeMode = cameraState.mode;
  if (cameraState.mode === 'auto_sequence') {
    cameraState.sequenceTimer += dt;
    if (cameraState.sequenceTimer >= cameraState.sequenceDuration) {
      cameraState.sequenceTimer = 0;
      cameraState.sequenceIndex = (cameraState.sequenceIndex + 1) % cameraState.sequenceModes.length;
      const nextMode = cameraState.sequenceModes[cameraState.sequenceIndex];
      const modeNames = {
        cinematic: '🎬 動態巡航',
        street: '🏎️ 街景俯仰',
        poi: '🎯 焦點巡航',
        panorama: '🏙️ 全景環繞',
      };
      showCameraToast(`🔄 自動切換：${modeNames[nextMode] || nextMode}`);
    }
    activeMode = cameraState.sequenceModes[cameraState.sequenceIndex];
  }

  let desiredRadius = 50;
  let desiredPhi = 1.0;
  let azimuthSpeed = 0.3;
  const desiredTarget = new THREE.Vector3(0, 1, 0);

  if (activeMode === 'cinematic') {
    azimuthSpeed = 0.28 + 0.12 * Math.sin(t * 0.3);
    cameraState.theta += azimuthSpeed * dt;

    desiredPhi = 0.85 + 0.26 * Math.sin(t * 0.42);
    desiredRadius = 48 + 13 * Math.sin(t * 0.22 + 1.0);

    desiredTarget.set(
      2.5 * Math.sin(t * 0.25),
      1.0 + 0.5 * Math.sin(t * 0.4),
      2.5 * Math.cos(t * 0.32)
    );
  } else if (activeMode === 'panorama') {
    azimuthSpeed = 0.32;
    cameraState.theta += azimuthSpeed * dt;

    desiredPhi = 0.65 + 0.08 * Math.sin(t * 0.2);
    desiredRadius = 60 + 5 * Math.sin(t * 0.15);
    desiredTarget.set(0, 1.2, 0);
  } else if (activeMode === 'street') {
    azimuthSpeed = 0.22 + 0.08 * Math.cos(t * 0.4);
    cameraState.theta += azimuthSpeed * dt;

    desiredPhi = 1.25 + 0.12 * Math.sin(t * 0.55);
    desiredRadius = 29 + 7 * Math.sin(t * 0.35);
    desiredTarget.set(
      3.0 * Math.cos(t * 0.28),
      2.4 + 0.6 * Math.sin(t * 0.5),
      3.0 * Math.sin(t * 0.28)
    );
  } else if (activeMode === 'poi') {
    cameraState.poiTimer += dt;
    if (cameraState.poiTimer > 7.0) {
      cameraState.poiTimer = 0;
      cameraState.poiIndex = (cameraState.poiIndex + 1) % cameraState.poiList.length;
      const currentPOI = cameraState.poiList[cameraState.poiIndex];
      showCameraToast(`🎯 焦點聚焦：${currentPOI.name}`);
    }

    const currentPOI = cameraState.poiList[cameraState.poiIndex];
    azimuthSpeed = 0.25;
    cameraState.theta += azimuthSpeed * dt;

    desiredPhi = currentPOI.phi + 0.06 * Math.sin(t * 0.35);
    desiredRadius = currentPOI.dist + 3 * Math.sin(t * 0.25);
    desiredTarget.copy(currentPOI.target);
  }

  const lerpSpeed = Math.min(dt * 2.5, 1.0);
  cameraState.radius += (desiredRadius - cameraState.radius) * lerpSpeed;
  cameraState.phi += (desiredPhi - cameraState.phi) * lerpSpeed;
  cameraState.currentTargetPos.lerp(desiredTarget, Math.min(dt * 2.0, 1.0));

  const sinPhi = Math.sin(cameraState.phi);
  const cosPhi = Math.cos(cameraState.phi);
  const sinTheta = Math.sin(cameraState.theta);
  const cosTheta = Math.cos(cameraState.theta);

  const posX = cameraState.currentTargetPos.x + cameraState.radius * sinPhi * sinTheta;
  const posY = cameraState.currentTargetPos.y + cameraState.radius * cosPhi;
  const posZ = cameraState.currentTargetPos.z + cameraState.radius * sinPhi * cosTheta;

  camera.position.set(posX, posY, posZ);
  controls.target.copy(cameraState.currentTargetPos);
}

/* ========================================================================
   UI setup
   ======================================================================== */

function setupUI() {
  const lightingBtns = document.querySelectorAll('.lighting-btn');
  lightingBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      if (!preset || !LIGHTING_PRESETS[preset]) return;

      lightingBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      setLightingPreset(preset);
    });
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    camera.position.set(42, 32, 42);
    controls.target.set(0, 1, 0);
    controls.update();
    syncCameraSphericalFromCurrent();
    showCameraToast('視角已重置');
  });

  const btnToggleRotate = document.getElementById('btn-toggle-rotate');
  const cameraModeSelect = document.getElementById('camera-mode-select');

  function updateAutoOrbitIcon() {
    if (!btnToggleRotate) return;
    if (cameraState.enabled) {
      btnToggleRotate.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="14" y="4" width="4" height="16" rx="1"/>
          <rect x="6" y="4" width="4" height="16" rx="1"/>
        </svg>
      `;
    } else {
      btnToggleRotate.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="6 3 20 12 6 21 6 3"/>
        </svg>
      `;
    }
  }

  btnToggleRotate.addEventListener('click', (e) => {
    cameraState.enabled = !cameraState.enabled;
    e.currentTarget.classList.toggle('active', cameraState.enabled);
    updateAutoOrbitIcon();
    if (cameraState.enabled) {
      syncCameraSphericalFromCurrent();
      showCameraToast('自動運鏡：已開啟');
    } else {
      showCameraToast('自動運鏡：已手動關閉');
    }
  });

  if (cameraModeSelect) {
    cameraModeSelect.addEventListener('change', (e) => {
      const mode = e.target.value;
      cameraState.mode = mode;
      cameraState.poiTimer = 0;
      cameraState.sequenceTimer = 0;

      const labels = {
        cinematic: '🎬 運鏡：動態巡航',
        panorama: '🏙️ 運鏡：全景環繞',
        street: '🏎️ 運鏡：街景俯仰',
        poi: '🎯 運鏡：焦點巡航',
        auto_sequence: '🔄 運鏡：自動切換模式',
      };
      showCameraToast(labels[mode] || mode);

      if (!cameraState.enabled) {
        cameraState.enabled = true;
        btnToggleRotate.classList.add('active');
        updateAutoOrbitIcon();
      }
      syncCameraSphericalFromCurrent();
    });
  }

  setupCameraControlsEvents();
  syncCameraSphericalFromCurrent();

  document.getElementById('btn-info').addEventListener('click', () => {
    document.getElementById('info-panel').classList.toggle('hidden');
  });

  document.getElementById('btn-close-info').addEventListener('click', () => {
    document.getElementById('info-panel').classList.add('hidden');
  });
}

/* ========================================================================
   Info panel
   ======================================================================== */

function populateInfoPanel() {
  const list = document.getElementById('model-list');
  list.innerHTML = '';

  MODEL_MANIFEST.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'model-item';
    item.innerHTML = `
      <div>
        <span class="model-name">${entry.name}</span>
        <span class="model-meta"> · ${entry.category}</span>
      </div>
      <a href="${entry.url}" target="_blank" rel="noopener">來源 ↗</a>
    `;
    list.appendChild(item);
  });
}

/* ========================================================================
   Resize handler
   ======================================================================== */

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* ========================================================================
   Animation loop
   ======================================================================== */

function animate() {
  requestAnimationFrame(animate);

  const dt = clock.getDelta();
  updateCars(dt);
  updateClouds(dt);
  updateAutoCamera(dt);
  updateLighting(dt);

  controls.update();
  renderer.render(scene, camera);
}

/* ========================================================================
   Start
   ======================================================================== */

init();
