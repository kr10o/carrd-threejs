/* ==========================================================================
 * kr10o/carrd-threejs - script.js
 * Served via: https://cdn.jsdelivr.net/gh/kr10o/carrd-threejs@main/script.js
 * Architecture:
 *   - Hero Background Mode (Zero GUI, Zero Pointer/Hover Interaction)
 *   - Locked 100vw x 100vh with Mathematical Squircle Main View Mask
 *   - Close 3D Architectural Stage (Back Wall, Angled Side Walls, Floor)
 *   - 2 Shadow-Casting Beam SpotLights with Volumetric Cones & Random Drift
 *   - Dark-Mode Manga Halftone Dot Matrix Post-Processing Shader (45° & 15°)
 *   - Headless Print Proof Shortcuts: Shift+P (4K PNG) / Shift+S (Vector SVG)
 * ========================================================================== */
(function () {
  'use strict';

  /* ==========================================================================
   * 1. DYNAMIC CDN LOADER PROTOCOL
   * ========================================================================== */
  function loadCdnScript(url) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.head.appendChild(script);
    });
  }

  const CDN_ASSETS = {
    THREE_CATALOG_JS: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.186.1/three.tsl.js',
    THREE_UMD_FALLBACK_JS: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    FONT_LOADER_ADDON: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FontLoader.js',
    TEXT_GEOMETRY_ADDON: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/geometries/TextGeometry.js',
    HELVETIKER_BOLD_FONT: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json'
  };

  /* Optional URL Query Parameters (Carrd Hash-Router Safe) */
  function getSceneConfig() {
    const params = new URLSearchParams(window.location.search);
    const rawScale = parseFloat(params.get('scale'));
    const rawText = params.get('text');
    return {
      scale: !isNaN(rawScale) ? Math.min(Math.max(rawScale, 36), 140) : 82,
      text: rawText && rawText.trim().length > 0 ? rawText.trim().slice(0, 12).toUpperCase() : 'FASHION'
    };
  }

  /* ==========================================================================
   * 2. PASS 2 SHADER: DARK-MODE MANGA SCREENTONE HALFTONE + SQUIRCLE MASK
   * ========================================================================== */
  const HALFTONE_VERTEX_SHADER = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const HALFTONE_FRAGMENT_SHADER = `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uGridScale;
    uniform vec3 uDarkVoidColor;
    uniform vec3 uDarkShadowColor;
    uniform vec3 uInkLightColor;
    uniform float uTime;

    varying vec2 vUv;

    mat2 rotate2d(float angleRad) {
      float c = cos(angleRad);
      float s = sin(angleRad);
      return mat2(c, -s, s, c);
    }

    /* Evaluates a rotated manga screentone cell for a given tone intensity [0..1] */
    float mangaHalftoneDot(vec2 fragCoord, float angleRad, float intensity, float cellFreq) {
      if (intensity <= 0.002) return 0.0;

      float minDim = min(uResolution.x, uResolution.y);
      vec2 normCoord = (fragCoord - 0.5 * uResolution) / minDim;

      vec2 rotated = rotate2d(angleRad) * normCoord * cellFreq;
      vec2 cellUv = fract(rotated) - 0.5;
      float dist = length(cellUv);

      /* Radius proportional to sqrt(intensity) for true tonal area response */
      float radius = sqrt(clamp(intensity, 0.0, 1.0)) * 0.72;
      float aa = 1.35 * (cellFreq / minDim);
      return 1.0 - smoothstep(radius - aa, radius + aa, dist);
    }

    float getLuminance(vec3 rgb) {
      return dot(rgb, vec3(0.299, 0.587, 0.114));
    }

    /* Superellipse Squircle Signed Distance Mask */
    float squircleMask(vec2 uv, vec2 res, float radiusPx) {
      vec2 halfRes = res * 0.5;
      vec2 p = abs(uv * res - halfRes);
      vec2 q = max(p - (halfRes - radiusPx), 0.0) / max(radiusPx, 1.0);
      /* L4 Superellipse norm: (q.x^4 + q.y^4)^(1/4) */
      float dist = pow(pow(q.x, 4.0) + pow(q.y, 4.0), 0.25);
      float aa = 1.5 / max(radiusPx, 1.0);
      return 1.0 - smoothstep(1.0 - aa, 1.0 + aa, dist);
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float lum = getLuminance(texel.rgb);

      /* 4-Tap Sobel Edge Detection for Crisp Manga Ink Linework on Text & Shadow Edges */
      vec2 stepUv = 1.35 / uResolution;
      float lL = getLuminance(texture2D(tDiffuse, vUv - vec2(stepUv.x, 0.0)).rgb);
      float lR = getLuminance(texture2D(tDiffuse, vUv + vec2(stepUv.x, 0.0)).rgb);
      float lD = getLuminance(texture2D(tDiffuse, vUv - vec2(0.0, stepUv.y)).rgb);
      float lU = getLuminance(texture2D(tDiffuse, vUv + vec2(0.0, stepUv.y)).rgb);

      float edgeGrad = length(vec2(lR - lL, lU - lD));
      float inkOutline = smoothstep(0.09, 0.28, edgeGrad * 2.4);

      /* Shape luminance curve to accentuate the 2 beam cones and cast wall/floor shadows */
      float shapedLum = smoothstep(0.02, 0.92, pow(lum, 1.12));

      vec2 fragCoord = vUv * uResolution;

      /* Primary 45-degree Manga Screentone Lattice (Key tone) */
      float primaryDots = mangaHalftoneDot(fragCoord, 0.785398, shapedLum, uGridScale);

      /* Secondary 15-degree High-Intensity Cross-Screen in Bright Beam Cores */
      float highlightTone = smoothstep(0.48, 0.98, shapedLum);
      float secondaryDots = mangaHalftoneDot(fragCoord, 0.261799, highlightTone * 0.75, uGridScale * 1.35);

      /* Subtle 75-degree Ambient Shadow Texture in Deep Wall/Floor Penumbras */
      float penumbraTone = smoothstep(0.01, 0.32, shapedLum) * (1.0 - smoothstep(0.32, 0.65, shapedLum));
      float shadowDots = mangaHalftoneDot(fragCoord, 1.308996, penumbraTone * 0.35, uGridScale * 0.5);

      /* Tactile Manga Paper/Ink Micro-Grain */
      float grain = fract(sin(dot(floor(fragCoord * 0.5), vec2(12.9898, 78.233))) * 43758.5453);
      vec3 baseDark = mix(uDarkVoidColor, uDarkShadowColor, smoothstep(0.0, 0.45, shapedLum));
      baseDark += (grain - 0.5) * 0.016;

      /* Composite Screentone Dots + Specular Beam Cores + Ink Contours */
      float combinedDotMask = clamp(primaryDots * 0.88 + secondaryDots * 0.42 + shadowDots * 0.2, 0.0, 1.0);
      vec3 halftoneComposite = mix(baseDark, uInkLightColor, combinedDotMask);

      /* Carve dark manga ink outlines along 3D letter bevels and sharp shadow boundaries */
      halftoneComposite = mix(halftoneComposite, uDarkVoidColor * 0.65, inkOutline * 0.85);

      /* Soft radial vignette + Superellipse Squircle Corner Mask */
      float vignette = 1.0 - smoothstep(0.42, 0.95, length(vUv - 0.5));
      halftoneComposite *= (0.78 + 0.22 * vignette);

      float cornerRadiusPx = clamp(min(uResolution.x, uResolution.y) * 0.045, 28.0, 64.0);
      float sqMask = squircleMask(vUv, uResolution, cornerRadiusPx);
      vec3 finalColor = mix(uDarkVoidColor, halftoneComposite, sqMask);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  /* ==========================================================================
   * 3. MAIN SCENE INITIALIZATION
   * ========================================================================== */
  async function initApp() {
    const rootEl = document.getElementById('carrd-app-root');
    const stageEl = document.getElementById('halftone-canvas-stage');
    if (!rootEl || !stageEl) return;

    try {
      try {
        await loadCdnScript(CDN_ASSETS.THREE_CATALOG_JS);
      } catch (_) {}

      if (!window.THREE || !window.THREE.WebGLRenderer) {
        await loadCdnScript(CDN_ASSETS.THREE_UMD_FALLBACK_JS);
      }

      const THREE = window.THREE;
      if (!THREE.FontLoader) {
        await loadCdnScript(CDN_ASSETS.FONT_LOADER_ADDON);
      }
      if (!THREE.TextGeometry) {
        await loadCdnScript(CDN_ASSETS.TEXT_GEOMETRY_ADDON);
      }

      const config = getSceneConfig();

      const rect = stageEl.getBoundingClientRect();
      const initW = Math.max(rect.width, 320);
      const initH = Math.max(rect.height, 320);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(initW, initH);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      stageEl.appendChild(renderer.domElement);

      /* Offscreen RenderTarget for Pass 1 (Lit 3D Room + Cast Shadows) */
      const renderTarget = new THREE.WebGLRenderTarget(
        Math.floor(initW * dpr),
        Math.floor(initH * dpr),
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          stencilBuffer: false
        }
      );

      /* ======================================================================
       * 4. PASS 1: 3D ARCHITECTURAL STAGE (CLOSE WALLS, FLOOR & 3D TEXT)
       * ====================================================================== */
      const scene3D = new THREE.Scene();
      scene3D.background = new THREE.Color(0x060709);
      scene3D.fog = new THREE.FogExp2(0x060709, 0.042);

      const camera3D = new THREE.PerspectiveCamera(38, initW / initH, 0.5, 45);
      camera3D.position.set(0, 0.35, 11.2);
      camera3D.lookAt(0, -0.15, -0.5);

      /* Low ambient fill so unlit shadow areas stay deep charcoal/black */
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.07);
      scene3D.add(ambientLight);

      /* Matte architectural surface material for close walls and floor */
      const roomMaterial = new THREE.MeshStandardMaterial({
        color: 0xd8dee9,
        roughness: 0.82,
        metalness: 0.08
      });

      /* 1. Close Back Wall (z = -1.35, immediately behind the extruded 3D text) */
      const backWall = new THREE.Mesh(new THREE.PlaneGeometry(36, 22), roomMaterial);
      backWall.position.set(0, 3.0, -1.35);
      backWall.receiveShadow = true;
      scene3D.add(backWall);

      /* 2. Close Floor Plane (y = -1.55, directly beneath the text to catch long beam shadows) */
      const floorPlane = new THREE.Mesh(new THREE.PlaneGeometry(36, 24), roomMaterial);
      floorPlane.rotation.x = -Math.PI * 0.5;
      floorPlane.position.set(0, -1.55, 4.5);
      floorPlane.receiveShadow = true;
      scene3D.add(floorPlane);

      /* 3. Angled Left & Right Architectural Side Walls */
      const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 22), roomMaterial);
      leftWall.position.set(-7.8, 3.0, 2.8);
      leftWall.rotation.y = Math.PI * 0.32;
      leftWall.receiveShadow = true;
      scene3D.add(leftWall);

      const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 22), roomMaterial);
      rightWall.position.set(7.8, 3.0, 2.8);
      rightWall.rotation.y = -Math.PI * 0.32;
      rightWall.receiveShadow = true;
      scene3D.add(rightWall);

      /* ======================================================================
       * 5. TWO SHADOW-CASTING BEAM LIGHT SOURCES FROM DIFFERENT ANGLES
       * ====================================================================== */
      function createBeamSpotLight(intensity, angleRad, penumbra) {
        const spot = new THREE.SpotLight(0xffffff, intensity);
        spot.angle = angleRad;
        spot.penumbra = penumbra;
        spot.decay = 1.25;
        spot.distance = 28;
        spot.castShadow = true;
        spot.shadow.mapSize.width = 2048;
        spot.shadow.mapSize.height = 2048;
        spot.shadow.camera.near = 1.5;
        spot.shadow.camera.far = 24.0;
        spot.shadow.bias = -0.00035;
        return spot;
      }

      /* Beam Source 1: High Upper-Left Oblique Beam throwing shadows down-right */
      const beamLight1 = createBeamSpotLight(2.45, Math.PI / 4.6, 0.32);
      beamLight1.position.set(-5.8, 4.8, 6.4);
      beamLight1.target.position.set(0.9, -0.45, -1.2);
      scene3D.add(beamLight1);
      scene3D.add(beamLight1.target);

      /* Beam Source 2: Lower-Right Cross Beam throwing shadows up-left onto back wall */
      const beamLight2 = createBeamSpotLight(2.15, Math.PI / 5.0, 0.36);
      beamLight2.position.set(6.2, 2.1, 5.8);
      beamLight2.target.position.set(-0.9, 0.15, -1.2);
      scene3D.add(beamLight2);
      scene3D.add(beamLight2.target);

      /* Subtle Volumetric Light-Cone Haze Meshes so beams register mid-air halftone dots */
      function createVolumetricBeamCone(radius, height, opacity) {
        const geo = new THREE.ConeGeometry(radius, height, 32, 1, true);
        geo.translate(0, -height * 0.5, 0);
        geo.rotateX(-Math.PI * 0.5);
        const mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: opacity,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        return new THREE.Mesh(geo, mat);
      }

      const beamCone1 = createVolumetricBeamCone(4.2, 12.5, 0.045);
      const beamCone2 = createVolumetricBeamCone(3.8, 12.0, 0.038);
      scene3D.add(beamCone1);
      scene3D.add(beamCone2);

      /* ======================================================================
       * 6. EXTRUDED 3D TEXT GEOMETRY (CLOSE TO WALLS & FLOOR)
       * ====================================================================== */
      const font = await new Promise((resolve, reject) => {
        const loader = new THREE.FontLoader();
        loader.load(CDN_ASSETS.HELVETIKER_BOLD_FONT, resolve, undefined, reject);
      });

      const textGeo = new THREE.TextGeometry(config.text, {
        font: font,
        size: 1.48,
        height: 0.68,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.14,
        bevelSize: 0.08,
        bevelOffset: 0.0,
        bevelSegments: 6
      });
      textGeo.center();
      textGeo.computeVertexNormals();

      const textFaceMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.32,
        metalness: 0.12
      });

      const textExtrudeMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.48,
        metalness: 0.22
      });

      const textGroup = new THREE.Group();
      /* Positioned close to the back wall (z = -0.15 vs wall at -1.35) and floor (y = -0.15 vs floor at -1.55) */
      textGroup.position.set(0, -0.15, -0.15);
      scene3D.add(textGroup);

      const textMesh = new THREE.Mesh(textGeo, [textFaceMat, textExtrudeMat]);
      textMesh.castShadow = true;
      textMesh.receiveShadow = true;
      textGroup.add(textMesh);

      /* ======================================================================
       * 7. PASS 2: FULLSCREEN MANGA HALFTONE QUAD
       * ====================================================================== */
      const postScene = new THREE.Scene();
      const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const postUniforms = {
        tDiffuse: { value: renderTarget.texture },
        uResolution: { value: new THREE.Vector2(initW * dpr, initH * dpr) },
        uGridScale: { value: config.scale },
        uDarkVoidColor: { value: new THREE.Vector3(0.043, 0.047, 0.063) },   // #0b0c10
        uDarkShadowColor: { value: new THREE.Vector3(0.086, 0.094, 0.125) }, // #161820
        uInkLightColor: { value: new THREE.Vector3(0.91, 0.92, 0.95) },      // Crisp Manga White-Silver Dots
        uTime: { value: 0.0 }
      };

      const postMaterial = new THREE.ShaderMaterial({
        vertexShader: HALFTONE_VERTEX_SHADER,
        fragmentShader: HALFTONE_FRAGMENT_SHADER,
        uniforms: postUniforms,
        depthWrite: false,
        depthTest: false
      });

      const fullScreenQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
      postScene.add(fullScreenQuad);

      function fitCameraToViewport(width, height) {
        const aspect = width / Math.max(height, 1);
        camera3D.aspect = aspect;
        camera3D.updateProjectionMatrix();

        const targetSpan = 10.4;
        const vFovRad = (camera3D.fov * Math.PI) / 180;
        const requiredZ = (targetSpan / aspect) / (2 * Math.tan(vFovRad / 2));
        camera3D.position.z = Math.max(9.2, Math.min(requiredZ, 20.5));
        camera3D.lookAt(0, -0.15, -0.5);
      }

      fitCameraToViewport(initW, initH);

      /* ======================================================================
       * 8. HEADLESS PRINT PROOF EXPORTERS (Shift+P = 4K PNG, Shift+S = SVG)
       * ====================================================================== */
      function triggerBlobDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      }

      async function export4kPngProof() {
        const bounds = stageEl.getBoundingClientRect();
        const liveW = Math.max(bounds.width, 320);
        const liveH = Math.max(bounds.height, 320);
        const liveDpr = renderer.getPixelRatio();
        const aspect = liveW / liveH;

        const gl = renderer.getContext();
        const maxRbSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 4096;
        const targetW = Math.min(3840, maxRbSize);
        const targetH = Math.min(Math.round(targetW / aspect), maxRbSize);

        const hiResTarget = new THREE.WebGLRenderTarget(targetW, targetH, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          stencilBuffer: false
        });

        try {
          renderer.setPixelRatio(1);
          renderer.setSize(targetW, targetH, false);

          renderer.setRenderTarget(hiResTarget);
          renderer.clear();
          renderer.render(scene3D, camera3D);

          postUniforms.tDiffuse.value = hiResTarget.texture;
          postUniforms.uResolution.value.set(targetW, targetH);

          renderer.setRenderTarget(null);
          renderer.render(postScene, postCamera);

          const blob = await new Promise((resolve) =>
            renderer.domElement.toBlob(resolve, 'image/png')
          );
          if (blob) {
            const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
            triggerBlobDownload(blob, `manga-halftone-hero-4k-${stamp}.png`);
          }
        } finally {
          hiResTarget.dispose();
          postUniforms.tDiffuse.value = renderTarget.texture;
          renderer.setPixelRatio(liveDpr);
          renderer.setSize(liveW, liveH);
          postUniforms.uResolution.value.set(liveW * liveDpr, liveH * liveDpr);
        }
      }

      async function exportVectorSvgProof() {
        const rtW = renderTarget.width;
        const rtH = renderTarget.height;
        const pixelBuffer = new Uint8Array(rtW * rtH * 4);

        renderer.setRenderTarget(renderTarget);
        renderer.clear();
        renderer.render(scene3D, camera3D);
        renderer.readRenderTargetPixels(renderTarget, 0, 0, rtW, rtH, pixelBuffer);
        renderer.setRenderTarget(null);

        const aspect = rtW / Math.max(rtH, 1);
        const svgW = 1920;
        const svgH = Math.round(svgW / aspect);
        const minDimSvg = Math.min(svgW, svgH);
        const cellFreq = config.scale;
        const cellSizeSvg = minDimSvg / cellFreq;
        const angleRad = 0.7853981634; // 45 deg Manga Screentone
        const cosA = Math.cos(angleRad);
        const sinA = Math.sin(angleRad);
        const maxSpan = Math.ceil(Math.hypot(svgW, svgH) / cellSizeSvg * 0.55) + 2;
        const circles = [];

        for (let gx = -maxSpan; gx <= maxSpan; gx++) {
          for (let gy = -maxSpan; gy <= maxSpan; gy++) {
            const rx = (gx + 0.5) / cellFreq;
            const ry = (gy + 0.5) / cellFreq;
            const nx = cosA * rx + sinA * ry;
            const ny = -sinA * rx + cosA * ry;

            const svgX = nx * minDimSvg + svgW * 0.5;
            const svgY = ny * minDimSvg + svgH * 0.5;
            if (svgX < 0 || svgX > svgW || svgY < 0 || svgY > svgH) continue;

            const u = svgX / svgW;
            const v = 1.0 - (svgY / svgH);
            const px = Math.min(Math.max(Math.floor(u * (rtW - 1)), 0), rtW - 1);
            const py = Math.min(Math.max(Math.floor(v * (rtH - 1)), 0), rtH - 1);
            const idx = (py * rtW + px) * 4;

            const r = pixelBuffer[idx] / 255;
            const g = pixelBuffer[idx + 1] / 255;
            const b = pixelBuffer[idx + 2] / 255;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const shaped = Math.pow(Math.min(Math.max(lum, 0.0), 1.0), 1.12);
            if (shaped <= 0.015) continue;

            const radius = Math.sqrt(shaped) * 0.70 * cellSizeSvg;
            if (radius < 0.25) continue;
            circles.push(`<circle cx="${svgX.toFixed(2)}" cy="${svgY.toFixed(2)}" r="${radius.toFixed(2)}"/>`);
          }
        }

        const svgMarkup = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">`,
          `  <rect width="100%" height="100%" fill="#0b0c10"/>`,
          `  <g id="Manga-Screentone-45deg" fill="#e8ecf2">`,
          `    ${circles.join('\n    ')}`,
          `  </g>`,
          `</svg>`
        ].join('\n');

        const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
        const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        triggerBlobDownload(blob, `manga-halftone-hero-${stamp}.svg`);
      }

      /* Expose headless export API + Shift+P / Shift+S shortcuts */
      window.CarrdMangaHero = {
        exportPng: export4kPngProof,
        exportSvg: exportVectorSvgProof
      };

      window.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.code === 'KeyP') export4kPngProof();
        if (e.shiftKey && e.code === 'KeyS') exportVectorSvgProof();
      });

      /* ======================================================================
       * 9. VIEWPORT RESIZE OBSERVER (100vw x 100vh)
       * ====================================================================== */
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            const currentDpr = Math.min(window.devicePixelRatio || 1, 2);
            renderer.setSize(width, height);
            renderTarget.setSize(Math.floor(width * currentDpr), Math.floor(height * currentDpr));
            postUniforms.uResolution.value.set(width * currentDpr, height * currentDpr);
            fitCameraToViewport(width, height);
          }
        }
      });
      resizeObserver.observe(stageEl);

      /* ======================================================================
       * 10. SLOWER, RANDOMIZED ORGANIC ANIMATION LOOP (NO HOVER INTERACTION)
       * ====================================================================== */
      /* Seeded random phase offsets so every load has a unique organic trajectory */
      const seeds = Array.from({ length: 12 }, () => Math.random() * Math.PI * 2);

      function slowNoise(t, f1, f2, sA, sB) {
        return (
          Math.sin(t * f1 + sA) * 0.65 +
          Math.cos(t * f2 + sB) * 0.35
        );
      }

      rootEl.setAttribute('data-state', 'ready');
      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);

        const t = clock.getElapsedTime();
        postUniforms.uTime.value = t;

        /* 1. Slow, random organic drift of the 3D text close to the wall & floor */
        textGroup.rotation.y = slowNoise(t, 0.14, 0.085, seeds[0], seeds[1]) * 0.28;
        textGroup.rotation.x = slowNoise(t, 0.11, 0.065, seeds[2], seeds[3]) * 0.14;
        textGroup.rotation.z = slowNoise(t, 0.09, 0.055, seeds[4], seeds[5]) * 0.045;

        textGroup.position.x = slowNoise(t, 0.12, 0.07, seeds[6], seeds[7]) * 0.35;
        textGroup.position.y = -0.15 + slowNoise(t, 0.16, 0.09, seeds[8], seeds[9]) * 0.18;
        textGroup.position.z = -0.15 + slowNoise(t, 0.10, 0.06, seeds[10], seeds[11]) * 0.15;

        /* 2. Slow, asynchronous sweep of Beam Source 1 (Upper-Left) */
        beamLight1.position.x = -5.6 + slowNoise(t, 0.13, 0.075, seeds[1], seeds[4]) * 1.85;
        beamLight1.position.y = 4.6 + slowNoise(t, 0.095, 0.05, seeds[2], seeds[7]) * 1.10;
        beamLight1.target.position.x = 0.8 + slowNoise(t, 0.11, 0.06, seeds[3], seeds[8]) * 1.45;
        beamLight1.target.position.y = -0.4 + slowNoise(t, 0.08, 0.05, seeds[5], seeds[9]) * 0.65;

        beamCone1.position.copy(beamLight1.position);
        beamCone1.lookAt(beamLight1.target.position);

        /* 3. Slow, asynchronous sweep of Beam Source 2 (Lower-Right Cross Beam) */
        beamLight2.position.x = 5.9 + slowNoise(t, 0.115, 0.068, seeds[6], seeds[10]) * 1.95;
        beamLight2.position.y = 2.2 + slowNoise(t, 0.105, 0.062, seeds[7], seeds[11]) * 1.15;
        beamLight2.target.position.x = -0.8 + slowNoise(t, 0.125, 0.072, seeds[0], seeds[5]) * 1.45;
        beamLight2.target.position.y = 0.1 + slowNoise(t, 0.09, 0.052, seeds[4], seeds[2]) * 0.70;

        beamCone2.position.copy(beamLight2.position);
        beamCone2.lookAt(beamLight2.target.position);

        /* PASS 1: Render 3D Architectural Stage & Dual Beam Shadows into RenderTarget */
        renderer.setRenderTarget(renderTarget);
        renderer.clear();
        renderer.render(scene3D, camera3D);

        /* PASS 2: Render Dark-Mode Manga Halftone & Squircle Mask to Screen */
        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
      }

      animate();
    } catch (err) {
      console.error('[Carrd Manga Halftone Background Error]:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
