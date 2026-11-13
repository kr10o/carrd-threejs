/* ==========================================================================
 * kr10o/carrd-threejs - script.js
 * Served via: https://cdn.jsdelivr.net/gh/kr10o/carrd-threejs@main/script.js
 * Features:
 *   1. Pass 1: 3D Extruded TextGeometry rendered into THREE.WebGLRenderTarget
 *   2. Pass 2: Rotated CMYK Halftone Rosette Post-Processing ShaderMaterial
 *   3. 4K Ultra-HD PNG Print Proof Exporter (Offscreen 3840w FBO capture)
 *   4. True 4-Plate Separated Vector SVG Halftone Exporter (C/M/Y/K Circles)
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
    GSAP_JS: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js',
    THREE_CATALOG_JS: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.186.1/three.tsl.js',
    THREE_UMD_FALLBACK_JS: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    FONT_LOADER_ADDON: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FontLoader.js',
    TEXT_GEOMETRY_ADDON: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/geometries/TextGeometry.js',
    HELVETIKER_BOLD_FONT: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json'
  };

  /* ==========================================================================
   * 2. QUERY PARAMETER STATE ROUTER (Carrd Hash-Router Safe)
   * ========================================================================== */
  const PRESET_CONFIGS = {
    vintage: {
      paperColor: [0.98, 0.965, 0.92],
      cmykStrength: [0.92, 0.90, 0.88, 0.96],
      inkGain: 1.08,
      edgeStrength: 0.88,
      monoMode: 0.0
    },
    pop: {
      paperColor: [1.0, 0.99, 0.96],
      cmykStrength: [1.0, 1.0, 0.96, 1.0],
      inkGain: 1.24,
      edgeStrength: 1.0,
      monoMode: 0.0
    },
    manga: {
      paperColor: [0.97, 0.97, 0.98],
      cmykStrength: [0.0, 0.0, 0.0, 1.0],
      inkGain: 1.18,
      edgeStrength: 1.0,
      monoMode: 1.0
    }
  };

  /* Lithographic Screen Angles in Radians */
  const SCREEN_ANGLES = {
    C: 0.2617993878, // 15 deg
    M: 1.3089969390, // 75 deg
    Y: 0.0000000000, //  0 deg
    K: 0.7853981634  // 45 deg
  };

  function getUrlState() {
    const params = new URLSearchParams(window.location.search);
    const presetKey = params.get('preset');
    const rawScale = parseFloat(params.get('scale'));
    const rawText = params.get('text');
    return {
      preset: PRESET_CONFIGS[presetKey] ? presetKey : 'vintage',
      scale: !isNaN(rawScale) ? Math.min(Math.max(rawScale, 28), 125) : 68,
      split: params.get('split') === '1',
      text: rawText && rawText.trim().length > 0 ? rawText.trim().slice(0, 12).toUpperCase() : 'COMIC!'
    };
  }

  function updateUrlState(key, value) {
    try {
      const url = new URL(window.location.href);
      if (value === null || value === false || value === '0') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, String(value));
      }
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    } catch (_) {}
  }

  /* ==========================================================================
   * 3. PASS 2 POST-PROCESSING SHADERS: ROTATED CMYK HALFTONE DOT MATRIX
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
    uniform vec3 uPaperColor;
    uniform vec4 uCmykStrength;
    uniform float uInkGain;
    uniform float uEdgeStrength;
    uniform float uMonoMode;
    uniform float uSplitView;
    uniform float uTime;

    varying vec2 vUv;

    mat2 rotate2d(float angleRad) {
      float c = cos(angleRad);
      float s = sin(angleRad);
      return mat2(c, -s, s, c);
    }

    float halftoneDot(vec2 fragCoord, float angleRad, float coverage, float cellFreq) {
      if (coverage <= 0.001) return 0.0;

      float minDim = min(uResolution.x, uResolution.y);
      vec2 normCoord = (fragCoord - 0.5 * uResolution) / minDim;

      vec2 rotated = rotate2d(angleRad) * normCoord * cellFreq;
      vec2 cellUv = fract(rotated) - 0.5;
      float dist = length(cellUv);

      float radius = sqrt(clamp(coverage, 0.0, 1.0)) * 0.68 * uInkGain;
      float aa = 1.35 * (cellFreq / minDim);
      return 1.0 - smoothstep(radius - aa, radius + aa, dist);
    }

    float getLuminance(vec3 rgb) {
      return dot(rgb, vec3(0.299, 0.587, 0.114));
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec3 rawRgb = texel.rgb;
      float alpha = texel.a;

      if (uSplitView > 0.5 && vUv.x < 0.5) {
        if (abs(vUv.x - 0.5) < (1.5 / uResolution.x)) {
          gl_FragColor = vec4(0.07, 0.08, 0.1, 1.0);
          return;
        }
        vec3 rawComp = mix(uPaperColor, rawRgb, alpha);
        gl_FragColor = vec4(rawComp, 1.0);
        return;
      }

      vec3 sceneColor = mix(uPaperColor, rawRgb, alpha);
      float lum = getLuminance(sceneColor);

      vec2 texelStep = 1.25 / uResolution;
      float lL = getLuminance(mix(uPaperColor, texture2D(tDiffuse, vUv - vec2(texelStep.x, 0.0)).rgb, texture2D(tDiffuse, vUv - vec2(texelStep.x, 0.0)).a));
      float lR = getLuminance(mix(uPaperColor, texture2D(tDiffuse, vUv + vec2(texelStep.x, 0.0)).rgb, texture2D(tDiffuse, vUv + vec2(texelStep.x, 0.0)).a));
      float lD = getLuminance(mix(uPaperColor, texture2D(tDiffuse, vUv - vec2(0.0, texelStep.y)).rgb, texture2D(tDiffuse, vUv - vec2(0.0, texelStep.y)).a));
      float lU = getLuminance(mix(uPaperColor, texture2D(tDiffuse, vUv + vec2(0.0, texelStep.y)).rgb, texture2D(tDiffuse, vUv + vec2(0.0, texelStep.y)).a));

      float aL = texture2D(tDiffuse, vUv - vec2(texelStep.x, 0.0)).a;
      float aR = texture2D(tDiffuse, vUv + vec2(texelStep.x, 0.0)).a;
      float aD = texture2D(tDiffuse, vUv - vec2(0.0, texelStep.y)).a;
      float aU = texture2D(tDiffuse, vUv + vec2(0.0, texelStep.y)).a;

      float gradLum = length(vec2(lR - lL, lU - lD));
      float gradAlpha = length(vec2(aR - aL, aU - aD));
      float comicContour = clamp((gradLum * 2.8 + gradAlpha * 1.9) * uEdgeStrength, 0.0, 1.0);
      comicContour = smoothstep(0.18, 0.52, comicContour);

      vec3 cmy = 1.0 - sceneColor;
      float kRaw = min(cmy.x, min(cmy.y, cmy.z));

      float shadowLum = 1.0 - lum;
      float K = clamp(pow(shadowLum, 1.55) * 0.92 + kRaw * 0.25, 0.0, 1.0) * alpha;

      float ucr = kRaw * 0.65;
      float C = clamp((cmy.x - ucr) / max(1.0 - ucr, 0.001), 0.0, 1.0) * alpha;
      float M = clamp((cmy.y - ucr) / max(1.0 - ucr, 0.001), 0.0, 1.0) * alpha;
      float Y = clamp((cmy.z - ucr) / max(1.0 - ucr, 0.001), 0.0, 1.0) * alpha;

      float bgVignette = length(vUv - 0.5) * 1.15;
      float bgCyanTone = (1.0 - alpha) * smoothstep(0.15, 0.85, bgVignette) * 0.16;
      C = max(C, bgCyanTone);

      if (uMonoMode > 0.5) {
        C = 0.0;
        M = 0.0;
        Y = 0.0;
        K = clamp(pow(1.0 - lum, 1.15) * alpha + bgCyanTone * 0.8, 0.0, 1.0);
      }

      vec2 fragCoord = vUv * uResolution;
      float dotC = halftoneDot(fragCoord, 0.261799, C, uGridScale) * uCmykStrength.x;
      float dotM = halftoneDot(fragCoord, 1.308996, M, uGridScale) * uCmykStrength.y;
      float dotY = halftoneDot(fragCoord, 0.000000, Y, uGridScale) * uCmykStrength.z;
      float dotK = halftoneDot(fragCoord, 0.785398, K, uGridScale) * uCmykStrength.w;

      vec3 cyanInk    = vec3(0.00, 0.68, 0.94);
      vec3 magentaInk = vec3(0.92, 0.00, 0.55);
      vec3 yellowInk  = vec3(1.00, 0.95, 0.00);
      vec3 blackInk   = vec3(0.08, 0.09, 0.11);

      float paperGrain = fract(sin(dot(floor(fragCoord * 0.5), vec2(12.9898, 78.233))) * 43758.5453);
      vec3 paper = uPaperColor - (paperGrain - 0.5) * 0.022;

      vec3 printed = paper;
      printed *= mix(vec3(1.0), cyanInk, dotC * 0.88);
      printed *= mix(vec3(1.0), magentaInk, dotM * 0.88);
      printed *= mix(vec3(1.0), yellowInk, dotY * 0.86);
      printed = mix(printed, blackInk, clamp(dotK + comicContour, 0.0, 1.0));

      gl_FragColor = vec4(printed, 1.0);
    }
  `;

  /* ==========================================================================
   * 4. APPLICATION BOOTSTRAP, RENDER LOOP & HIGH-RES PNG / SVG EXPORTERS
   * ========================================================================== */
  async function initApp() {
    const rootEl = document.getElementById('carrd-app-root');
    const stageEl = document.getElementById('halftone-canvas-stage');
    const loaderTextEl = document.getElementById('halftone-loader-text');
    const toastEl = document.getElementById('halftone-toast');
    const lpiSlider = document.getElementById('halftone-lpi-slider');
    const lpiReadout = document.getElementById('halftone-lpi-readout');
    const splitBtn = document.getElementById('halftone-split-btn');
    const exportPngBtn = document.getElementById('halftone-export-png-btn');
    const exportSvgBtn = document.getElementById('halftone-export-svg-btn');

    if (!rootEl || !stageEl) return;

    let toastTimer = null;
    function showToast(message, durationMs = 2800) {
      if (!toastEl) return;
      toastEl.textContent = message;
      toastEl.classList.add('is-visible');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastEl.classList.remove('is-visible');
      }, durationMs);
    }

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

    try {
      await loadCdnScript(CDN_ASSETS.GSAP_JS);

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

      const gsap = window.gsap;
      const state = getUrlState();

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
      stageEl.appendChild(renderer.domElement);

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

      /* PASS 1: 3D Extruded Text Scene */
      const scene3D = new THREE.Scene();
      const camera3D = new THREE.PerspectiveCamera(35, initW / initH, 0.1, 100);
      camera3D.position.set(0, 0, 13.5);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.38);
      scene3D.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfff4d6, 1.35);
      keyLight.position.set(6.5, 8.0, 9.0);
      scene3D.add(keyLight);

      const cyanLight = new THREE.DirectionalLight(0x00d8ff, 1.15);
      cyanLight.position.set(-9.0, 4.5, 4.0);
      scene3D.add(cyanLight);

      const magentaLight = new THREE.DirectionalLight(0xff1e9a, 1.05);
      magentaLight.position.set(4.0, -8.5, 5.5);
      scene3D.add(magentaLight);

      const pointerLight = new THREE.PointLight(0xffe600, 1.6, 22);
      pointerLight.position.set(0, 0, 5.5);
      scene3D.add(pointerLight);

      if (loaderTextEl) loaderTextEl.textContent = 'EXTRUDING 3D TEXT GEOMETRY...';

      const font = await new Promise((resolve, reject) => {
        const loader = new THREE.FontLoader();
        loader.load(CDN_ASSETS.HELVETIKER_BOLD_FONT, resolve, undefined, reject);
      });

      const textGeo = new THREE.TextGeometry(state.text, {
        font: font,
        size: 1.75,
        height: 0.72,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.18,
        bevelSize: 0.11,
        bevelOffset: 0.0,
        bevelSegments: 6
      });
      textGeo.center();
      textGeo.computeVertexNormals();

      const faceMaterial = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.28,
        metalness: 0.15
      });

      const sideMaterial = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.35,
        metalness: 0.25
      });

      const textGroup = new THREE.Group();
      scene3D.add(textGroup);

      const textMesh = new THREE.Mesh(textGeo, [faceMaterial, sideMaterial]);
      textGroup.add(textMesh);

      const accentGroup = new THREE.Group();
      textGroup.add(accentGroup);

      const torusGeo = new THREE.TorusGeometry(0.42, 0.16, 20, 48);
      const octaGeo = new THREE.OctahedronGeometry(0.48, 0);
      const accentMatA = new THREE.MeshStandardMaterial({ color: 0xff2a85, roughness: 0.25 });
      const accentMatB = new THREE.MeshStandardMaterial({ color: 0xffe600, roughness: 0.25 });

      const accent1 = new THREE.Mesh(torusGeo, accentMatA);
      accent1.position.set(-4.8, 1.55, -0.8);
      accentGroup.add(accent1);

      const accent2 = new THREE.Mesh(octaGeo, accentMatB);
      accent2.position.set(4.9, -1.45, 0.6);
      accentGroup.add(accent2);

      /* PASS 2: Fullscreen Post-Processing Quad */
      const postScene = new THREE.Scene();
      const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const activePreset = PRESET_CONFIGS[state.preset];

      const postUniforms = {
        tDiffuse: { value: renderTarget.texture },
        uResolution: { value: new THREE.Vector2(initW * dpr, initH * dpr) },
        uGridScale: { value: state.scale },
        uPaperColor: { value: new THREE.Vector3(...activePreset.paperColor) },
        uCmykStrength: { value: new THREE.Vector4(...activePreset.cmykStrength) },
        uInkGain: { value: activePreset.inkGain },
        uEdgeStrength: { value: activePreset.edgeStrength },
        uMonoMode: { value: activePreset.monoMode },
        uSplitView: { value: state.split ? 1.0 : 0.0 },
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

      function fitCameraToContainer(width, height) {
        const aspect = width / Math.max(height, 1);
        camera3D.aspect = aspect;
        camera3D.updateProjectionMatrix();

        const targetSpan = 10.6;
        const vFovRad = (camera3D.fov * Math.PI) / 180;
        const requiredZ = (targetSpan / aspect) / (2 * Math.tan(vFovRad / 2));
        camera3D.position.z = Math.max(10.0, Math.min(requiredZ, 24.0));
      }

      fitCameraToContainer(initW, initH);

      /* ======================================================================
       * 5. 4K ULTRA-HD RASTER PNG PRINT PROOF EXPORTER
       * ====================================================================== */
      async function export4kPngProof() {
        if (!exportPngBtn) return;
        exportPngBtn.disabled = true;
        showToast('RENDERING 4K ULTRA-HD CMYK PROOF...', 4000);

        await new Promise((r) => requestAnimationFrame(r));

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
          /* Configure renderer for 1:1 4K offscreen capture */
          renderer.setPixelRatio(1);
          renderer.setSize(targetW, targetH, false);

          /* Pass 1: Render 3D scene into 4K FBO */
          renderer.setRenderTarget(hiResTarget);
          renderer.setClearColor(0x000000, 0.0);
          renderer.clear();
          renderer.render(scene3D, camera3D);

          /* Pass 2: Render CMYK Halftone post-processing at 4K */
          postUniforms.tDiffuse.value = hiResTarget.texture;
          postUniforms.uResolution.value.set(targetW, targetH);

          renderer.setRenderTarget(null);
          renderer.render(postScene, postCamera);

          const blob = await new Promise((resolve) =>
            renderer.domElement.toBlob(resolve, 'image/png')
          );

          if (blob) {
            const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
            triggerBlobDownload(blob, `cmyk-halftone-4k-${ state.preset }-${ stamp }.png`);
            showToast(`EXPORTED 4K PNG (${ targetW }×${ targetH } PX)`);
          }
        } catch (err) {
          console.error('[4K PNG Export Error]:', err);
          showToast('4K PNG EXPORT FAILED');
        } finally {
          /* Restore live viewport dimensions and FBO bindings */
          hiResTarget.dispose();
          postUniforms.tDiffuse.value = renderTarget.texture;
          renderer.setPixelRatio(liveDpr);
          renderer.setSize(liveW, liveH);
          postUniforms.uResolution.value.set(liveW * liveDpr, liveH * liveDpr);
          renderer.setRenderTarget(null);
          renderer.render(postScene, postCamera);
          exportPngBtn.disabled = false;
        }
      }

      /* ======================================================================
       * 6. TRUE 4-PLATE SEPARATED VECTOR SVG HALFTONE EXPORTER
       *    Samples Pass 1 WebGLRenderTarget pixels and constructs mathematical
       *    rotated C (15°), M (75°), Y (0°), and K (45°) <circle> vector plates
       * ====================================================================== */
      async function exportVectorSvgProof() {
        if (!exportSvgBtn) return;
        exportSvgBtn.disabled = true;
        showToast('GENERATING SEPARATED CMYK VECTOR SVG PLATES...', 4000);

        await new Promise((r) => requestAnimationFrame(r));

        try {
          const rtW = renderTarget.width;
          const rtH = renderTarget.height;
          const pixelBuffer = new Uint8Array(rtW * rtH * 4);

          /* Ensure Pass 1 FBO is fresh and read RGBA pixels */
          renderer.setRenderTarget(renderTarget);
          renderer.setClearColor(0x000000, 0.0);
          renderer.clear();
          renderer.render(scene3D, camera3D);
          renderer.readRenderTargetPixels(renderTarget, 0, 0, rtW, rtH, pixelBuffer);
          renderer.setRenderTarget(null);

          const aspect = rtW / Math.max(rtH, 1);
          const svgW = 1920;
          const svgH = Math.round(svgW / aspect);
          const minDimSvg = Math.min(svgW, svgH);

          const paperR = postUniforms.uPaperColor.value.x;
          const paperG = postUniforms.uPaperColor.value.y;
          const paperB = postUniforms.uPaperColor.value.z;
          const cmykWeights = postUniforms.uCmykStrength.value;
          const inkGain = postUniforms.uInkGain.value;
          const monoMode = postUniforms.uMonoMode.value > 0.5;
          const cellFreq = state.scale;
          const cellSizeSvg = minDimSvg / cellFreq;

          /* Samples the Pass 1 FBO at normalized UV [0..1] (with WebGL Y-flip) */
          function sampleCmykAtUv(u, v) {
            const px = Math.min(Math.max(Math.floor(u * (rtW - 1)), 0), rtW - 1);
            const py = Math.min(Math.max(Math.floor(v * (rtH - 1)), 0), rtH - 1);
            const idx = (py * rtW + px) * 4;

            const rawR = pixelBuffer[idx] / 255;
            const rawG = pixelBuffer[idx + 1] / 255;
            const rawB = pixelBuffer[idx + 2] / 255;
            const alpha = pixelBuffer[idx + 3] / 255;

            const sr = paperR + (rawR - paperR) * alpha;
            const sg = paperG + (rawG - paperG) * alpha;
            const sb = paperB + (rawB - paperB) * alpha;

            const lum = 0.299 * sr + 0.587 * sg + 0.114 * sb;

            const cmyX = 1.0 - sr;
            const cmyY = 1.0 - sg;
            const cmyZ = 1.0 - sb;
            const kRaw = Math.min(cmyX, Math.min(cmyY, cmyZ));

            const shadowLum = 1.0 - lum;
            let K = Math.min(Math.max(Math.pow(shadowLum, 1.55) * 0.92 + kRaw * 0.25, 0.0), 1.0) * alpha;

            const ucr = kRaw * 0.65;
            const denom = Math.max(1.0 - ucr, 0.001);
            let C = Math.min(Math.max((cmyX - ucr) / denom, 0.0), 1.0) * alpha;
            let M = Math.min(Math.max((cmyY - ucr) / denom, 0.0), 1.0) * alpha;
            let Y = Math.min(Math.max((cmyZ - ucr) / denom, 0.0), 1.0) * alpha;

            const du = u - 0.5;
            const dv = v - 0.5;
            const bgVignette = Math.hypot(du, dv) * 1.15;
            const tVig = Math.min(Math.max((bgVignette - 0.15) / (0.85 - 0.15), 0.0), 1.0);
            const smoothVig = tVig * tVig * (3.0 - 2.0 * tVig);
            const bgCyanTone = (1.0 - alpha) * smoothVig * 0.16;
            C = Math.max(C, bgCyanTone);

            if (monoMode) {
              C = 0.0;
              M = 0.0;
              Y = 0.0;
              K = Math.min(Math.max(Math.pow(1.0 - lum, 1.15) * alpha + bgCyanTone * 0.8, 0.0), 1.0);
            }

            return { C, M, Y, K };
          }

          /* Builds a rotated vector lattice for a single CMYK ink channel */
          function buildVectorPlateCircles(channelKey, angleRad, strengthWeight) {
            if (strengthWeight <= 0.001) return '';
            const cosA = Math.cos(angleRad);
            const sinA = Math.sin(angleRad);

            /* Max extent in rotated cell units covering the entire rectangular viewport */
            const maxSpan = Math.ceil(Math.hypot(svgW, svgH) / cellSizeSvg * 0.55) + 2;
            const circles = [];

            for (let gx = -maxSpan; gx <= maxSpan; gx++) {
              for (let gy = -maxSpan; gy <= maxSpan; gy++) {
                /* Cell center in rotated grid coordinates */
                const rx = (gx + 0.5) / cellFreq;
                const ry = (gy + 0.5) / cellFreq;

                /* Inverse rotation back to normalized viewport coordinates */
                const nx = cosA * rx + sinA * ry;
                const ny = -sinA * rx + cosA * ry;

                const svgX = nx * minDimSvg + svgW * 0.5;
                const svgY = ny * minDimSvg + svgH * 0.5;

                if (svgX < -cellSizeSvg || svgX > svgW + cellSizeSvg || svgY < -cellSizeSvg || svgY > svgH + cellSizeSvg) {
                  continue;
                }

                const u = svgX / svgW;
                /* Flip Y for WebGL FBO coordinate space */
                const v = 1.0 - (svgY / svgH);
                if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) continue;

                const cmyk = sampleCmykAtUv(u, v);
                const coverage = cmyk[channelKey] * strengthWeight;
                if (coverage <= 0.004) continue;

                const radius = Math.sqrt(Math.min(coverage, 1.0)) * 0.68 * inkGain * cellSizeSvg;
                if (radius < 0.25) continue;

                circles.push(
                  `<circle cx="${svgX.toFixed(2)}" cy="${svgY.toFixed(2)}" r="${radius.toFixed(2)}"/>`
                );
              }
            }

            return circles.join('\n    ');
          }

          const paperHex = '#' + new THREE.Color(paperR, paperG, paperB).getHexString();

          const cyanCircles    = buildVectorPlateCircles('C', SCREEN_ANGLES.C, cmykWeights.x);
          const magentaCircles = buildVectorPlateCircles('M', SCREEN_ANGLES.M, cmykWeights.y);
          const yellowCircles  = buildVectorPlateCircles('Y', SCREEN_ANGLES.Y, cmykWeights.z);
          const blackCircles   = buildVectorPlateCircles('K', SCREEN_ANGLES.K, cmykWeights.w);

          const svgMarkup = [
            `<?xml version="1.0" encoding="UTF-8"?>`,
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">`,
            `  <title>CMYK Halftone Separated Vector Plates (${state.text} - ${Math.round(cellFreq)} LPI)</title>`,
            `  <rect id="Paper-Stock" width="100%" height="100%" fill="${paperHex}"/>`,
            `  <g id="Plate-Yellow-0deg" fill="#fff200" fill-opacity="0.88" style="mix-blend-mode: multiply;">`,
            `    ${yellowCircles}`,
            `  </g>`,
            `  <g id="Plate-Cyan-15deg" fill="#00aeef" fill-opacity="0.88" style="mix-blend-mode: multiply;">`,
            `    ${cyanCircles}`,
            `  </g>`,
            `  <g id="Plate-Magenta-75deg" fill="#ec008c" fill-opacity="0.88" style="mix-blend-mode: multiply;">`,
            `    ${magentaCircles}`,
            `  </g>`,
            `  <g id="Plate-Black-Key-45deg" fill="#14171c" fill-opacity="0.96" style="mix-blend-mode: multiply;">`,
            `    ${blackCircles}`,
            `  </g>`,
            `</svg>`
          ].join('\n');

          const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
          const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
          triggerBlobDownload(blob, `cmyk-halftone-plates-${state.preset}-${Math.round(cellFreq)}lpi-${stamp}.svg`);
          showToast(`EXPORTED 4-PLATE VECTOR SVG (${Math.round(cellFreq)} LPI)`);
        } catch (err) {
          console.error('[SVG Vector Export Error]:', err);
          showToast('SVG VECTOR EXPORT FAILED');
        } finally {
          exportSvgBtn.disabled = false;
        }
      }

      if (exportPngBtn) {
        exportPngBtn.addEventListener('click', export4kPngProof);
      }
      if (exportSvgBtn) {
        exportSvgBtn.addEventListener('click', exportVectorSvgProof);
      }

      /* 7. Interactive Pointer Tilt & Studio Light Sweep */
      const pointerNDC = new THREE.Vector2(0, 0);
      const targetTilt = new THREE.Vector2(0, 0);
      let isPointerActive = false;

      function onPointerMove(clientX, clientY) {
        const bounds = stageEl.getBoundingClientRect();
        if (bounds.width === 0 || bounds.height === 0) return;
        pointerNDC.x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
        pointerNDC.y = -((clientY - bounds.top) / bounds.height) * 2 + 1;
        isPointerActive = true;

        targetTilt.x = -pointerNDC.y * 0.42;
        targetTilt.y = pointerNDC.x * 0.65;

        pointerLight.position.x = pointerNDC.x * 7.5;
        pointerLight.position.y = pointerNDC.y * 4.5;
      }

      stageEl.addEventListener('pointermove', (e) => {
        onPointerMove(e.clientX, e.clientY);
      }, { passive: true });

      stageEl.addEventListener('pointerleave', () => {
        isPointerActive = false;
      });

      /* 8. HUD Controls & Preset Transitions */
      const presetButtons = rootEl.querySelectorAll('[data-preset]');

      function updateTelemetryReadout() {
        if (lpiReadout) {
          const modeLabel = state.split ? 'SPLIT FBO/CMYK' : 'FBO: ACTIVE';
          lpiReadout.textContent = `GRID: ${Math.round(state.scale)} LPI // ${modeLabel}`;
        }
      }

      function applyPreset(presetKey) {
        const cfg = PRESET_CONFIGS[presetKey];
        if (!cfg) return;
        state.preset = presetKey;
        updateUrlState('preset', presetKey);

        gsap.to(postUniforms.uPaperColor.value, {
          x: cfg.paperColor[0],
          y: cfg.paperColor[1],
          z: cfg.paperColor[2],
          duration: 0.45
        });
        gsap.to(postUniforms.uCmykStrength.value, {
          x: cfg.cmykStrength[0],
          y: cfg.cmykStrength[1],
          z: cfg.cmykStrength[2],
          w: cfg.cmykStrength[3],
          duration: 0.45
        });
        gsap.to(postUniforms.uInkGain, { value: cfg.inkGain, duration: 0.45 });
        gsap.to(postUniforms.uEdgeStrength, { value: cfg.edgeStrength, duration: 0.45 });
        postUniforms.uMonoMode.value = cfg.monoMode;

        presetButtons.forEach((btn) => {
          btn.classList.toggle('is-active', btn.getAttribute('data-preset') === presetKey);
        });
      }

      presetButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          applyPreset(btn.getAttribute('data-preset'));
        });
      });

      if (lpiSlider) {
        lpiSlider.value = String(state.scale);
        lpiSlider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          state.scale = val;
          postUniforms.uGridScale.value = val;
          updateUrlState('scale', Math.round(val));
          updateTelemetryReadout();
        });
      }

      if (splitBtn) {
        splitBtn.classList.toggle('is-active', state.split);
        splitBtn.addEventListener('click', () => {
          state.split = !state.split;
          postUniforms.uSplitView.value = state.split ? 1.0 : 0.0;
          splitBtn.classList.toggle('is-active', state.split);
          updateUrlState('split', state.split ? '1' : null);
          updateTelemetryReadout();
        });
      }

      applyPreset(state.preset);
      updateTelemetryReadout();

      /* 9. Container-Scoped ResizeObserver */
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            const currentDpr = Math.min(window.devicePixelRatio || 1, 2);
            renderer.setSize(width, height);
            renderTarget.setSize(Math.floor(width * currentDpr), Math.floor(height * currentDpr));
            postUniforms.uResolution.value.set(width * currentDpr, height * currentDpr);
            fitCameraToContainer(width, height);
          }
        }
      });
      resizeObserver.observe(stageEl);

      /* 10. Start 60fps Dual-Pass Render Loop */
      rootEl.setAttribute('data-state', 'ready');
      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();
        postUniforms.uTime.value = elapsed;

        const autoRotY = Math.sin(elapsed * 0.95) * 0.48;
        const autoRotX = Math.cos(elapsed * 0.72) * 0.22;
        const autoRotZ = Math.sin(elapsed * 0.55) * 0.06;

        const desiredX = isPointerActive ? targetTilt.x : autoRotX;
        const desiredY = isPointerActive ? targetTilt.y : autoRotY;

        textGroup.rotation.x += (desiredX - textGroup.rotation.x) * 0.08;
        textGroup.rotation.y += (desiredY - textGroup.rotation.y) * 0.08;
        textGroup.rotation.z += (autoRotZ - textGroup.rotation.z) * 0.08;

        accent1.rotation.x = elapsed * 1.4;
        accent1.rotation.y = elapsed * 1.1;
        accent2.rotation.y = -elapsed * 1.3;
        accent2.rotation.z = elapsed * 0.9;

        keyLight.position.x = Math.cos(elapsed * 0.8) * 7.5;
        keyLight.position.y = 5.5 + Math.sin(elapsed * 1.1) * 3.0;

        /* PASS 1: Render 3D Scene into Offscreen WebGLRenderTarget */
        renderer.setRenderTarget(renderTarget);
        renderer.setClearColor(0x000000, 0.0);
        renderer.clear();
        renderer.render(scene3D, camera3D);

        /* PASS 2: Render CMYK Halftone Post-Processing Quad to Screen */
        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
      }

      animate();
    } catch (err) {
      console.error('[CMYK Halftone Hero Error]:', err);
      if (loaderTextEl) {
        loaderTextEl.textContent = 'WEBGL RENDER TARGET ERROR — CHECK CONSOLE';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
