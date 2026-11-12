<script>
(function () {
  'use strict';

  /* ==========================================================================
   * 1. DYNAMIC CDN LOADER PROTOCOL (carrd-cdn-scripts compliant)
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

  function loadCdnStyle(url) {
    if (document.querySelector(`link[href="${url}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  /* Verified CDN URLs */
  const CDN_ASSETS = {
    FONT_AWESOME_CSS: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css',
    GSAP_JS: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js',
    THREE_CATALOG_JS: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.186.1/three.tsl.js',
    THREE_UMD_FALLBACK_JS: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    FONT_LOADER_ADDON: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FontLoader.js',
    TEXT_GEOMETRY_ADDON: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/geometries/TextGeometry.js',
    HELVETIKER_BOLD_FONT: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json'
  };

  /* ==========================================================================
   * 2. QUERY PARAMETER ROUTER (Strict Carrd Hash-Router Safe)
   * ========================================================================== */
  const PRESET_CONFIGS = {
    mercury: {
      tintA: [1.0, 1.0, 1.03],
      tintB: [0.82, 0.88, 0.96],
      dispersion: 0.018,
      noiseFreq: 0.58,
      noiseAmp: 0.085,
      rippleStrength: 0.42
    },
    iridium: {
      tintA: [0.85, 0.95, 1.12],
      tintB: [0.78, 0.62, 1.05],
      dispersion: 0.036,
      noiseFreq: 0.68,
      noiseAmp: 0.105,
      rippleStrength: 0.48
    },
    aurum: {
      tintA: [1.12, 0.94, 0.68],
      tintB: [0.95, 0.72, 0.42],
      dispersion: 0.015,
      noiseFreq: 0.52,
      noiseAmp: 0.08,
      rippleStrength: 0.40
    }
  };

  function getUrlState() {
    const params = new URLSearchParams(window.location.search);
    const presetKey = params.get('preset');
    return {
      preset: PRESET_CONFIGS[presetKey] ? presetKey : 'mercury',
      wireframe: params.get('wireframe') === '1'
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
      /* Preserve Carrd native hash if present without triggering hashchange */
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    } catch (_) {
      /* Ignore restricted sandbox history errors */
    }
  }

  /* ==========================================================================
   * 3. PROCEDURAL HIGH-CONTRAST STUDIO CHROME MATCAP GENERATOR
   *    Synthesizes a 1024x1024 reflective liquid metal sphere map on Canvas
   * ========================================================================== */
  function createChromeMatCapTexture(THREE, mode = 'mercury') {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size * 0.5;
    const cy = size * 0.5;
    const r = size * 0.5;

    /* 1. Base Metallic Sphere Gradient */
    const baseGrad = ctx.createRadialGradient(cx, cy - r * 0.18, r * 0.04, cx, cy, r);
    if (mode === 'aurum') {
      baseGrad.addColorStop(0.0, '#fffdf5');
      baseGrad.addColorStop(0.22, '#f5d087');
      baseGrad.addColorStop(0.45, '#59411a');
      baseGrad.addColorStop(0.52, '#140e05');
      baseGrad.addColorStop(0.72, '#d4a24c');
      baseGrad.addColorStop(0.90, '#fff2cc');
      baseGrad.addColorStop(1.0, '#2b1d08');
    } else if (mode === 'iridium') {
      baseGrad.addColorStop(0.0, '#ffffff');
      baseGrad.addColorStop(0.20, '#bae6fd');
      baseGrad.addColorStop(0.44, '#312e81');
      baseGrad.addColorStop(0.51, '#090714');
      baseGrad.addColorStop(0.70, '#c084fc');
      baseGrad.addColorStop(0.89, '#e0f2fe');
      baseGrad.addColorStop(1.0, '#1e1b4b');
    } else {
      baseGrad.addColorStop(0.0, '#ffffff');
      baseGrad.addColorStop(0.18, '#e2e8f0');
      baseGrad.addColorStop(0.42, '#475569');
      baseGrad.addColorStop(0.49, '#090b10');
      baseGrad.addColorStop(0.55, '#1e293b');
      baseGrad.addColorStop(0.74, '#cbd5e1');
      baseGrad.addColorStop(0.91, '#ffffff');
      baseGrad.addColorStop(1.0, '#1e2430');
    }
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, size, size);

    /* 2. Studio Horizon Compression Bands (Critical for realistic liquid metal reflections) */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const horizonGrad = ctx.createLinearGradient(0, 0, 0, size);
    horizonGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.90)');
    horizonGrad.addColorStop(0.18, 'rgba(226, 232, 240, 0.35)');
    horizonGrad.addColorStop(0.44, 'rgba(15, 23, 42, 0.82)');
    horizonGrad.addColorStop(0.495, 'rgba(2, 4, 8, 0.98)');
    horizonGrad.addColorStop(0.515, 'rgba(255, 255, 255, 0.95)');
    horizonGrad.addColorStop(0.58, 'rgba(51, 65, 85, 0.55)');
    horizonGrad.addColorStop(0.82, 'rgba(241, 245, 249, 0.70)');
    horizonGrad.addColorStop(1.0, 'rgba(15, 23, 42, 0.90)');

    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, 0, size, size);

    /* 3. Sharp Anamorphic Studio Softbox Highlights */
    ctx.globalCompositeOperation = 'screen';

    const drawStudioHighlight = (x, y, rx, ry, rot, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, ry / rx);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      g.addColorStop(0.0, `rgba(255, 255, 255, ${alpha})`);
      g.addColorStop(0.35, `rgba(248, 250, 252, ${alpha * 0.65})`);
      g.addColorStop(0.7, `rgba(203, 213, 225, ${alpha * 0.15})`);
      g.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    /* Top dome softbox + dual lateral specular ribbons */
    drawStudioHighlight(cx - r * 0.24, cy - r * 0.42, r * 0.48, r * 0.16, -0.32, 0.98);
    drawStudioHighlight(cx + r * 0.28, cy - r * 0.30, r * 0.38, r * 0.11, 0.40, 0.85);
    drawStudioHighlight(cx, cy + r * 0.56, r * 0.55, r * 0.14, 0.0, 0.88);
    drawStudioHighlight(cx - r * 0.52, cy + r * 0.12, r * 0.18, r * 0.42, 0.22, 0.72);
    drawStudioHighlight(cx + r * 0.54, cy + r * 0.08, r * 0.16, r * 0.40, -0.22, 0.72);

    /* 4. Crisp Fresnel Outer Specular Ring */
    ctx.globalCompositeOperation = 'source-over';
    const rimGrad = ctx.createRadialGradient(cx, cy, r * 0.78, cx, cy, r);
    rimGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');
    rimGrad.addColorStop(0.68, 'rgba(255, 255, 255, 0.82)');
    rimGrad.addColorStop(0.92, 'rgba(255, 255, 255, 0.96)');
    rimGrad.addColorStop(1.0, 'rgba(15, 23, 42, 1.0)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, 0, size, size);

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /* ==========================================================================
   * 4. GLSL SHADERS: 3D SIMPLEX NOISE + FINITE-DIFFERENCE NORMALS + MATCAP
   * ========================================================================== */
  const VERTEX_SHADER = `
    uniform float uTime;
    uniform vec3 uMouse3D;
    uniform float uHoverIntensity;
    uniform float uNoiseFreq;
    uniform float uNoiseAmp;
    uniform float uRippleStrength;
    uniform float uRippleRadius;
    uniform vec4 uRipples[6]; // xyz = local hit position, w = birth timestamp

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vLocalPos;
    varying float vDisplacement;
    varying float vRippleMask;

    /* --- Ashima Arts / Ian McEwan 3D Simplex Noise --- */
    vec4 permute(vec4 x) {
      return mod(((x * 34.0) + 1.0) * x, 289.0);
    }
    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 1.0 / 7.0;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    /* Evaluates combined 3D Simplex Noise + Raycaster Liquid Mercury Ripple Field */
    vec2 evaluateMercuryField(vec3 p) {
      /* 1. Ambient Organic Liquid Metal Breathing (2-Octave 3D Simplex Noise) */
      vec3 noiseCoord = p * uNoiseFreq + vec3(uTime * 0.28, -uTime * 0.22, uTime * 0.45);
      float n1 = snoise(noiseCoord);
      float n2 = 0.5 * snoise(noiseCoord * 2.15 + vec3(13.4, -7.2, uTime * 0.75));
      float baseOrganic = (n1 + n2) * uNoiseAmp;

      /* 2. Active Raycaster Intersection Ripple + High-Frequency Mercury Boil */
      float distToMouse = distance(p, uMouse3D);
      float gaussianFocus = exp(-(distToMouse * distToMouse) / (2.0 * uRippleRadius * uRippleRadius));
      float concentricWave = sin(distToMouse * 11.5 - uTime * 14.0) * cos(distToMouse * 5.2 - uTime * 7.0);
      float localTurbulence = snoise(p * (uNoiseFreq * 3.2) + vec3(0.0, 0.0, uTime * 2.6)) * 0.45;
      float activeRipple = (concentricWave + localTurbulence) * gaussianFocus * uHoverIntensity * uRippleStrength;

      /* 3. Trailing Wave Packets from Recent Raycaster Intersections */
      float trailWaves = 0.0;
      float trailMask = 0.0;
      for (int i = 0; i < 6; i++) {
        float age = uTime - uRipples[i].w;
        if (age > 0.0 && age < 2.2) {
          float d = distance(p, uRipples[i].xyz);
          float waveFront = d - age * 2.4;
          float envelope = exp(-(waveFront * waveFront) / 0.38) * exp(-age * 1.65);
          trailWaves += sin(d * 13.0 - age * 16.0) * envelope * (uRippleStrength * 0.55);
          trailMask += envelope;
        }
      }

      float totalDisp = baseOrganic + activeRipple + trailWaves;
      float totalMask = clamp(gaussianFocus * uHoverIntensity + trailMask * 0.7, 0.0, 1.0);
      return vec2(totalDisp, totalMask);
    }

    void main() {
      vLocalPos = position;
      vec3 N = normalize(normal);

      /* Construct orthogonal tangent frame (T, B, N) for finite-difference normal perturbation */
      vec3 up = abs(N.y) < 0.999 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
      vec3 T = normalize(cross(up, N));
      vec3 B = cross(N, T);

      float eps = 0.035;
      vec2 centerEval = evaluateMercuryField(position);
      float d0 = centerEval.x;
      float dT = evaluateMercuryField(position + T * eps).x;
      float dB = evaluateMercuryField(position + B * eps).x;

      vec3 displacedPos = position + N * d0;
      vec3 displacedT = (position + T * eps + N * dT) - displacedPos;
      vec3 displacedB = (position + B * eps + N * dB) - displacedPos;

      vec3 perturbedNormal = normalize(cross(displacedT, displacedB));

      vDisplacement = d0;
      vRippleMask = centerEval.y;
      vNormal = normalize(normalMatrix * perturbedNormal);

      vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const FRAGMENT_SHADER = `
    uniform sampler2D uMatcapTexture;
    uniform vec3 uTintA;
    uniform vec3 uTintB;
    uniform float uDispersion;
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vLocalPos;
    varying float vDisplacement;
    varying float vRippleMask;

    /* View-Aligned MatCap Coordinate Projection */
    vec2 computeMatCapUV(vec3 viewDir, vec3 normal) {
      vec3 x = normalize(vec3(viewDir.z, 0.0, -viewDir.x));
      vec3 y = cross(viewDir, x);
      return vec2(dot(x, normal), dot(y, normal)) * 0.495 + 0.5;
    }

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);

      vec2 uv = computeMatCapUV(viewDir, normal);

      /* Dynamic Liquid Chromatic Aberration proportional to ripple slope & displacement */
      float aberration = uDispersion * (0.35 + vRippleMask * 1.85 + abs(vDisplacement) * 2.5);
      vec2 radialDir = normalize(uv - vec2(0.5));

      float r = texture2D(uMatcapTexture, clamp(uv + radialDir * aberration, 0.002, 0.998)).r;
      float g = texture2D(uMatcapTexture, clamp(uv, 0.002, 0.998)).g;
      float b = texture2D(uMatcapTexture, clamp(uv - radialDir * aberration, 0.002, 0.998)).b;
      vec3 chromeColor = vec3(r, g, b);

      /* Metallic Tint & High-Contrast Specular Curve */
      float luma = dot(chromeColor, vec3(0.299, 0.587, 0.114));
      vec3 tintedMetal = mix(chromeColor * uTintB, chromeColor * uTintA, smoothstep(0.25, 0.85, luma));

      /* Fresnel Rim Specular Boost for Liquid Mercury Sheen */
      float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 3.2);
      vec3 rimGlow = uTintA * fresnel * (0.45 + vRippleMask * 0.55);

      /* Hot Specular Glint on Wave Crests */
      float crestGlint = smoothstep(0.06, 0.24, vDisplacement) * vRippleMask * 0.32;

      vec3 finalColor = tintedMetal + rimGlow + vec3(crestGlint);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  /* ==========================================================================
   * 5. ITERATIVE PLANAR TRIANGLE TESSELLATOR FOR THREE.TextGeometry
   *    Subdivides sparse glyph face triangles so vertex displacement is silky
   * ========================================================================== */
  function tessellateBufferGeometry(THREE, geometry, maxEdgeLength, iterations) {
    let geom = geometry.index ? geometry.toNonIndexed() : geometry.clone();

    for (let iter = 0; iter < iterations; iter++) {
      const posAttr = geom.attributes.position;
      const normAttr = geom.attributes.normal;
      const count = posAttr.count;

      const newPositions = [];
      const newNormals = [];

      const vA = new THREE.Vector3();
      const vB = new THREE.Vector3();
      const vC = new THREE.Vector3();
      const nA = new THREE.Vector3();
      const nB = new THREE.Vector3();
      const nC = new THREE.Vector3();

      const pushTri = (p1, p2, p3, nm1, nm2, nm3) => {
        newPositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
        newNormals.push(nm1.x, nm1.y, nm1.z, nm2.x, nm2.y, nm2.z, nm3.x, nm3.y, nm3.z);
      };

      const maxEdgeSq = maxEdgeLength * maxEdgeLength;

      for (let i = 0; i < count; i += 3) {
        vA.fromBufferAttribute(posAttr, i);
        vB.fromBufferAttribute(posAttr, i + 1);
        vC.fromBufferAttribute(posAttr, i + 2);

        nA.fromBufferAttribute(normAttr, i);
        nB.fromBufferAttribute(normAttr, i + 1);
        nC.fromBufferAttribute(normAttr, i + 2);

        const dAB = vA.distanceToSquared(vB);
        const dBC = vB.distanceToSquared(vC);
        const dCA = vC.distanceToSquared(vA);
        const longest = Math.max(dAB, dBC, dCA);

        if (longest > maxEdgeSq) {
          /* Split along the longest edge */
          if (dAB >= dBC && dAB >= dCA) {
            const mP = vA.clone().add(vB).multiplyScalar(0.5);
            const mN = nA.clone().add(nB).normalize();
            pushTri(vA, mP, vC, nA, mN, nC);
            pushTri(mP, vB, vC, mN, nB, nC);
          } else if (dBC >= dAB && dBC >= dCA) {
            const mP = vB.clone().add(vC).multiplyScalar(0.5);
            const mN = nB.clone().add(nC).normalize();
            pushTri(vA, vB, mP, nA, nB, mN);
            pushTri(vA, mP, vC, nA, mN, nC);
          } else {
            const mP = vC.clone().add(vA).multiplyScalar(0.5);
            const mN = nC.clone().add(nA).normalize();
            pushTri(vA, vB, mP, nA, nB, mN);
            pushTri(mP, vB, vC, mN, nB, nC);
          }
        } else {
          pushTri(vA, vB, vC, nA, nB, nC);
        }
      }

      const nextGeom = new THREE.BufferGeometry();
      nextGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
      nextGeom.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
      geom.dispose();
      geom = nextGeom;
    }

    return geom;
  }

  /* Smooths normals across shared spatial vertices so flat faces + bevels blend like liquid */
  function computeSmoothedMercuryNormals(THREE, geometry) {
    const pos = geometry.attributes.position;
    const norm = geometry.attributes.normal;
    const count = pos.count;
    const accumMap = new Map();
    const precision = 1000;

    const keyOf = (x, y, z) =>
      `${Math.round(x * precision)}_${Math.round(y * precision)}_${Math.round(z * precision)}`;

    for (let i = 0; i < count; i++) {
      const k = keyOf(pos.getX(i), pos.getY(i), pos.getZ(i));
      let acc = accumMap.get(k);
      if (!acc) {
        acc = new THREE.Vector3();
        accumMap.set(k, acc);
      }
      acc.x += norm.getX(i);
      acc.y += norm.getY(i);
      acc.z += norm.getZ(i);
    }

    for (let i = 0; i < count; i++) {
      const k = keyOf(pos.getX(i), pos.getY(i), pos.getZ(i));
      const acc = accumMap.get(k);
      const len = Math.hypot(acc.x, acc.y, acc.z) || 1;
      norm.setXYZ(i, acc.x / len, acc.y / len, acc.z / len);
    }
    norm.needsUpdate = true;
  }

  /* ==========================================================================
   * 6. APPLICATION BOOTSTRAP & THREE.JS HERO ENGINE
   * ========================================================================== */
  async function initApp() {
    const rootEl = document.getElementById('carrd-app-root');
    const stageEl = document.getElementById('mercury-canvas-stage');
    const loaderTextEl = document.getElementById('mercury-loader-text');
    const raycastStatusEl = document.getElementById('mercury-raycast-status');
    const coordsReadoutEl = document.getElementById('mercury-coords-readout');
    const wireframeBtn = document.getElementById('mercury-wireframe-btn');

    if (!rootEl || !stageEl) return;

    try {
      /* 1. Load CSS & External CDN Scripts */
      loadCdnStyle(CDN_ASSETS.FONT_AWESOME_CSS);
      await loadCdnScript(CDN_ASSETS.GSAP_JS);

      try {
        await loadCdnScript(CDN_ASSETS.THREE_CATALOG_JS);
      } catch (_) {
        /* Fallback to UMD r128 if 0.186.1 TSL script is unavailable */
      }

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

      /* 2. Initialize Scene, Camera, and Renderer */
      const scene = new THREE.Scene();

      const rect = stageEl.getBoundingClientRect();
      const initW = Math.max(rect.width, 320);
      const initH = Math.max(rect.height, 320);

      const camera = new THREE.PerspectiveCamera(34, initW / initH, 0.1, 100);
      camera.position.set(0, 0, 14.5);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(initW, initH);
      stageEl.appendChild(renderer.domElement);

      /* 3. Pre-generate MatCap Textures for Instant Preset Switching */
      const matcapTextures = {
        mercury: createChromeMatCapTexture(THREE, 'mercury'),
        iridium: createChromeMatCapTexture(THREE, 'iridium'),
        aurum: createChromeMatCapTexture(THREE, 'aurum')
      };

      /* 4. Configure Ripple Ring Buffer & Custom ShaderMaterial */
      const MAX_RIPPLES = 6;
      const rippleUniformArray = Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, 0, -99.0));
      let rippleWriteIndex = 0;
      let lastRippleSpawnTime = -10;

      const activePreset = PRESET_CONFIGS[state.preset];

      const uniforms = {
        uTime: { value: 0 },
        uMouse3D: { value: new THREE.Vector3(0, 0, 0) },
        uHoverIntensity: { value: 0.0 },
        uNoiseFreq: { value: activePreset.noiseFreq },
        uNoiseAmp: { value: activePreset.noiseAmp },
        uRippleStrength: { value: activePreset.rippleStrength },
        uRippleRadius: { value: 1.35 },
        uRipples: { value: rippleUniformArray },
        uMatcapTexture: { value: matcapTextures[state.preset] },
        uTintA: { value: new THREE.Vector3(...activePreset.tintA) },
        uTintB: { value: new THREE.Vector3(...activePreset.tintB) },
        uDispersion: { value: activePreset.dispersion }
      };

      const mercuryMaterial = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: uniforms,
        wireframe: state.wireframe
      });

      /* 5. Load Typeface & Construct Subdivided Extruded "FASHION" TextGeometry */
      if (loaderTextEl) loaderTextEl.textContent = 'TESSELLATING "FASHION" 3D MESH...';

      const font = await new Promise((resolve, reject) => {
        const loader = new THREE.FontLoader();
        loader.load(CDN_ASSETS.HELVETIKER_BOLD_FONT, resolve, undefined, reject);
      });

      const rawTextGeo = new THREE.TextGeometry('FASHION', {
        font: font,
        size: 1.55,
        height: 0.52,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.14,
        bevelSize: 0.085,
        bevelOffset: 0.0,
        bevelSegments: 8
      });

      rawTextGeo.center();

      /* Subdivide sparse planar glyph faces so 3D Simplex noise + ripples deform interior faces smoothly */
      const subdividedTextGeo = tessellateBufferGeometry(THREE, rawTextGeo, 0.22, 4);
      rawTextGeo.dispose();
      computeSmoothedMercuryNormals(THREE, subdividedTextGeo);
      subdividedTextGeo.computeBoundingBox();

      const textGroup = new THREE.Group();
      scene.add(textGroup);

      const textMesh = new THREE.Mesh(subdividedTextGeo, mercuryMaterial);
      textGroup.add(textMesh);

      /* Responsive Camera Fit based on Container Aspect Ratio */
      function fitCameraToText(width, height) {
        const aspect = width / Math.max(height, 1);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        /* "FASHION" bounding width is ~10.6 units */
        const targetWidth = 11.8;
        const vFovRad = (camera.fov * Math.PI) / 180;
        const requiredZ = (targetWidth / aspect) / (2 * Math.tan(vFovRad / 2));
        camera.position.z = Math.max(10.5, Math.min(requiredZ, 26.0));
      }

      fitCameraToText(initW, initH);

      /* 6. Raycaster & Pointer Interaction Pipeline */
      const raycaster = new THREE.Raycaster();
      const pointerNDC = new THREE.Vector2(999, 999);
      const targetMouse3D = new THREE.Vector3(0, 0, 0);
      const targetGroupRotation = new THREE.Vector2(0, 0);
      let isPointerInside = false;
      let isCurrentlyIntersecting = false;

      function handlePointerMove(clientX, clientY) {
        const bounds = stageEl.getBoundingClientRect();
        if (bounds.width === 0 || bounds.height === 0) return;

        /* Normalize pointer strictly relative to Carrd embed container */
        pointerNDC.x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
        pointerNDC.y = -((clientY - bounds.top) / bounds.height) * 2 + 1;
        isPointerInside = true;

        /* Subtle parallax tilt on the 3D text group */
        targetGroupRotation.x = -pointerNDC.y * 0.14;
        targetGroupRotation.y = pointerNDC.x * 0.20;
      }

      stageEl.addEventListener('pointermove', (e) => {
        handlePointerMove(e.clientX, e.clientY);
      }, { passive: true });

      stageEl.addEventListener('pointerdown', (e) => {
        handlePointerMove(e.clientX, e.clientY);
        /* Trigger an immediate mercury shockwave on click/tap */
        if (isCurrentlyIntersecting) {
          const now = uniforms.uTime.value;
          rippleUniformArray[rippleWriteIndex].set(
            targetMouse3D.x,
            targetMouse3D.y,
            targetMouse3D.z,
            now
          );
          rippleWriteIndex = (rippleWriteIndex + 1) % MAX_RIPPLES;
          gsap.fromTo(uniforms.uHoverIntensity, { value: 1.65 }, { value: 1.0, duration: 0.7, ease: 'power2.out' });
        }
      }, { passive: true });

      stageEl.addEventListener('pointerleave', () => {
        isPointerInside = false;
        isCurrentlyIntersecting = false;
        targetGroupRotation.set(0, 0);
        gsap.to(uniforms.uHoverIntensity, {
          value: 0.0,
          duration: 1.15,
          ease: 'power3.out',
          overwrite: 'auto'
        });
        if (raycastStatusEl) {
          raycastStatusEl.innerHTML = '<i class="fa-solid fa-crosshairs"></i> RAYCASTER: STANDBY';
          raycastStatusEl.classList.remove('is-hit');
        }
      });

      /* 7. HUD Preset & Wireframe Controls */
      const presetButtons = rootEl.querySelectorAll('[data-preset]');

      function applyPreset(presetKey) {
        const cfg = PRESET_CONFIGS[presetKey];
        if (!cfg) return;
        state.preset = presetKey;
        updateUrlState('preset', presetKey);

        uniforms.uMatcapTexture.value = matcapTextures[presetKey];

        gsap.to(uniforms.uTintA.value, {
          x: cfg.tintA[0],
          y: cfg.tintA[1],
          z: cfg.tintA[2],
          duration: 0.65,
          ease: 'power2.out'
        });
        gsap.to(uniforms.uTintB.value, {
          x: cfg.tintB[0],
          y: cfg.tintB[1],
          z: cfg.tintB[2],
          duration: 0.65,
          ease: 'power2.out'
        });
        gsap.to(uniforms.uDispersion, { value: cfg.dispersion, duration: 0.65 });
        gsap.to(uniforms.uNoiseFreq, { value: cfg.noiseFreq, duration: 0.65 });
        gsap.to(uniforms.uNoiseAmp, { value: cfg.noiseAmp, duration: 0.65 });
        gsap.to(uniforms.uRippleStrength, { value: cfg.rippleStrength, duration: 0.65 });

        presetButtons.forEach((btn) => {
          btn.classList.toggle('is-active', btn.getAttribute('data-preset') === presetKey);
        });
      }

      presetButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          applyPreset(btn.getAttribute('data-preset'));
        });
      });

      if (wireframeBtn) {
        wireframeBtn.classList.toggle('is-active', state.wireframe);
        wireframeBtn.addEventListener('click', () => {
          state.wireframe = !state.wireframe;
          mercuryMaterial.wireframe = state.wireframe;
          wireframeBtn.classList.toggle('is-active', state.wireframe);
          updateUrlState('wireframe', state.wireframe ? '1' : null);
        });
      }

      applyPreset(state.preset);

      /* 8. Container-Scoped ResizeObserver */
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            renderer.setSize(width, height);
            fitCameraToText(width, height);
          }
        }
      });
      resizeObserver.observe(stageEl);

      /* 9. Reveal Scene & Start 60fps Render + Raycaster Loop */
      rootEl.setAttribute('data-state', 'ready');

      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();
        uniforms.uTime.value = elapsed;

        /* Smoothly damp 3D text group parallax orientation */
        textGroup.rotation.x += (targetGroupRotation.x - textGroup.rotation.x) * 0.08;
        textGroup.rotation.y += (targetGroupRotation.y - textGroup.rotation.y) * 0.08;

        /* Perform Raycast against the extruded "FASHION" TextGeometry mesh */
        if (isPointerInside) {
          raycaster.setFromCamera(pointerNDC, camera);
          const hits = raycaster.intersectObject(textMesh, false);

          if (hits.length > 0) {
            const hit = hits[0];
            /* Transform world hit coordinate into mesh local space */
            const localHit = textMesh.worldToLocal(hit.point.clone());
            targetMouse3D.copy(localHit);

            if (!isCurrentlyIntersecting) {
              isCurrentlyIntersecting = true;
              gsap.to(uniforms.uHoverIntensity, {
                value: 1.0,
                duration: 0.35,
                ease: 'power2.out',
                overwrite: 'auto'
              });
              if (raycastStatusEl) {
                raycastStatusEl.innerHTML = '<i class="fa-solid fa-wave-square"></i> RAYCASTER: MERCURY DISPLACEMENT ACTIVE';
                raycastStatusEl.classList.add('is-hit');
              }
            }

            /* Spawn trailing ripple packets along the raycast path across the letters */
            if (elapsed - lastRippleSpawnTime > 0.085) {
              rippleUniformArray[rippleWriteIndex].set(localHit.x, localHit.y, localHit.z, elapsed);
              rippleWriteIndex = (rippleWriteIndex + 1) % MAX_RIPPLES;
              lastRippleSpawnTime = elapsed;
            }

            if (coordsReadoutEl) {
              coordsReadoutEl.textContent = `XYZ: [${localHit.x.toFixed(2)}, ${localHit.y.toFixed(2)}, ${localHit.z.toFixed(2)}]`;
            }
          } else if (isCurrentlyIntersecting) {
            isCurrentlyIntersecting = false;
            gsap.to(uniforms.uHoverIntensity, {
              value: 0.0,
              duration: 0.95,
              ease: 'power3.out',
              overwrite: 'auto'
            });
            if (raycastStatusEl) {
              raycastStatusEl.innerHTML = '<i class="fa-solid fa-crosshairs"></i> RAYCASTER: STANDBY';
              raycastStatusEl.classList.remove('is-hit');
            }
          }
        }

        /* Viscous interpolation of the primary 3D raycast intersection point */
        uniforms.uMouse3D.value.lerp(targetMouse3D, 0.22);

        renderer.render(scene, camera);
      }

      animate();
    } catch (err) {
      console.error('[Carrd Mercury Hero Error]:', err);
      if (loaderTextEl) {
        loaderTextEl.textContent = 'WEBGL INITIALIZATION ERROR — CHECK CONSOLE';
      }
    }
  }

  /* Carrd DOM Lifecycle Wrapper */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
</script>
