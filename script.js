 /* ==========================================================================
  * kr10o/carrd-threejs - script.js
  * Served via: https://cdn.jsdelivr.net/gh/kr10o/carrd-threejs@main/script.js
  * Features:
  *   - PURGE CACHE.ps1: Invoke-RestMethod "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/tshirt.glb"; Invoke-RestMethod "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/script.js"; Invoke-RestMethod "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/style.css";
  * ========================================================================== */
  (function () {
    'use strict';

    const CDN_LIBS = {
      THREE: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
      DRACO_LOADER: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js',
      GLTF_LOADER: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
      DRACO_WASM_DIR: 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    };

    function loadCdnScript(url) {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${url}"]`);
        if (existing) {
          if (existing.getAttribute('data-loaded') === '1') return resolve();
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', reject);
          return;
        }
        const s = document.createElement('script');
        s.src = url;
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.onload = () => {
          s.setAttribute('data-loaded', '1');
          resolve();
        };
        s.onerror = () => reject(new Error(`Failed to load CDN script: ${url}`));
        document.head.appendChild(s);
      });
    }

    async function loadThreeAndLoaders() {
      if (!window.THREE || !window.THREE.WebGLRenderer) {
        await loadCdnScript(CDN_LIBS.THREE);
      }
      if (!window.THREE.DRACOLoader) {
        await loadCdnScript(CDN_LIBS.DRACO_LOADER);
      }
      if (!window.THREE.GLTFLoader) {
        await loadCdnScript(CDN_LIBS.GLTF_LOADER);
      }
      return window.THREE;
    }

    /* ==========================================================================
     * 1. PROCEDURAL COTTON JERSEY WEAVE & ROUGH WHITE PLASTER TEXTURE GENERATORS
     * ========================================================================== */
    function createCottonJerseyTextures(THREE, maxAnisotropy) {
      const size = 256;

      const normCanvas = document.createElement('canvas');
      normCanvas.width = size;
      normCanvas.height = size;
      const nCtx = normCanvas.getContext('2d');
      const nImg = nCtx.createImageData(size, size);
      const nData = nImg.data;

      const roughCanvas = document.createElement('canvas');
      roughCanvas.width = size;
      roughCanvas.height = size;
      const rCtx = roughCanvas.getContext('2d');
      const rImg = rCtx.createImageData(size, size);
      const rData = rImg.data;

      const twoPi = Math.PI * 2;
      const freqX = 32;
      const freqY = 48;

      for (let y = 0; y < size; y++) {
        const v = y / size;
        for (let x = 0; x < size; x++) {
          const u = x / size;
          const idx = (y * size + x) * 4;

          const walePhase = u * freqX * twoPi;
          const vChev = Math.abs(((u * freqX) % 1) - 0.5) * 1.65;
          const coursePhase = (v * freqY + vChev) * twoPi;

          const nx = Math.cos(walePhase) * 0.45 + Math.sin(coursePhase) * 0.20;
          const ny = Math.cos(coursePhase) * 0.48;
          const nz = 1.0;
          const invLen = 1.0 / Math.hypot(nx, ny, nz);

          const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const grain = (hash - Math.floor(hash) - 0.5) * 10;

          nData[idx]     = Math.min(255, Math.max(0, Math.round((nx * invLen * 0.5 + 0.5) * 255 + grain)));
          nData[idx + 1] = Math.min(255, Math.max(0, Math.round((ny * invLen * 0.5 + 0.5) * 255 + grain)));
          nData[idx + 2] = Math.round((nz * invLen * 0.5 + 0.5) * 255);
          nData[idx + 3] = 255;

          const stitchDepth = (Math.sin(walePhase) * Math.sin(coursePhase)) * 18;
          const rVal = Math.min(255, Math.max(180, Math.round(218 - stitchDepth + grain)));
          rData[idx] = rData[idx + 1] = rData[idx + 2] = rVal;
          rData[idx + 3] = 255;
        }
      }

      nCtx.putImageData(nImg, 0, 0);
      rCtx.putImageData(rImg, 0, 0);

      const normalMap = new THREE.CanvasTexture(normCanvas);
      normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
      normalMap.repeat.set(22, 26);
      normalMap.anisotropy = maxAnisotropy;

      const roughnessMap = new THREE.CanvasTexture(roughCanvas);
      roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
      roughnessMap.repeat.set(22, 26);
      roughnessMap.anisotropy = maxAnisotropy;

      return { normalMap, roughnessMap };
    }

    /* Synthesizes a coarse architectural mineral plaster / stucco normal & roughness map */
    function createRoughPlasterTextures(THREE, maxAnisotropy) {
      const size = 256;
      const heightField = new Float32Array(size * size);

      const twoPi = Math.PI * 2;
      for (let y = 0; y < size; y++) {
        const ny = y / size;
        for (let x = 0; x < size; x++) {
          const nx = x / size;

          /* Multi-octave tileable trowel waves + coarse mineral aggregate grit */
          const trowel =
            Math.sin(nx * twoPi * 3.0 + Math.cos(ny * twoPi * 2.0) * 1.4) * 0.35 +
            Math.cos(ny * twoPi * 5.0 - Math.sin(nx * twoPi * 4.0) * 1.2) * 0.25 +
            Math.sin((nx + ny) * twoPi * 9.0) * 0.15;

          const h1 = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
          const gritFine = (h1 - Math.floor(h1)) - 0.5;

          const gx = Math.floor(x * 0.5);
          const gy = Math.floor(y * 0.5);
          const h2 = Math.sin(gx * 269.5 + gy * 183.3) * 43758.5453;
          const gritCoarse = (h2 - Math.floor(h2)) - 0.5;

          /* Pitted stucco pores */
          const pore = gritCoarse < -0.32 ? -0.45 : 0.0;

          heightField[y * size + x] = trowel + gritCoarse * 0.55 + gritFine * 0.38 + pore;
        }
      }

      const normCanvas = document.createElement('canvas');
      normCanvas.width = size;
      normCanvas.height = size;
      const nCtx = normCanvas.getContext('2d');
      const nImg = nCtx.createImageData(size, size);
      const nData = nImg.data;

      const roughCanvas = document.createElement('canvas');
      roughCanvas.width = size;
      roughCanvas.height = size;
      const rCtx = roughCanvas.getContext('2d');
      const rImg = rCtx.createImageData(size, size);
      const rData = rImg.data;

      const bumpStrength = 2.65;

      for (let y = 0; y < size; y++) {
        const yU = (y - 1 + size) % size;
        const yD = (y + 1) % size;
        for (let x = 0; x < size; x++) {
          const xL = (x - 1 + size) % size;
          const xR = (x + 1) % size;
          const idx = (y * size + x) * 4;

          const dX = (heightField[y * size + xL] - heightField[y * size + xR]) * bumpStrength;
          const dY = (heightField[yU * size + x] - heightField[yD * size + x]) * bumpStrength;
          const dZ = 1.0;
          const inv = 1.0 / Math.hypot(dX, dY, dZ);

          nData[idx]     = Math.min(255, Math.max(0, Math.round((dX * inv * 0.5 + 0.5) * 255)));
          nData[idx + 1] = Math.min(255, Math.max(0, Math.round((dY * inv * 0.5 + 0.5) * 255)));
          nData[idx + 2] = Math.round((dZ * inv * 0.5 + 0.5) * 255);
          nData[idx + 3] = 255;

          const hVal = heightField[y * size + x];
          const rVal = Math.min(255, Math.max(210, Math.round(242 - hVal * 16)));
          rData[idx] = rData[idx + 1] = rData[idx + 2] = rVal;
          rData[idx + 3] = 255;
        }
      }

      nCtx.putImageData(nImg, 0, 0);
      rCtx.putImageData(rImg, 0, 0);

      const normalMap = new THREE.CanvasTexture(normCanvas);
      normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
      normalMap.repeat.set(9, 7);
      normalMap.anisotropy = maxAnisotropy;

      const roughnessMap = new THREE.CanvasTexture(roughCanvas);
      roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
      roughnessMap.repeat.set(9, 7);
      roughnessMap.anisotropy = maxAnisotropy;

      return { normalMap, roughnessMap };
    }

    function createEmptyFallbackTexture(THREE) {
      const data = new Uint8Array([0, 0, 0, 0]);
      const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
      tex.needsUpdate = true;
      return tex;
    }

    /* ==========================================================================
     * 2. IMPORTED .GLB CANONICAL NORMALIZER (STRIPS ANY HANGER NODES)
     * ========================================================================== */
    function prepareImportedGlbScene(THREE, gltfScene, torsoMaterial) {
      const wrapper = new THREE.Group();
      gltfScene.updateMatrixWorld(true);

      const rootInverse = new THREE.Matrix4().copy(gltfScene.matrixWorld).invert();
      const fabricGeometries = [];
      const fabricMeshes = [];

      gltfScene.traverse((child) => {
        if (!child.isMesh || !child.geometry) return;

        /* Strictly ignore/strip any metal hanger, hook, rod, or clip meshes in the .glb */
        const nameLower = ((child.name || '') + ' ' + (child.material && child.material.name ? child.material.name : '')).toLowerCase();
        if (/hanger|hook|rod|metal|chrome|wire|clip|stand/.test(nameLower)) {
          return;
        }

        const geom = child.geometry.clone();
        const relMatrix = new THREE.Matrix4().multiplyMatrices(rootInverse, child.matrixWorld);
        geom.applyMatrix4(relMatrix);

        let targetMat = torsoMaterial;
        if (child.material && child.material.aoMap) {
          targetMat = torsoMaterial.clone();
          targetMat.aoMap = child.material.aoMap;
          targetMat.aoMapIntensity = child.material.aoMapIntensity || 1.0;
          targetMat.onBeforeCompile = torsoMaterial.onBeforeCompile;
        }

        const fabMesh = new THREE.Mesh(geom, targetMat);
        fabMesh.castShadow = true;
        fabMesh.receiveShadow = true;
        fabricGeometries.push(geom);
        fabricMeshes.push(fabMesh);
      });

      if (fabricGeometries.length === 0) {
        throw new Error('No garment mesh found in .glb');
      }

      const combinedBox = new THREE.Box3();
      fabricGeometries.forEach((g) => {
        g.computeBoundingBox();
        combinedBox.union(g.boundingBox);
      });

      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      combinedBox.getCenter(center);
      combinedBox.getSize(size);

      const maxSpan = Math.max(size.y, size.x * 0.85, 0.001);
      const normScale = 3.10 / maxSpan;
      const targetCenterY = -0.10;

      const normalizeMatrix = new THREE.Matrix4()
        .makeTranslation(0, targetCenterY, 0)
        .multiply(new THREE.Matrix4().makeScale(normScale, normScale, normScale))
        .multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

      fabricMeshes.forEach((mesh) => {
        const g = mesh.geometry;
        g.applyMatrix4(normalizeMatrix);

        if (!g.attributes.normal) {
          g.computeVertexNormals();
        } else {
          g.normalizeNormals();
        }

        if (!g.attributes.uv) {
          const pos = g.attributes.position;
          const uvs = new Float32Array(pos.count * 2);
          for (let i = 0; i < pos.count; i++) {
            const px = pos.getX(i);
            const py = pos.getY(i);
            const pz = pos.getZ(i);
            const u = (Math.atan2(px, pz) / (Math.PI * 2)) + 0.5;
            const v = (py + 1.68) / 3.10;
            uvs[i * 2] = u * 2.0;
            uvs[i * 2 + 1] = v;
          }
          g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        }

        g.computeBoundingBox();
        g.computeBoundingSphere();
        wrapper.add(mesh);
      });

      return wrapper;
    }

    /* ==========================================================================
     * 3. PROCEDURAL FALLBACK HEAVYWEIGHT T-SHIRT (HANGER-FREE)
     * ========================================================================== */
    function buildProceduralFallbackTShirt(THREE, torsoMaterial, sleeveMaterial, collarMaterial) {
      const group = new THREE.Group();

      function evaluateTorsoPoint(u, v, isFront) {
        const absU = Math.abs(u);
        const halfWidth = 1.24 + 0.14 * Math.pow(v, 1.35) - 0.04 * Math.sin(v * Math.PI);
        const neckRadiusU = 0.40;
        let shoulderDrop = 0.0;
        if (absU > neckRadiusU) {
          const tShoulder = (absU - neckRadiusU) / (1.0 - neckRadiusU);
          shoulderDrop = -0.34 * Math.pow(tShoulder, 1.15);
        }

        let neckScoop = 0.0;
        if (absU < neckRadiusU) {
          const tNeck = 1.0 - Math.pow(absU / neckRadiusU, 2.0);
          neckScoop = (isFront ? -0.38 : -0.11) * tNeck * Math.pow(v, 3.5);
        }

        const x = u * halfWidth;
        const baseHeight = -1.68 + v * 3.10;
        const y = baseHeight + shoulderDrop * Math.pow(v, 2.2) + neckScoop;

        const edgeArch = Math.sqrt(Math.max(0.0, 1.0 - u * u * 0.92));
        const chestContour = isFront
          ? (0.34 + 0.09 * Math.sin(v * Math.PI * 0.85))
          : (0.30 + 0.07 * Math.sin(v * Math.PI * 0.88));

        const foldPrimary = Math.sin((u * 5.8) + (isFront ? 0.25 : -0.35)) * 0.028 * (1.0 - v * 0.35);
        const foldSecondary = Math.cos(u * 12.0 - v * 2.4) * 0.014 * (1.0 - v * 0.25);
        const panelRipple = Math.sin(u * 8.5 + v * 3.0) * 0.011 * Math.sin(v * Math.PI);
        const catenary = isFront
          ? -0.026 * Math.exp(-Math.pow(u * 2.2, 2.0)) * Math.sin(v * Math.PI)
          : 0.024 * Math.exp(-Math.pow(u * 2.0, 2.0)) * Math.sin(v * Math.PI);

        const dir = isFront ? 1.0 : -1.0;
        const z = dir * (edgeArch * chestContour) + foldPrimary + foldSecondary + panelRipple + catenary;

        return new THREE.Vector3(x, y, z);
      }

      const segTheta = 128;
      const segV = 84;
      const torsoPositions = [];
      const torsoUvs = [];
      const torsoIndices = [];

      for (let j = 0; j <= segV; j++) {
        const v = j / segV;
        for (let i = 0; i <= segTheta; i++) {
          const theta = (i / segTheta) * Math.PI * 2;
          const u = Math.cos(theta);
          const sinT = Math.sin(theta);

          const ptFront = evaluateTorsoPoint(u, v, true);
          const ptBack = evaluateTorsoPoint(u, v, false);

          const blend = sinT * 0.5 + 0.5;
          const smoothBlend = blend * blend * (3.0 - 2.0 * blend);

          const x = ptBack.x + (ptFront.x - ptBack.x) * smoothBlend;
          const y = ptBack.y + (ptFront.y - ptBack.y) * smoothBlend;
          const z = ptBack.z + (ptFront.z - ptBack.z) * smoothBlend;

          torsoPositions.push(x, y, z);
          torsoUvs.push((i / segTheta) * 2.0, v);
        }
      }

      for (let j = 0; j < segV; j++) {
        for (let i = 0; i < segTheta; i++) {
          const a = j * (segTheta + 1) + i;
          const b = a + 1;
          const c = (j + 1) * (segTheta + 1) + i;
          const d = c + 1;
          torsoIndices.push(a, b, d, a, d, c);
        }
      }

      const torsoGeo = new THREE.BufferGeometry();
      torsoGeo.setIndex(torsoIndices);
      torsoGeo.setAttribute('position', new THREE.Float32BufferAttribute(torsoPositions, 3));
      torsoGeo.setAttribute('uv', new THREE.Float32BufferAttribute(torsoUvs, 2));
      torsoGeo.computeVertexNormals();

      const torsoMesh = new THREE.Mesh(torsoGeo, torsoMaterial);
      torsoMesh.castShadow = true;
      torsoMesh.receiveShadow = true;
      group.add(torsoMesh);

      function buildSleeveGeometry(sideSign) {
        const sU = 40;
        const sV = 36;
        const positions = [];
        const uvs = [];
        const indices = [];

        const rootX = sideSign * 1.26;
        const rootY = 0.84;
        const sleeveLen = 1.08;
        const angle = sideSign * (-0.64);
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        for (let j = 0; j <= sV; j++) {
          const t = j / sV;
          const dist = t * sleeveLen;
          const radiusY = 0.44 * (1.0 - t * 0.16);
          const radiusZ = 0.30 * (1.0 - t * 0.12);

          const spineX = rootX + sideSign * dist * Math.cos(0.64);
          const spineY = rootY - dist * Math.sin(0.64) - 0.04 * Math.sin(t * Math.PI);

          for (let i = 0; i <= sU; i++) {
            const phi = (i / sU) * Math.PI * 2;
            const localY = Math.cos(phi) * radiusY;
            const localZ = Math.sin(phi) * radiusZ;
            const crease = Math.sin(t * Math.PI * 2.0 + phi * 2.0) * 0.015 * t;

            const wx = spineX - localY * sinA;
            const wy = spineY + localY * cosA;
            const wz = localZ + crease;

            positions.push(wx, wy, wz);
            uvs.push(i / sU, t * 0.6);
          }
        }

        for (let j = 0; j < sV; j++) {
          for (let i = 0; i < sU; i++) {
            const a = j * (sU + 1) + i;
            const b = a + 1;
            const c = (j + 1) * (sU + 1) + i;
            const d = c + 1;
            indices.push(a, b, d, a, d, c);
          }
        }

        const geo = new THREE.BufferGeometry();
        geo.setIndex(indices);
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geo.computeVertexNormals();
        return geo;
      }

      const leftSleeve = new THREE.Mesh(buildSleeveGeometry(-1), sleeveMaterial);
      leftSleeve.castShadow = true;
      leftSleeve.receiveShadow = true;
      group.add(leftSleeve);

      const rightSleeve = new THREE.Mesh(buildSleeveGeometry(1), sleeveMaterial);
      rightSleeve.castShadow = true;
      rightSleeve.receiveShadow = true;
      group.add(rightSleeve);

      const collarSegs = 72;
      const tubeSegs = 20;
      const collarPos = [];
      const collarUvs = [];
      const collarIdx = [];
      const tubeRadius = 0.068;

      for (let i = 0; i <= collarSegs; i++) {
        const theta = (i / collarSegs) * Math.PI * 2;
        const u = Math.cos(theta) * 0.40;
        const sinT = Math.sin(theta);

        const frontNeck = evaluateTorsoPoint(u, 1.0, true);
        const backNeck = evaluateTorsoPoint(u, 1.0, false);
        const blend = sinT * 0.5 + 0.5;
        const smooth = blend * blend * (3.0 - 2.0 * blend);

        const cx = backNeck.x + (frontNeck.x - backNeck.x) * smooth;
        const cy = backNeck.y + (frontNeck.y - backNeck.y) * smooth + 0.025;
        const cz = (frontNeck.z * 0.72) * sinT;

        const radDirX = Math.cos(theta);
        const radDirZ = Math.sin(theta);

        for (let j = 0; j <= tubeSegs; j++) {
          const psi = (j / tubeSegs) * Math.PI * 2;
          const cosP = Math.cos(psi);
          const sinP = Math.sin(psi);

          const px = cx + radDirX * cosP * tubeRadius * 0.85;
          const py = cy + sinP * tubeRadius * 1.25;
          const pz = cz + radDirZ * cosP * tubeRadius * 0.85;

          collarPos.push(px, py, pz);
          collarUvs.push((i / collarSegs) * 6.0, j / tubeSegs);
        }
      }

      for (let i = 0; i < collarSegs; i++) {
        for (let j = 0; j < tubeSegs; j++) {
          const a = i * (tubeSegs + 1) + j;
          const b = a + 1;
          const c = (i + 1) * (tubeSegs + 1) + j;
          const d = c + 1;
          collarIdx.push(a, b, d, a, d, c);
        }
      }

      const collarGeo = new THREE.BufferGeometry();
      collarGeo.setIndex(collarIdx);
      collarGeo.setAttribute('position', new THREE.Float32BufferAttribute(collarPos, 3));
      collarGeo.setAttribute('uv', new THREE.Float32BufferAttribute(collarUvs, 2));
      collarGeo.computeVertexNormals();

      const collarMesh = new THREE.Mesh(collarGeo, collarMaterial);
      collarMesh.castShadow = true;
      collarMesh.receiveShadow = true;
      group.add(collarMesh);

      return group;
    }

    /* ==========================================================================
     * 4. GOLDEN-ANGLE VOGEL-DISK BOKEH DEPTH OF FIELD SHADERS
     * ========================================================================== */
    const DOF_VERTEX_SHADER = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

    const DOF_FRAGMENT_SHADER = `
      uniform sampler2D tColor;
      uniform sampler2D tDepth;
      uniform vec2 uResolution;
      uniform float uCameraNear;
      uniform float uCameraFar;
      uniform float uFocusDistance;
      uniform float uFocalRange;
      uniform float uMaxBlurPx;

      varying vec2 vUv;

      /* Converts non-linear hardware depth buffer [0..1] to linear eye-space distance */
      float readLinearDepth(vec2 uv) {
        float z_b = texture2D(tDepth, uv).x;
        float z_n = 2.0 * z_b - 1.0;
        return (2.0 * uCameraNear * uCameraFar) / (uCameraFar + uCameraNear - z_n * (uCameraFar - uCameraNear));
      }

      /* Computes signed Circle of Confusion (CoC) in [0..1] */
      float computeCoC(float linearDepth) {
        float diff = abs(linearDepth - uFocusDistance);
        return clamp((diff - uFocalRange * 0.35) / (uFocalRange * 1.65), 0.0, 1.0);
      }

      void main() {
        vec4 baseColor = texture2D(tColor, vUv);
        float centerDepth = readLinearDepth(vUv);
        float centerCoC = computeCoC(centerDepth);

        if (centerCoC < 0.015) {
          gl_FragColor = baseColor;
          return;
        }

        vec2 texel = 1.0 / uResolution;
        float blurRadius = centerCoC * uMaxBlurPx;

        /* Per-pixel spatial hash rotation to eliminate bokeh ring banding */
        float hashAngle = fract(sin(dot(vUv * uResolution, vec2(12.9898, 78.233))) * 43758.5453) * 6.2831853;

        vec3 accumColor = baseColor.rgb;
        float accumWeight = 1.0;

        /* 28-Tap Golden-Angle Spiral Vogel Disk Bokeh Kernel */
        const int SAMPLES = 28;
        const float GOLDEN_ANGLE = 2.39996323;

        for (int i = 1; i <= SAMPLES; i++) {
          float fi = float(i);
          float r = sqrt(fi / float(SAMPLES)) * blurRadius;
          float theta = fi * GOLDEN_ANGLE + hashAngle;

          vec2 offset = vec2(cos(theta), sin(theta)) * r * texel;
          vec2 sampleUv = clamp(vUv + offset, 0.001, 0.999);

          vec3 sColor = texture2D(tColor, sampleUv).rgb;
          float sDepth = readLinearDepth(sampleUv);
          float sCoC = computeCoC(sDepth);

          /* Prevent sharp foreground T-shirt edges from halo-bleeding into background blur */
          float depthGuard = (sDepth < centerDepth - 0.25) ? sCoC : 1.0;
          /* Boost bright morning sun highlights inside bokeh discs */
          float luma = dot(sColor, vec3(0.299, 0.587, 0.114));
          float bokehHighlight = 1.0 + smoothstep(0.65, 1.0, luma) * 0.45 * centerCoC;

          float weight = max(sCoC, 0.15) * depthGuard * bokehHighlight;
          accumColor += sColor * weight;
          accumWeight += weight;
        }

        vec3 finalRgb = accumColor / max(accumWeight, 0.001);
        gl_FragColor = vec4(finalRgb, 1.0);
      }
    `;

    /* ==========================================================================
     * 5. SCENE INITIALIZATION, LIGHTING, DOF TARGET & ANIMATION LOOP
     * ========================================================================== */
    async function initApp() {
      const rootEl = document.getElementById('carrd-app-root');
      const stageEl = document.getElementById('tshirt-canvas-stage');
      if (!rootEl || !stageEl) return;

      try {
        const THREE = await loadThreeAndLoaders();

        const rect = stageEl.getBoundingClientRect();
        const initW = Math.max(rect.width, 320);
        const initH = Math.max(rect.height, 320);
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false
        });
        renderer.setPixelRatio(dpr);
        renderer.setSize(initW, initH);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        /* Brightened high-key morning studio exposure */
        renderer.toneMappingExposure = 1.32;
        stageEl.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        /* Warm almost-white morning studio atmosphere */
        scene.background = new THREE.Color(0xeeece6);
        scene.fog = new THREE.FogExp2(0xeeece6, 0.024);

        const camera = new THREE.PerspectiveCamera(34, initW / initH, 0.5, 28);

        /* 1. Synthesize Cotton Jersey Knit & Rough Almost-White Plaster Textures */
        const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
        const { normalMap: cottonNormalMap, roughnessMap: cottonRoughnessMap } = createCottonJerseyTextures(THREE, maxAniso);
        const { normalMap: plasterNormalMap, roughnessMap: plasterRoughnessMap } = createRoughPlasterTextures(THREE, maxAniso);
        const emptyLogoTex = createEmptyFallbackTexture(THREE);

        const glbUrlAttr = (rootEl.getAttribute('data-glb-url') || '').trim();

        const frontUrlAttr = (
          rootEl.getAttribute('data-logo-front') ||
          rootEl.getAttribute('data-logo-url') ||
          ''
        ).trim();
        const frontScaleAttr = parseFloat(
          rootEl.getAttribute('data-logo-front-scale') ||
          rootEl.getAttribute('data-logo-scale')
        );
        const frontXAttr = parseFloat(rootEl.getAttribute('data-logo-front-x'));
        const frontYAttr = parseFloat(
          rootEl.getAttribute('data-logo-front-y') ||
          rootEl.getAttribute('data-logo-y')
        );

        const initFrontScale = !isNaN(frontScaleAttr) ? frontScaleAttr : 0.34;
        const initFrontX = !isNaN(frontXAttr) ? frontXAttr : 0.42;
        const initFrontY = !isNaN(frontYAttr) ? frontYAttr : 0.46;

        const backUrlAttr = (rootEl.getAttribute('data-logo-back') || '').trim();
        const backScaleAttr = parseFloat(rootEl.getAttribute('data-logo-back-scale'));
        const backXAttr = parseFloat(rootEl.getAttribute('data-logo-back-x'));
        const backYAttr = parseFloat(rootEl.getAttribute('data-logo-back-y'));

        const initBackScale = !isNaN(backScaleAttr) ? backScaleAttr : 1.18;
        const initBackX = !isNaN(backXAttr) ? backXAttr : 0.0;
        const initBackY = !isNaN(backYAttr) ? backYAttr : 0.18;

        const shirtUniforms = {
          uTime: { value: 0.0 },
          uFrontLogoMap: { value: emptyLogoTex },
          uHasFrontLogo: { value: 0.0 },
          uFrontOffset: { value: new THREE.Vector2(initFrontX, initFrontY) },
          uFrontScale: { value: new THREE.Vector2(initFrontScale, initFrontScale) },
          uFrontTexel: { value: new THREE.Vector2(1.0 / 512.0, 1.0 / 512.0) },
          uBackLogoMap: { value: emptyLogoTex },
          uHasBackLogo: { value: 0.0 },
          uBackOffset: { value: new THREE.Vector2(initBackX, initBackY) },
          uBackScale: { value: new THREE.Vector2(initBackScale, initBackScale) },
          uBackTexel: { value: new THREE.Vector2(1.0 / 512.0, 1.0 / 512.0) },
          uPrintRoughness: { value: 0.40 },
          uPrintEmboss: { value: 0.98 },
          uKnitBleedThrough: { value: 0.64 }
        };

        function attachBaseCottonShader(material) {
          material.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = shirtUniforms.uTime;
            shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `
              #include <begin_vertex>
              float hemWeight = clamp((1.25 - position.y) * 0.38, 0.0, 1.0);
              float breeze = sin(uTime * 0.85 + position.x * 2.1 + position.y * 1.4) * 0.022 * hemWeight;
              transformed.z += breeze;
              transformed.x += cos(uTime * 0.65 + position.y * 1.8) * 0.008 * hemWeight;
              `
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <dithering_fragment>',
              `
              vec3 viewDir = normalize(vViewPosition);
              float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.2);
              gl_FragColor.rgb += vec3(0.22, 0.21, 0.19) * fresnel;
              #include <dithering_fragment>
              `
            );
          };
        }

        const torsoMaterial = new THREE.MeshStandardMaterial({
          color: 0x121317,
          roughness: 0.85,
          metalness: 0.04,
          normalMap: cottonNormalMap,
          normalScale: new THREE.Vector2(0.62, 0.62),
          roughnessMap: cottonRoughnessMap,
          side: THREE.DoubleSide
        });

        torsoMaterial.onBeforeCompile = (shader) => {
          Object.assign(shader.uniforms, shirtUniforms);

          shader.vertexShader = `
            uniform float uTime;
            uniform vec2 uFrontOffset;
            uniform vec2 uFrontScale;
            uniform vec2 uBackOffset;
            uniform vec2 uBackScale;
            varying vec2 vFrontLogoUv;
            varying vec2 vBackLogoUv;
            varying float vFrontMask;
            varying float vBackMask;
            varying vec3 vDecalTangent;
            varying vec3 vDecalBitangent;
          \n` + shader.vertexShader;

          shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            vFrontLogoUv = vec2(
              (position.x - uFrontOffset.x) / max(uFrontScale.x, 0.001) + 0.5,
              (position.y - uFrontOffset.y) / max(uFrontScale.y, 0.001) + 0.5
            );
            float torsoSpanMask = 1.0 - smoothstep(0.82, 0.98, abs(position.x));
            vFrontMask = smoothstep(-0.02, 0.08, position.z) * smoothstep(0.15, 0.42, objectNormal.z) * torsoSpanMask;

            vBackLogoUv = vec2(
              (-position.x - uBackOffset.x) / max(uBackScale.x, 0.001) + 0.5,
              (position.y - uBackOffset.y) / max(uBackScale.y, 0.001) + 0.5
            );
            vBackMask = smoothstep(-0.02, 0.08, -position.z) * smoothstep(0.15, 0.42, -objectNormal.z) * torsoSpanMask;

            float sideSign = objectNormal.z >= 0.0 ? 1.0 : -1.0;
            vDecalTangent = normalize(normalMatrix * vec3(sideSign, 0.0, 0.0));
            vDecalBitangent = normalize(normalMatrix * vec3(0.0, 1.0, 0.0));

            float hemWeight = clamp((1.35 - position.y) * 0.38, 0.06, 1.0);
            float panelWave = sin(uTime * 0.78 + position.x * 3.8 - position.y * 1.6) * 0.009;
            float breeze = sin(uTime * 0.85 + position.x * 2.1 + position.y * 1.4) * 0.022 * hemWeight + panelWave;
            transformed.z += breeze;
            transformed.x += cos(uTime * 0.65 + position.y * 1.8) * 0.008 * hemWeight;
            `
          );

          shader.fragmentShader = `
            uniform sampler2D uFrontLogoMap;
            uniform float uHasFrontLogo;
            uniform vec2 uFrontTexel;
            uniform sampler2D uBackLogoMap;
            uniform float uHasBackLogo;
            uniform vec2 uBackTexel;
            uniform float uPrintRoughness;
            uniform float uPrintEmboss;
            uniform float uKnitBleedThrough;
            varying vec2 vFrontLogoUv;
            varying vec2 vBackLogoUv;
            varying float vFrontMask;
            varying float vBackMask;
            varying vec3 vDecalTangent;
            varying vec3 vDecalBitangent;
          \n` + shader.fragmentShader;

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #include <map_fragment>
            float decalPrintAlpha = 0.0;
            bool isFrontDecalActive = false;
            bool isBackDecalActive = false;

            if (uHasFrontLogo > 0.5 && vFrontMask > 0.001) {
              if (vFrontLogoUv.x >= 0.0 && vFrontLogoUv.x <= 1.0 && vFrontLogoUv.y >= 0.0 && vFrontLogoUv.y <= 1.0) {
                isFrontDecalActive = true;
                vec4 frontTexel = texture2D(uFrontLogoMap, vFrontLogoUv);
                decalPrintAlpha = frontTexel.a * vFrontMask;
                vec3 linearFrontColor = pow(frontTexel.rgb, vec3(2.2));
                diffuseColor.rgb = mix(diffuseColor.rgb, linearFrontColor, decalPrintAlpha);
              }
            } else if (uHasBackLogo > 0.5 && vBackMask > 0.001) {
              if (vBackLogoUv.x >= 0.0 && vBackLogoUv.x <= 1.0 && vBackLogoUv.y >= 0.0 && vBackLogoUv.y <= 1.0) {
                isBackDecalActive = true;
                vec4 backTexel = texture2D(uBackLogoMap, vBackLogoUv);
                decalPrintAlpha = backTexel.a * vBackMask;
                vec3 linearBackColor = pow(backTexel.rgb, vec3(2.2));
                diffuseColor.rgb = mix(diffuseColor.rgb, linearBackColor, decalPrintAlpha);
              }
            }
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <roughnessmap_fragment>',
            `
            #include <roughnessmap_fragment>
            if (decalPrintAlpha > 0.001) {
              float knitMicroVariance = (roughnessFactor - roughness) * uKnitBleedThrough;
              float inkRoughness = clamp(uPrintRoughness + knitMicroVariance, 0.18, 0.92);
              roughnessFactor = mix(roughnessFactor, inkRoughness, decalPrintAlpha);
            }
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <normal_fragment_maps>',
            `
            vec3 baseGeoNormal = normal;
            #include <normal_fragment_maps>
            if (isFrontDecalActive || isBackDecalActive) {
              vec3 inkKnitNormal = normalize(mix(baseGeoNormal, normal, uKnitBleedThrough));
              normal = normalize(mix(normal, inkKnitNormal, decalPrintAlpha));

              vec4 sL; vec4 sR; vec4 sD; vec4 sU;
              float sideMask = 0.0;

              if (isFrontDecalActive) {
                sL = texture2D(uFrontLogoMap, vFrontLogoUv - vec2(uFrontTexel.x, 0.0));
                sR = texture2D(uFrontLogoMap, vFrontLogoUv + vec2(uFrontTexel.x, 0.0));
                sD = texture2D(uFrontLogoMap, vFrontLogoUv - vec2(0.0, uFrontTexel.y));
                sU = texture2D(uFrontLogoMap, vFrontLogoUv + vec2(0.0, uFrontTexel.y));
                sideMask = vFrontMask;
              } else {
                sL = texture2D(uBackLogoMap, vBackLogoUv - vec2(uBackTexel.x, 0.0));
                sR = texture2D(uBackLogoMap, vBackLogoUv + vec2(uBackTexel.x, 0.0));
                sD = texture2D(uBackLogoMap, vBackLogoUv - vec2(0.0, uBackTexel.y));
                sU = texture2D(uBackLogoMap, vBackLogoUv + vec2(0.0, uBackTexel.y));
                sideMask = vBackMask;
              }

              float hL = sL.a * (0.72 + 0.28 * dot(sL.rgb, vec3(0.299, 0.587, 0.114)));
              float hR = sR.a * (0.72 + 0.28 * dot(sR.rgb, vec3(0.299, 0.587, 0.114)));
              float hD = sD.a * (0.72 + 0.28 * dot(sD.rgb, vec3(0.299, 0.587, 0.114)));
              float hU = sU.a * (0.72 + 0.28 * dot(sU.rgb, vec3(0.299, 0.587, 0.114)));

              float bevelX = (hL - hR) * uPrintEmboss * sideMask;
              float bevelY = (hD - hU) * uPrintEmboss * sideMask;

              normal = normalize(normal + vDecalTangent * bevelX + vDecalBitangent * bevelY);
            }
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.2);
            vec3 cottonSheen = vec3(0.22, 0.21, 0.19) * fresnel * (1.0 - decalPrintAlpha * 0.78);
            gl_FragColor.rgb += cottonSheen;
            #include <dithering_fragment>
            `
          );
        };

        const sleeveMaterial = new THREE.MeshStandardMaterial({
          color: 0x121317,
          roughness: 0.85,
          metalness: 0.04,
          normalMap: cottonNormalMap,
          normalScale: new THREE.Vector2(0.62, 0.62),
          roughnessMap: cottonRoughnessMap,
          side: THREE.DoubleSide
        });
        attachBaseCottonShader(sleeveMaterial);

        const collarMaterial = sleeveMaterial.clone();
        collarMaterial.normalScale = new THREE.Vector2(0.88, 0.88);
        attachBaseCottonShader(collarMaterial);

        /* 2. Asynchronous Front & Back PNG Loader */
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');

        function loadDecalSide(side, url, options = {}) {
          const isFront = side === 'front';
          const mapUniform   = isFront ? shirtUniforms.uFrontLogoMap : shirtUniforms.uBackLogoMap;
          const flagUniform  = isFront ? shirtUniforms.uHasFrontLogo : shirtUniforms.uHasBackLogo;
          const scaleUniform = isFront ? shirtUniforms.uFrontScale   : shirtUniforms.uBackScale;
          const offUniform   = isFront ? shirtUniforms.uFrontOffset  : shirtUniforms.uBackOffset;
          const texelUniform = isFront ? shirtUniforms.uFrontTexel   : shirtUniforms.uBackTexel;

          const targetScaleW = options.scale !== undefined ? options.scale : scaleUniform.value.x;
          if (options.offsetX !== undefined) offUniform.value.x = options.offsetX;
          if (options.offsetY !== undefined) offUniform.value.y = options.offsetY;

          if (!url || typeof url !== 'string' || url.trim() === '') {
            flagUniform.value = 0.0;
            mapUniform.value = emptyLogoTex;
            return;
          }

          textureLoader.load(
            url.trim(),
            (tex) => {
              tex.anisotropy = maxAniso;
              tex.minFilter = THREE.LinearMipmapLinearFilter;
              tex.magFilter = THREE.LinearFilter;
              tex.wrapS = THREE.ClampToEdgeWrapping;
              tex.wrapT = THREE.ClampToEdgeWrapping;
              tex.needsUpdate = true;

              const imgW = (tex.image && (tex.image.naturalWidth || tex.image.width)) || 512;
              const imgH = (tex.image && (tex.image.naturalHeight || tex.image.height)) || 512;
              const aspect = imgW / Math.max(imgH, 1);

              scaleUniform.value.set(targetScaleW, targetScaleW / aspect);
              texelUniform.value.set(1.35 / imgW, 1.35 / imgH);
              mapUniform.value = tex;
              flagUniform.value = 1.0;
            },
            undefined,
            () => {
              flagUniform.value = 0.0;
            }
          );
        }

        if (frontUrlAttr) {
          loadDecalSide('front', frontUrlAttr, {
            scale: initFrontScale,
            offsetX: initFrontX,
            offsetY: initFrontY
          });
        }

        if (backUrlAttr) {
          loadDecalSide('back', backUrlAttr, {
            scale: initBackScale,
            offsetX: initBackX,
            offsetY: initBackY
          });
        }

        /* 3. Load Hanger-Free .GLB Garment (with Procedural Fallback) */
        const tshirtPivotGroup = new THREE.Group();
        tshirtPivotGroup.position.set(0, -0.05, 0.0);
        scene.add(tshirtPivotGroup);

        let activeGarmentNode = null;

        function mountGarmentNode(node) {
          if (activeGarmentNode) {
            tshirtPivotGroup.remove(activeGarmentNode);
          }
          activeGarmentNode = node;
          tshirtPivotGroup.add(node);
        }

        function loadTShirtGlbModel(glbUrl) {
          return new Promise((resolve) => {
            if (!glbUrl || typeof glbUrl !== 'string' || glbUrl.trim() === '') {
              const fallback = buildProceduralFallbackTShirt(THREE, torsoMaterial, sleeveMaterial, collarMaterial);
              mountGarmentNode(fallback);
              resolve({ source: 'procedural-fallback' });
              return;
            }

            const dracoLoader = new THREE.DRACOLoader();
            dracoLoader.setDecoderPath(CDN_LIBS.DRACO_WASM_DIR);
            dracoLoader.setDecoderConfig({ type: 'wasm' });

            const gltfLoader = new THREE.GLTFLoader();
            gltfLoader.setDRACOLoader(dracoLoader);
            gltfLoader.setCrossOrigin('anonymous');

            gltfLoader.load(
              glbUrl.trim(),
              (gltf) => {
                try {
                  const normalizedGlb = prepareImportedGlbScene(THREE, gltf.scene, torsoMaterial);
                  mountGarmentNode(normalizedGlb);
                  dracoLoader.dispose();
                  resolve({ source: 'glb', url: glbUrl });
                } catch (parseErr) {
                  console.warn('[GLB Normalization Fallback]:', parseErr);
                  const fallback = buildProceduralFallbackTShirt(THREE, torsoMaterial, sleeveMaterial, collarMaterial);
                  mountGarmentNode(fallback);
                  dracoLoader.dispose();
                  resolve({ source: 'procedural-fallback' });
                }
              },
              undefined,
              () => {
                const fallback = buildProceduralFallbackTShirt(THREE, torsoMaterial, sleeveMaterial, collarMaterial);
                mountGarmentNode(fallback);
                dracoLoader.dispose();
                resolve({ source: 'procedural-fallback' });
              }
            );
          });
        }

        await loadTShirtGlbModel(glbUrlAttr);

        window.loadTShirtGlb = loadTShirtGlbModel;
        window.setTShirtLogos = function (config = {}) {
          if (config.front !== undefined) {
            if (typeof config.front === 'string') loadDecalSide('front', config.front);
            else if (config.front) loadDecalSide('front', config.front.url, config.front);
          }
          if (config.back !== undefined) {
            if (typeof config.back === 'string') loadDecalSide('back', config.back);
            else if (config.back) loadDecalSide('back', config.back.url, config.back);
          }
        };
        window.setTShirtLogo = function (url, opts = {}) {
          loadDecalSide(opts.side === 'back' ? 'back' : 'front', url, opts);
        };

        /* 4. Rough Almost-White Plaster Architectural Room (Back Wall & Floor) */
        const plasterWallMaterial = new THREE.MeshStandardMaterial({
          color: 0xf4f2ed,
          roughness: 0.96,
          metalness: 0.0,
          normalMap: plasterNormalMap,
          normalScale: new THREE.Vector2(1.85, 1.85),
          roughnessMap: plasterRoughnessMap
        });

        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(34, 22), plasterWallMaterial);
        backWall.position.set(0, 1.2, -2.05);
        backWall.receiveShadow = true;
        scene.add(backWall);

        const floorPlane = new THREE.Mesh(new THREE.PlaneGeometry(34, 24), plasterWallMaterial);
        floorPlane.rotation.x = -Math.PI * 0.5;
        floorPlane.position.set(0, -2.10, 3.5);
        floorPlane.receiveShadow = true;
        scene.add(floorPlane);

        /* 5. High-Power Morning Sunlight & Bright Studio Fill Rig */
        const morningHemiLight = new THREE.HemisphereLight(0xffffff, 0xe6e2d8, 1.35);
        scene.add(morningHemiLight);

        /* Dedicated Front Studio Softbox Fill so black cotton weave pops cleanly */
        const studioKeyFill = new THREE.DirectionalLight(0xffffff, 1.45);
        studioKeyFill.position.set(1.8, 1.6, 6.5);
        scene.add(studioKeyFill);

        /* High-Power Golden Morning Sun Beam */
        const morningSunSpot = new THREE.SpotLight(0xfff1d6, 5.4);
        morningSunSpot.position.set(-5.2, 3.8, 5.8);
        morningSunSpot.target.position.set(0.3, -0.2, -1.8);
        morningSunSpot.angle = Math.PI / 3.8;
        morningSunSpot.penumbra = 0.42;
        morningSunSpot.decay = 1.15;
        morningSunSpot.distance = 28;
        morningSunSpot.castShadow = true;
        morningSunSpot.shadow.mapSize.width = 1024;
        morningSunSpot.shadow.mapSize.height = 1024;
        morningSunSpot.shadow.camera.near = 2.0;
        morningSunSpot.shadow.camera.far = 20.0;
        morningSunSpot.shadow.bias = -0.00035;
        scene.add(morningSunSpot);
        scene.add(morningSunSpot.target);

        /* Bright Morning Sky Rim SpotLight */
        const skyRimSpot = new THREE.SpotLight(0eef6ff, 3.1);
        skyRimSpot.position.set(5.4, 2.8, 4.4);
        skyRimSpot.target.position.set(-0.3, -0.1, -1.4);
        skyRimSpot.angle = Math.PI / 3.5;
        skyRimSpot.penumbra = 0.58;
        skyRimSpot.decay = 1.2;
        skyRimSpot.distance = 26;
        skyRimSpot.castShadow = true;
        skyRimSpot.shadow.mapSize.width = 1024;
        skyRimSpot.shadow.mapSize.height = 1024;
        skyRimSpot.shadow.camera.near = 2.0;
        skyRimSpot.shadow.camera.far = 20.0;
        skyRimSpot.shadow.bias = -0.00035;
        scene.add(skyRimSpot);
        scene.add(skyRimSpot.target);

        /* Offscreen Window Mullion Slats casting architectural sunbars onto the white plaster */
        const goboGroup = new THREE.Group();
        const slatMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        for (let i = -2; i <= 2; i++) {
          const slat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.2, 0.04), slatMat);
          slat.position.set(i * 0.78, 0, 0);
          slat.castShadow = true;
          goboGroup.add(slat);
        }
        goboGroup.position.set(-2.8, 2.1, 3.2);
        goboGroup.lookAt(morningSunSpot.position);
        scene.add(goboGroup);

        /* 6. Hardware DepthTexture FBO & Bokeh Depth-of-Field Post-Processing Setup */
        const rtW = Math.floor(initW * dpr);
        const rtH = Math.floor(initH * dpr);

        const depthTexture = new THREE.DepthTexture(rtW, rtH);
        depthTexture.type = THREE.UnsignedShortType;
        depthTexture.minFilter = THREE.NearestFilter;
        depthTexture.magFilter = THREE.NearestFilter;

        const renderTarget = new THREE.WebGLRenderTarget(rtW, rtH, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          depthBuffer: true,
          stencilBuffer: false,
          depthTexture: depthTexture
        });

        const postScene = new THREE.Scene();
        const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const dofUniforms = {
          tColor: { value: renderTarget.texture },
          tDepth: { value: renderTarget.depthTexture },
          uResolution: { value: new THREE.Vector2(rtW, rtH) },
          uCameraNear: { value: camera.near },
          uCameraFar: { value: camera.far },
          uFocusDistance: { value: 6.0 },
          uFocalRange: { value: 0.52 },
          uMaxBlurPx: { value: 18.0 * dpr }
        };

        const dofMaterial = new THREE.ShaderMaterial({
          vertexShader: DOF_VERTEX_SHADER,
          fragmentShader: DOF_FRAGMENT_SHADER,
          uniforms: dofUniforms,
          depthWrite: false,
          depthTest: false
        });

        const fullScreenQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), dofMaterial);
        postScene.add(fullScreenQuad);

        /* 7. Responsive Viewport & DoF FBO Resizing */
        let baseCamZ = 6.2;
        function updateViewportSize(width, height) {
          const aspect = width / Math.max(height, 1);
          camera.aspect = aspect;
          camera.updateProjectionMatrix();

          const targetSpan = 3.9;
          const vFovRad = (camera.fov * Math.PI) / 180;
          const requiredZ = (targetSpan / aspect) / (2 * Math.tan(vFovRad / 2));
          baseCamZ = Math.max(5.6, Math.min(requiredZ, 9.8));
        }

        updateViewportSize(initW, initH);

        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
              const curDpr = Math.min(window.devicePixelRatio || 1, 1.5);
              const wPx = Math.floor(width * curDpr);
              const hPx = Math.floor(height * curDpr);
              renderer.setSize(width, height);
              renderTarget.setSize(wPx, hPx);
              dofUniforms.uResolution.value.set(wPx, hPx);
              dofUniforms.uMaxBlurPx.value = 18.0 * curDpr;
              updateViewportSize(width, height);
            }
          }
        });
        resizeObserver.observe(stageEl);

        /* 8. Performance Guard: Pause WebGL when offscreen or tab hidden */
        let isVisible = true;
        const io = new IntersectionObserver((entries) => {
          isVisible = entries[0] ? entries[0].isIntersecting : true;
        }, { threshold: 0.01 });
        io.observe(rootEl);

        document.addEventListener('visibilitychange', () => {
          isVisible = document.visibilityState === 'visible';
        });

        /* 9. Synchronized Orbital Camera, Auto-Focus Lock & Showcase Turn Loop */
        rootEl.setAttribute('data-state', 'ready');
        const clock = new THREE.Clock();
        const focalTargetPoint = new THREE.Vector3();

        function evaluateShowcasePhase(timeSec) {
          const raw = 0.5 - 0.5 * Math.cos(timeSec * 0.24);
          const s1 = raw * raw * (3.0 - 2.0 * raw);
          return s1 * s1 * (3.0 - 2.0 * s1);
        }

        function animate() {
          requestAnimationFrame(animate);
          if (!isVisible) return;

          const t = clock.getElapsedTime();
          shirtUniforms.uTime.value = t;

          const backPhase = evaluateShowcasePhase(t);
          const frontPhase = 1.0 - backPhase;

          /* Floating invisible-mannequin rotation + gentle vertical breathing */
          const organicSway = Math.sin(t * 0.31) * 0.14 + Math.cos(t * 0.17) * 0.05;
          tshirtPivotGroup.rotation.y = backPhase * Math.PI + organicSway;
          tshirtPivotGroup.rotation.z = Math.sin(t * 0.21) * 0.012;
          tshirtPivotGroup.position.y = -0.05 + Math.sin(t * 0.42) * 0.035;

          const orbitAngle = Math.sin(t * 0.20) * 0.42 + frontPhase * 0.14;
          const radiusZ = baseCamZ - frontPhase * 0.38 + Math.cos(t * 0.18) * 0.28;

          const camX = Math.sin(orbitAngle) * radiusZ * 0.52;
          const camY = (0.18 * frontPhase + 0.04 * backPhase) + Math.sin(t * 0.16) * 0.22;
          const camZ = Math.cos(orbitAngle) * radiusZ;

          camera.position.set(camX, camY, camZ);

          const lookX = frontPhase * 0.16 + Math.sin(t * 0.15) * 0.08;
          const lookY = frontPhase * 0.18 + backPhase * 0.04 + Math.cos(t * 0.18) * 0.06;
          focalTargetPoint.set(lookX, lookY, 0.08);
          camera.lookAt(focalTargetPoint);

          /* Continuously lock Depth-of-Field focal plane onto the T-Shirt chest/back surface */
          dofUniforms.uFocusDistance.value = camera.position.distanceTo(focalTargetPoint);

          morningSunSpot.position.x = -5.2 + Math.sin(t * 0.11) * 0.65;
          morningSunSpot.position.y = 3.8 + Math.cos(t * 0.09) * 0.35;

          /* PASS 1: Render 3D Scene & Hardware Depth into Offscreen FBO */
          renderer.setRenderTarget(renderTarget);
          renderer.clear();
          renderer.render(scene, camera);

          /* PASS 2: Render Strong Golden-Angle Bokeh Depth of Field to Screen */
          renderer.setRenderTarget(null);
          renderer.render(postScene, postCamera);
        }

        animate();
      } catch (err) {
        console.error('[Carrd GLB T-Shirt Hero Error]:', err);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }
  })();
