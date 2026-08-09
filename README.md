# 🏙️ Three.js 3D City Street Scene Playground

[**🌐 Live Demo**](https://roysung.github.io/thress-building-playground/)

An interactive low-poly 3D city street scene playground built with **Three.js** and **Vite**. This application features real-time lighting and weather presets, multiple dynamic camera cruise modes, animated vehicle traffic, and detailed low-poly urban architecture.

![Three.js City Scene](public/favicon.svg)

---

## ✨ Features

- **☀️ Real-Time Lighting & Weather Presets**
  - ☀️ **Day Mode**: Bright sunlight with blue skies and procedural clouds.
  - 🌧️ **Rainy Mode**: Overcast sky, dynamic rain particle system, and wet ground reflection effects.
  - 🌅 **Sunset Mode**: Warm golden hour tones with soft shadows.
  - 🌙 **Night Mode**: Deep blue night atmosphere with glowing street lamps and headlights.

- **🎬 5 Dynamic Camera Cruise Modes**
  - 🎬 **Cinematic**: Smooth elevated cruise orbiting the city center.
  - 🏙️ **Panorama**: High-altitude 360° overview of the entire scene.
  - 🏎️ **Street Level**: Low-angle street level perspective traversing the road network.
  - 🎯 **POI (Points of Interest)**: Focused close-ups of specific buildings and street features.
  - 🔄 **Auto Sequence**: Automatic timed cycling across multiple camera perspectives.

- **🚗 Dynamic City Environment**
  - Moving traffic including sedans, taxis, and delivery vans.
  - Wind-animated trees, bushes, and drifting clouds.
  - Full user interaction: Left-click rotate, Right-click pan, Scroll zoom.

- **📦 16 Integrated Free 3D Models**
  - Asset models curated from [threejsassets.com](https://threejsassets.com/assets/free), free for commercial use without mandatory attribution.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn` / `pnpm`

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/RoySung/thress-building-playground.git
   cd thress-building-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local development server**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

4. **Build for production**
   ```bash
   npm run build
   ```
   Output files will be generated in the `dist/` directory.

---

## 🛠️ Tech Stack

- **3D Engine**: [Three.js](https://threejs.org/) (GLTFLoader, DRACOLoader, OrbitControls)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: JavaScript (ES Modules)
- **Styling**: Modern Vanilla CSS with Glassmorphism UI
- **CI/CD & Hosting**: GitHub Actions + GitHub Pages

---

## 📂 Project Structure

```
thress-building-playground/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   ├── models/                 # GLB 3D model assets
│   └── favicon.svg             # Site favicon
├── main.js                     # 3D scene initialization, presets & camera logic
├── index.html                  # HTML structure & UI Overlay
├── style.css                   # Glassmorphism & UI styles
├── vite.config.js              # Vite configuration (relative base path)
├── package.json
└── MODEL_CREDITS.md            # Model asset credits & licenses
```

---

## 📄 License & Credits

- Code is licensed under the MIT License.
- 3D models are sourced from [threejsassets.com/assets/free](https://threejsassets.com/assets/free). See [MODEL_CREDITS.md](MODEL_CREDITS.md) for individual model details.
