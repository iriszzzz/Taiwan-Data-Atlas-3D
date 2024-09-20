<script setup lang="ts">
  import { useWindowSize } from '@vueuse/core';
  import 
  { 
    PerspectiveCamera, 
    Scene, 
    WebGLRenderer, 
    Mesh, 
    SphereGeometry, 
    BufferGeometry,
    MeshBasicMaterial, 
    BoxGeometry, 
    sRGBEncoding, 
    ACESFilmicToneMapping, 
    PCFSoftShadowMap,
    DirectionalLight,
    Color,
    MeshPhysicalMaterial,
    TextureLoader,
    PMREMGenerator,
    FloatType,
    Raycaster,
    Vector2
  } from 'three';
  import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
  import {computed, onMounted, ref, watch} from 'vue';
  import { useTweakPane } from '../composables/useTweakpane';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

  const experience = ref<HTMLCanvasElement | null>(null);
  const scene = new Scene();

  let camera: PerspectiveCamera;
  let renderer: WebGLRenderer;
  let controls: OrbitControls;

  

  const {width, height} = useWindowSize();

  let aspectRatio = computed(()=> width.value / height.value);

  function updateRenderer(){
    renderer.setSize(width.value, height.value);
    renderer.setPixelRatio(window.devicePixelRatio); 
  }

  function updateCamera(){
    camera.aspect = aspectRatio.value;
    camera.updateProjectionMatrix();
  }

  watch(aspectRatio, updateRenderer);
  watch(aspectRatio, updateCamera);

  camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 1000);
  camera.position.set(0, 15, 40);
  scene.add(camera);


  const sunLight = new DirectionalLight(
    new Color("#C9BBAA").convertSRGBToLinear(),
    3.5,
  );
  sunLight.position.set(10, 20, -10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 512;
  sunLight.shadow.mapSize.height = 512;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 100;
  sunLight.shadow.camera.left = -10;
  sunLight.shadow.camera.bottom = -10;
  sunLight.shadow.camera.top = 10;
  sunLight.shadow.camera.right = 10;
  scene.add(sunLight);

  // const cube = new Mesh(
  //   new BoxGeometry(1, 1, 1, 32, 32),
  //   new MeshBasicMaterial({color: 0x0a8080})
  // );

  // cube.receiveShadow = true;
  // scene.add(cube);

  const {pane, fpsGraph} = useTweakPane();

  const raycaster = new Raycaster();
  const mouse = new Vector2();

  function onMouseMove( event : any ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  function hoverObject(){
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject();
  }

  const loop = () => {
    //sphere.rotation.y += Math.PI * 1.25;
    fpsGraph.begin();
    renderer.render(scene, camera);
    controls.update();
    fpsGraph.end();
    requestAnimationFrame(loop);
    console.log(aspectRatio.value);
  }

  onMounted(async() => {
    renderer = new WebGLRenderer({
      canvas: experience.value as unknown as HTMLCanvasElement,
      antialias: true,
      alpha: true
    });
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = sRGBEncoding;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;

    let pmrem = new PMREMGenerator(renderer);
    let envmapTexture = await new RGBELoader()
    .setDataType(FloatType)
    .loadAsync("@/assets/rustig_koppie_puresky_4k.hdr");  
    let envMap = pmrem.fromEquirectangular(envmapTexture).texture;

    let textures = {
      bump:  await new TextureLoader().loadAsync("@/assets/earthbump.jpg"),
      map:  await new TextureLoader().loadAsync("@/assets/earthmap.jpg"),
      spec:  await new TextureLoader().loadAsync("@/assets/earthspec.jpg")
    };

    let sphere = new Mesh(
      new SphereGeometry(10, 70, 70),
      new MeshPhysicalMaterial({
        map: textures.map,
        roughnessMap: textures.spec,
        bumpMap: textures.bump,
        bumpScale: 0.05,
        envMap,
        envMapIntensity: 0.4,
        sheen: 1,
        sheenRoughness: 0.75,
        sheenColor: new Color("#ff8a00").convertSRGBToLinear(),
        //clearcoat: 0.5,
      }),
    );
    sphere.receiveShadow = true;
    scene.add(sphere);

    let sphere1 = new Mesh(
      new SphereGeometry(0.5, 10, 10),
      new MeshPhysicalMaterial({
        sheenColor: new Color("#000000").convertSRGBToLinear(),
        opacity: 0,
      }),
    );
    sphere1.translateX(-4.7);
    sphere1.translateZ(-7.6);
    sphere1.translateY(3.9);
    scene.add(sphere1);

  //   sphere.sunEnvIntensity = 0.4;
  //   sphere.moonEnvIntensity = 0.1;
  //   sphere.rotation.y += Math.PI * 1.25;
  //   sphere.receiveShadow = true;
  //   scene.add(sphere);

    updateRenderer();
    updateCamera();
    
    loop();
  })

</script>

<template>
  <canvas ref = "experience"/>
</template>
