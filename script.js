/* ==========================================================================
 * kr10o/carrd-threejs - script.js
 * Served via: https://cdn.jsdelivr.net/gh/kr10o/carrd-threejs@main/script.js
 * PURGE CACHE.ps1: Invoke-RestMethod "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/tshirt.glb"; Invoke-RestMethod "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/script.js"
 * ========================================================================== */
(function () {
  'use strict';

  const DEFAULT_GLB_URL = 'https://cdn.jsdelivr.net/gh/kr10o/carrd-threejs@main/tshirt.glb';

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
   * 1. PROCEDURAL COTTON JERSEY WEAVE NORMAL & ROUGHNESS MAP GENERATOR
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

  function createEmptyFallbackTexture(THREE) {
    const data = new Uint8Array([0, 0, 0, 0]);
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }

  function createNeutralNormalTexture(THREE) {
    const data = new Uint8Array([128, 128, 255, 255]);
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }

  function createStudioHangerGroup(THREE, topShoulderY) {
    const hangerGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x272a30,
      roughness: 0.32,
      metalness: 0.88
    });

    const barY = topShoulderY !== undefined ? topShoulderY : 1.26;

    const hangerBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 2.35, 16),
      metalMat
    );
    hangerBar.rotation.z = Math.PI * 0.5;
    hangerBar.position.set(0, barY, 0);
    hangerBar.castShadow = true;
    hangerGroup.add(hangerBar);

    const verticalRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 3.2, 12),
      metalMat
    );
    verticalRod.position.set(0, barY + 1.60, 0);
    verticalRod.castShadow = true;
    hangerGroup.add(verticalRod);

    return hangerGroup;
  }

  /* ==========================================================================
   * 2. REORIENTED NORMAL MAPPING (RNM) + DUAL DECAL SHADER FACTORY
   *    Uses non-destructive uMeshCenter & uMeshScale uniforms so raw .glb
   *    InterleavedBufferAttributes never need CPU cloning or mutation
   * ========================================================================== */
  function createGarmentShaderMaterial(THREE, baseConfig, sharedUniforms, perMeshOpts = {}) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x111216,
      roughness: 0.86,
      metalness: 0.04,
      normalMap: baseConfig.cottonNormalMap,
      normalScale: new THREE.Vector2(baseConfig.cottonScale, baseConfig.cottonScale),
      roughnessMap: baseConfig.cottonRoughnessMap,
      side: THREE.DoubleSide
    });

    /* Enable WebGL1 screen-space derivatives for cotangent frame normal mapping */
    mat.extensions = { derivatives: true };

    if (perMeshOpts.aoMap) {
      mat.aoMap = perMeshOpts.aoMap;
      mat.aoMapIntensity = perMeshOpts.aoMapIntensity !== undefined ? perMeshOpts.aoMapIntensity : 1.0;
    }

    const meshBakedNormalMap = perMeshOpts.bakedNormalMap || baseConfig.neutralNormalTex;
    const hasBakedNormalVal = perMeshOpts.bakedNormalMap ? 1.0 : 0.0;
    const meshBakedScale = perMeshOpts.bakedNormalScale || new THREE.Vector2(baseConfig.bakedNormalScale, baseConfig.bakedNormalScale);
    const meshCenter = perMeshOpts.meshCenter || new THREE.Vector3(0, 0, 0);
    const meshNormScale = perMeshOpts.meshNormScale !== undefined ? perMeshOpts.meshNormScale : 1.0;
    const invMeshScale = 1.0 / Math.max(meshNormScale, 0.0001);

    mat.customProgramCacheKey = function () {
      return hasBakedNormalVal > 0.5 ? 'garment-rnm-baked-v2' : 'garment-rnm-proc-v2';
    };

    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, sharedUniforms);
      shader.uniforms.uBakedNormalMap = { value: meshBakedNormalMap };
      shader.uniforms.uHasBakedNormal = { value: hasBakedNormalVal };
      shader.uniforms.uBakedNormalScale = { value: meshBakedScale };
      shader.uniforms.uCottonRepeat = { value: new THREE.Vector2(22.0, 26.0) };
      shader.uniforms.uMeshCenter = { value: meshCenter };
      shader.uniforms.uMeshNormScale = { value: meshNormScale };
      shader.uniforms.uInvMeshScale = { value: invMeshScale };

      shader.vertexShader = `
        uniform float uTime;
        uniform vec2 uFrontOffset;
        uniform vec2 uFrontScale;
        uniform vec2 uBackOffset;
        uniform vec2 uBackScale;
        uniform vec3 uMeshCenter;
        uniform float uMeshNormScale;
        uniform float uInvMeshScale;
        varying vec2 vRawUv;
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
        /* Map arbitrary .glb local coordinates into canonical [-1.55, +1.55] garment space */
        vec3 canonicalPos = (position - uMeshCenter) * uMeshNormScale;

        #ifdef USE_UV
          vRawUv = uv;
        #else
          vRawUv = vec2((atan(canonicalPos.x, canonicalPos.z) / 6.2831853) + 0.5, (canonicalPos.y + 1.55) / 3.10);
        #endif

        /* 1. Front Left-Chest Crest UV & Mask (Facing +Z) */
        vFrontLogoUv = vec2(
          (canonicalPos.x - uFrontOffset.x) / max(uFrontScale.x, 0.001) + 0.5,
          (canonicalPos.y - uFrontOffset.y) / max(uFrontScale.y, 0.001) + 0.5
        );
        float torsoSpanMask = 1.0 - smoothstep(0.82, 0.98, abs(canonicalPos.x));
        vFrontMask = smoothstep(-0.02, 0.08, canonicalPos.z) * smoothstep(0.15, 0.42, objectNormal.z) * torsoSpanMask;

        /* 2. Oversized Back Graphic UV & Mask (Facing -Z, horizontally inverted) */
        vBackLogoUv = vec2(
          (-canonicalPos.x - uBackOffset.x) / max(uBackScale.x, 0.001) + 0.5,
          (canonicalPos.y - uBackOffset.y) / max(uBackScale.y, 0.001) + 0.5
        );
        vBackMask = smoothstep(-0.02, 0.08, -canonicalPos.z) * smoothstep(0.15, 0.42, -objectNormal.z) * torsoSpanMask;

        /* 3. Side-Aware View-Space Tangent Frame for Ink-Edge Normal Embossing */
        float sideSign = objectNormal.z >= 0.0 ? 1.0 : -1.0;
        vDecalTangent = normalize(normalMatrix * vec3(sideSign, 0.0, 0.0));
        vDecalBitangent = normalize(normalMatrix * vec3(0.0, 1.0, 0.0));

        /* 4. Dynamic Morning Breeze Displacement (Scaled back to native mesh units) */
        float hemWeight = clamp((1.35 - canonicalPos.y) * 0.38, 0.06, 1.0);
        float panelWave = sin(uTime * 0.78 + canonicalPos.x * 3.8 - canonicalPos.y * 1.6) * 0.009;
        float breeze = sin(uTime * 0.85 + canonicalPos.x * 2.1 + canonicalPos.y * 1.4) * 0.022 * hemWeight + panelWave;
        transformed.z += breeze * uInvMeshScale;
        transformed.x += cos(uTime * 0.65 + canonicalPos.y * 1.8) * 0.008 * hemWeight * uInvMeshScale;
        `
      );

      shader.fragmentShader = `
        uniform sampler2D uBakedNormalMap;
        uniform float uHasBakedNormal;
        uniform vec2 uBakedNormalScale;
        uniform vec2 uCottonRepeat;
        uniform sampler2D uFrontLogoMap;
        uniform float uHasFrontLogo;
        uniform vec2 uFrontTexel;
        uniform sampler2D uBackLogoMap;
        uniform float uHasBackLogo;
        uniform vec2 uBackTexel;
        uniform float uPrintRoughness;
        uniform float uPrintEmboss;
        uniform float uKnitBleedThrough;
        varying vec2 vRawUv;
        varying vec2 vFrontLogoUv;
        varying vec2 vBackLogoUv;
        varying float vFrontMask;
        varying float vBackMask;
        varying vec3 vDecalTangent;
        varying vec3 vDecalBitangent;

        vec3 blendNormalsRNM(vec3 nMacro, vec3 nMicro) {
          vec3 t = nMacro + vec3(0.0, 0.0, 1.0);
          vec3 u = nMicro * vec3(-1.0, -1.0, 1.0);
          return normalize(t * dot(t, u) - u * t.z);
        }
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

        vec3 microKnitN = texture2D(normalMap, vRawUv * uCottonRepeat).xyz * 2.0 - 1.0;
        vec2 effectiveKnitScale = normalScale * mix(1.0, uKnitBleedThrough, decalPrintAlpha);
        microKnitN.xy *= effectiveKnitScale;
        microKnitN = normalize(microKnitN);

        if (uHasBakedNormal > 0.5) {
          vec3 macroBakedN = texture2D(uBakedNormalMap, vRawUv).xyz * 2.0 - 1.0;
          macroBakedN.xy *= uBakedNormalScale;
          macroBakedN = normalize(macroBakedN);

          vec3 combinedTangentN = blendNormalsRNM(macroBakedN, microKnitN);

          vec3 q0 = dFdx(-vViewPosition.xyz);
          vec3 q1 = dFdy(-vViewPosition.xyz);
          vec2 st0 = dFdx(vRawUv.st);
          vec2 st1 = dFdy(vRawUv.st);

          vec3 N = baseGeoNormal;
          vec3 q1perp = cross(q1, N);
          vec3 q0perp = cross(N, q0);
          vec3 T = q1perp * st0.x + q0perp * st1.x;
          vec3 B = q1perp * st0.y + q0perp * st1.y;

          float det = max(dot(T, T), dot(B, B));
          float scale = (det == 0.0) ? 0.0 : inversesqrt(det);
          normal = normalize(T * (combinedTangentN.x * scale * faceDirection) + B * (combinedTangentN.y * scale * faceDirection) + N * combinedTangentN.z);
        } else if (isFrontDecalActive || isBackDecalActive) {
          vec3 inkKnitNormal = normalize(mix(baseGeoNormal, normal, uKnitBleedThrough));
          normal = normalize(mix(normal, inkKnitNormal, decalPrintAlpha));
        }

        if (isFrontDecalActive || isBackDecalActive) {
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
          float hR = sR.a * (0.72 + 0.28 * dot(sL.rgb, vec3(0.299, 0.587, 0.114)));
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
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.4);
        vec3 cottonSheen = vec3(0.16, 0.15, 0.14) * fresnel * (1.0 - decalPrintAlpha * 0.78);
        gl_FragColor.rgb += cottonSheen;
        #include <dithering_fragment>
        `
      );
    };

    return mat;
  }

  /* ==========================================================================
   * 3. NON-DESTRUCTIVE .GLB SCENE NORMALIZER (Zero Buffer Mutation)
   *    Works with InterleavedBufferAttribute, Draco, and multi-node hierarchies
   * ========================================================================== */
  function prepareImportedGlbScene(THREE, gltfScene, baseShaderConfig, sharedUniforms, includeHanger, maxAniso) {
    const wrapper = new THREE.Group();
    gltfScene.updateMatrixWorld(true);

    /* Measure overall world-space Box3 of the imported .glb scene */
    const worldBox = new THREE.Box3().setFromObject(gltfScene);
    const worldCenter = new THREE.Vector3();
    const worldSize = new THREE.Vector3();
    worldBox.getCenter(worldCenter);
    worldBox.getSize(worldSize);

    const maxSpan = Math.max(worldSize.y, worldSize.x * 0.85, 0.001);
    const normScale = 3.10 / maxSpan;
    const targetCenterY = -0.13;

    /* Center and scale gltfScene via Object3D transforms without mutating BufferAttributes */
    gltfScene.scale.multiplyScalar(normScale);
    gltfScene.position.set(
      -worldCenter.x * normScale,
      targetCenterY - worldCenter.y * normScale,
      -worldCenter.z * normScale
    );
    gltfScene.updateMatrixWorld(true);

    let hasBuiltInHanger = false;
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x272a30,
      roughness: 0.32,
      metalness: 0.88
    });

    gltfScene.traverse((child) => {
      if (!child.isMesh || !child.geometry) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const srcMat = Array.isArray(child.material) ? child.material[0] : child.material;
      const nameLower = ((child.name || '') + ' ' + (srcMat && srcMat.name ? srcMat.name : '')).toLowerCase();
      const isHardware = /hanger|hook|rod|metal|chrome|wire|clip/.test(nameLower);

      if (isHardware) {
        hasBuiltInHanger = true;
        child.material = metalMat;
        return;
      }

      /* Compute local-space bounding box of this sub-mesh for canonical shader coordinates */
      if (!child.geometry.boundingBox) {
        child.geometry.computeBoundingBox();
      }
      const localBox = child.geometry.boundingBox;
      const localCenter = new THREE.Vector3();
      const localSize = new THREE.Vector3();
      localBox.getCenter(localCenter);
      localBox.getSize(localSize);
      const localMaxSpan = Math.max(localSize.y, localSize.x * 0.85, 0.001);
      const localNormScale = 3.10 / localMaxSpan;

      const perMeshOpts = {
        meshCenter: localCenter,
        meshNormScale: localNormScale
      };

      if (srcMat && srcMat.normalMap) {
        srcMat.normalMap.anisotropy = maxAniso;
        perMeshOpts.bakedNormalMap = srcMat.normalMap;
        const bScale = baseShaderConfig.bakedNormalScale;
        if (srcMat.normalScale) {
          perMeshOpts.bakedNormalScale = new THREE.Vector2(
            srcMat.normalScale.x * bScale,
            srcMat.normalScale.y * bScale
          );
        } else {
          perMeshOpts.bakedNormalScale = new THREE.Vector2(bScale, bScale);
        }
      }

      if (srcMat && srcMat.aoMap) {
        srcMat.aoMap.anisotropy = maxAniso;
        perMeshOpts.aoMap = srcMat.aoMap;
        perMeshOpts.aoMapIntensity = srcMat.aoMapIntensity !== undefined ? srcMat.aoMapIntensity : 1.0;
        if (child.geometry.attributes.uv && !child.geometry.attributes.uv2) {
          child.geometry.setAttribute('uv2', child.geometry.attributes.uv);
        }
      }

      child.material = createGarmentShaderMaterial(
        THREE,
        baseShaderConfig,
        sharedUniforms,
        perMeshOpts
      );
    });

    wrapper.add(gltfScene);

    if (includeHanger && !hasBuiltInHanger) {
      wrapper.add(createStudioHangerGroup(THREE, 1.26));
    }

    return wrapper;
  }

  /* ==========================================================================
   * 4. PROCEDURAL FALLBACK HEAVYWEIGHT T-SHIRT BUILDER
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
        torsoUvs.push(i / segTheta, v);
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

    group.add(createStudioHangerGroup(THREE, 1.26));
    return group;
  }

  /* ==========================================================================
   * 5. SCENE INITIALIZATION, GLTFLOADER + DRACOLOADER & ORBITAL CAMERA RIG
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
      renderer.toneMappingExposure = 1.08;
      stageEl.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b0c10);
      scene.fog = new THREE.FogExp2(0x0b0c10, 0.052);

      const camera = new THREE.PerspectiveCamera(34, initW / initH, 0.4, 35);

      const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
      const { normalMap, roughnessMap } = createCottonJerseyTextures(THREE, maxAniso);
      const emptyLogoTex = createEmptyFallbackTexture(THREE);
      const neutralNormalTex = createNeutralNormalTexture(THREE);

      /* Default directly to https://cdn.jsdelivr.net/gh/kr10o/carrd-threejs@main/tshirt.glb */
      const rawGlbAttr = rootEl.getAttribute('data-glb-url');
      const glbUrlToLoad = (rawGlbAttr && rawGlbAttr.trim() !== '')
        ? rawGlbAttr.trim()
        : DEFAULT_GLB_URL;

      const includeHangerAttr = (rootEl.getAttribute('data-glb-hanger') || 'auto').toLowerCase() !== 'none';
      const bakedNormalScaleAttr = parseFloat(rootEl.getAttribute('data-baked-normal-scale'));
      const cottonScaleAttr = parseFloat(rootEl.getAttribute('data-cotton-scale'));

      const baseShaderConfig = {
        cottonNormalMap: normalMap,
        cottonRoughnessMap: roughnessMap,
        neutralNormalTex: neutralNormalTex,
        bakedNormalScale: !isNaN(bakedNormalScaleAttr) ? bakedNormalScaleAttr : 1.0,
        cottonScale: !isNaN(cottonScaleAttr) ? cottonScaleAttr : 0.55
      };

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
        uPrintRoughness: { value: 0.42 },
        uPrintEmboss: { value: 0.95 },
        uKnitBleedThrough: { value: 0.64 }
      };

      const fallbackTorsoMaterial = createGarmentShaderMaterial(THREE, baseShaderConfig, shirtUniforms, {});
      const fallbackSleeveMaterial = createGarmentShaderMaterial(THREE, baseShaderConfig, shirtUniforms, {});
      const fallbackCollarMaterial = createGarmentShaderMaterial(
        THREE,
        Object.assign({}, baseShaderConfig, { cottonScale: 0.85 }),
        shirtUniforms,
        {}
      );

      /* Asynchronous Front & Back PNG Loader */
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

      /* GLTFLoader + DRACOLoader Pipeline */
      const tshirtPivotGroup = new THREE.Group();
      tshirtPivotGroup.position.set(0, -0.05, 0.05);
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
          if (!glbUrl || typeof glbUrl !== 'string' || glbUrl.trim() === '' || glbUrl === 'none') {
            const fallback = buildProceduralFallbackTShirt(
              THREE,
              fallbackTorsoMaterial,
              fallbackSleeveMaterial,
              fallbackCollarMaterial
            );
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
                const normalizedGlb = prepareImportedGlbScene(
                  THREE,
                  gltf.scene,
                  baseShaderConfig,
                  shirtUniforms,
                  includeHangerAttr,
                  maxAniso
                );
                mountGarmentNode(normalizedGlb);
                dracoLoader.dispose();
                console.info('[Carrd 3D] Loaded GLB:', glbUrl);
                resolve({ source: 'glb', url: glbUrl });
              } catch (parseErr) {
                console.error('[Carrd 3D] GLB Normalization Error — falling back to procedural mesh:', parseErr);
                const fallback = buildProceduralFallbackTShirt(
                  THREE,
                  fallbackTorsoMaterial,
                  fallbackSleeveMaterial,
                  fallbackCollarMaterial
                );
                mountGarmentNode(fallback);
                dracoLoader.dispose();
                resolve({ source: 'procedural-fallback' });
              }
            },
            undefined,
            (err) => {
              console.warn('[Carrd 3D] Could not fetch GLB at ' + glbUrl + ' — using procedural T-shirt fallback.', err);
              const fallback = buildProceduralFallbackTShirt(
                THREE,
                fallbackTorsoMaterial,
                fallbackSleeveMaterial,
                fallbackCollarMaterial
              );
              mountGarmentNode(fallback);
              dracoLoader.dispose();
              resolve({ source: 'procedural-fallback' });
            }
          );
        });
      }

      await loadTShirtGlbModel(glbUrlToLoad);

      window.loadTShirtGlb = loadTShirtGlbModel;

      window.setTShirtLogos = function (config = {}) {
        if (config.front !== undefined) {
          if (typeof config.front === 'string') {
            loadDecalSide('front', config.front);
          } else if (config.front && typeof config.front === 'object') {
            loadDecalSide('front', config.front.url, config.front);
          }
        }
        if (config.back !== undefined) {
          if (typeof config.back === 'string') {
            loadDecalSide('back', config.back);
          } else if (config.back && typeof config.back === 'object') {
            loadDecalSide('back', config.back.url, config.back);
          }
        }
      };

      window.setTShirtLogo = function (url, opts = {}) {
        const side = opts.side === 'back' ? 'back' : 'front';
        loadDecalSide(side, url, opts);
      };

      /* Studio Architectural Room (Back Wall & Floor) */
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x181a20,
        roughness: 0.90,
        metalness: 0.05
      });

      const backWall = new THREE.Mesh(new THREE.PlaneGeometry(32, 20), wallMaterial);
      backWall.position.set(0, 1.2, -1.65);
      backWall.receiveShadow = true;
      scene.add(backWall);

      const floorPlane = new THREE.Mesh(new THREE.PlaneGeometry(32, 22), wallMaterial);
      floorPlane.rotation.x = -Math.PI * 0.5;
      floorPlane.position.set(0, -2.05, 3.5);
      floorPlane.receiveShadow = true;
      scene.add(floorPlane);

      /* Morning Ambient Light + Golden Sun Window Beams */
      const morningHemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1c1917, 0.68);
      scene.add(morningHemiLight);

      const morningSunSpot = new THREE.SpotLight(0xffe0b5, 2.85);
      morningSunSpot.position.set(-4.8, 3.4, 5.6);
      morningSunSpot.target.position.set(0.25, -0.2, -1.2);
      morningSunSpot.angle = Math.PI / 4.2;
      morningSunSpot.penumbra = 0.48;
      morningSunSpot.decay = 1.3;
      morningSunSpot.distance = 24;
      morningSunSpot.castShadow = true;
      morningSunSpot.shadow.mapSize.width = 1024;
      morningSunSpot.shadow.mapSize.height = 1024;
      morningSunSpot.shadow.camera.near = 2.0;
      morningSunSpot.shadow.camera.far = 18.0;
      morningSunSpot.shadow.bias = -0.0004;
      scene.add(morningSunSpot);
      scene.add(morningSunSpot.target);

      const skyRimSpot = new THREE.SpotLight(0xc7d9f0, 1.45);
      skyRimSpot.position.set(5.2, 2.6, 4.2);
      skyRimSpot.target.position.set(-0.3, -0.1, -1.0);
      skyRimSpot.angle = Math.PI / 3.8;
      skyRimSpot.penumbra = 0.65;
      skyRimSpot.decay = 1.4;
      skyRimSpot.distance = 22;
      skyRimSpot.castShadow = true;
      skyRimSpot.shadow.mapSize.width = 1024;
      skyRimSpot.shadow.mapSize.height = 1024;
      skyRimSpot.shadow.camera.near = 2.0;
      skyRimSpot.shadow.camera.far = 18.0;
      skyRimSpot.shadow.bias = -0.0004;
      scene.add(skyRimSpot);
      scene.add(skyRimSpot.target);

      const goboGroup = new THREE.Group();
      const slatMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      for (let i = -2; i <= 2; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.11, 5.5, 0.04), slatMat);
        slat.position.set(i * 0.72, 0, 0);
        slat.castShadow = true;
        goboGroup.add(slat);
      }
      goboGroup.position.set(-2.6, 1.9, 3.1);
      goboGroup.lookAt(morningSunSpot.position);
      scene.add(goboGroup);

      /* Responsive Camera Framing */
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
            renderer.setSize(width, height);
            updateViewportSize(width, height);
          }
        }
      });
      resizeObserver.observe(stageEl);

      /* Performance Guard: Pause WebGL when offscreen or tab hidden */
      let isVisible = true;
      const io = new IntersectionObserver((entries) => {
        isVisible = entries[0] ? entries[0].isIntersecting : true;
      }, { threshold: 0.01 });
      io.observe(rootEl);

      document.addEventListener('visibilitychange', () => {
        isVisible = document.visibilityState === 'visible';
      });

      /* Synchronized Orbital Camera + Front/Back Showcase Turn Loop */
      rootEl.setAttribute('data-state', 'ready');
      const clock = new THREE.Clock();

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

        const organicSway = Math.sin(t * 0.31) * 0.14 + Math.cos(t * 0.17) * 0.05;
        tshirtPivotGroup.rotation.y = backPhase * Math.PI + organicSway;
        tshirtPivotGroup.rotation.z = Math.sin(t * 0.21) * 0.012;

        const orbitAngle = Math.sin(t * 0.20) * 0.42 + frontPhase * 0.14;
        const radiusZ = baseCamZ - frontPhase * 0.38 + Math.cos(t * 0.18) * 0.28;

        const camX = Math.sin(orbitAngle) * radiusZ * 0.52;
        const camY = (0.18 * frontPhase + 0.04 * backPhase) + Math.sin(t * 0.16) * 0.22;
        const camZ = Math.cos(orbitAngle) * radiusZ;

        camera.position.set(camX, camY, camZ);

        const lookX = frontPhase * 0.16 + Math.sin(t * 0.15) * 0.08;
        const lookY = frontPhase * 0.18 + backPhase * 0.04 + Math.cos(t * 0.18) * 0.06;
        camera.lookAt(lookX, lookY, 0.0);

        morningSunSpot.position.x = -4.8 + Math.sin(t * 0.11) * 0.65;
        morningSunSpot.position.y = 3.4 + Math.cos(t * 0.09) * 0.35;

        renderer.render(scene, camera);
      }

      animate();
    } catch (err) {
      console.error('[Carrd GLB RNM T-Shirt Hero Error]:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
