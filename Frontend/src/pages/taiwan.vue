<script lang="ts">
import sidebar from './test.vue';
import { useWindowSize } from '@vueuse/core';
import 
{ 
    PerspectiveCamera, 
    Scene, 
    WebGLRenderer, 
    Mesh, 
    RepeatWrapping,
    DoubleSide,
    SphereGeometry, 
    CylinderGeometry,
    BoxGeometry, 
    sRGBEncoding, 
    ACESFilmicToneMapping, 
    PCFSoftShadowMap,
    DirectionalLight,
    PointLight,
    Color,
    MeshPhysicalMaterial,
    TextureLoader,
    PMREMGenerator,
    FloatType,
    Raycaster,
    Vector2,
    MeshStandardMaterial,
    Texture
  } from 'three';
  import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
  import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
  import {computed, onMounted, ref, watch, createApp, App, getCurrentInstance, reactive, onUpdated } from 'vue';
  import { useTweakPane } from '../composables/useTweakpane';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

  import{ loadDone, colors, pos, Hexagon } from '../classes/hexagon';


  //const experience = ref<HTMLCanvasElement | null>(null);
  var canvas = document.getElementsByTagName('canvas')[0];

  console.log(canvas);

  const MAX_HEIGHT = 10;
  const scene = new Scene();

  let camera: PerspectiveCamera;
  let renderer: WebGLRenderer;
  let controls: OrbitControls;


  const {width, height} = useWindowSize();
  // if(experience != null){
  //   experience.value.width = width.value ;
  //   experience.value.height = height.value;
  // }
  

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

  camera = new PerspectiveCamera(65, aspectRatio.value, 0.1, 1000);
  camera.lookAt(0,0,0);
  camera.position.set(0, 55, -50);
  scene.add(camera);


  const sunLight = new DirectionalLight(
    new Color("#C9BBAA").convertSRGBToLinear(),
    0.0,
  );
  sunLight.position.set(10, 50, -10);
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

const light = new PointLight( new Color("#FFCB8E").convertSRGBToLinear().convertSRGBToLinear(), 80, 200 );
light.position.set(30, 20, 10);

light.castShadow = true; 
light.shadow.mapSize.width = 512; 
light.shadow.mapSize.height = 512; 
light.shadow.camera.near = 0.5; 
light.shadow.camera.far = 500; 
scene.add( light );



  const {pane, fpsGraph} = useTweakPane();

  const raycaster = new Raycaster();
  const mouse = new Vector2();

//   function onMouseMove( event : any ) {
//     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//   }

//   function hoverObject(){
//     raycaster.setFromCamera(mouse, camera);
//     const intersects = raycaster.intersectObject();
//   }

//   const loop = () => {
//     fpsGraph.begin();
//     renderer.render(scene, camera);
//     controls.update();
//     fpsGraph.end();
//     requestAnimationFrame(loop);
//     console.log(aspectRatio.value);
//   }
let envMap: Texture;

function makeGaps(X: number, Y: number){
    return new Vector2((X + (Y % 2) * 0.5) * 1.77, Y * 1.535);
}


let hexagonGeometries = new BoxGeometry(0,0,0);



let GeoArray: BoxGeometry[] = new Array;

for(let i = 0; i < 22; i++){
    GeoArray[i] = new BoxGeometry(0, 0, 0);
    //GeoArray[i].index = null;
    //console.log(GeoArray[i].index);
}

function hexGeometry(height:number, position:Vector2) {
    let geo  = new CylinderGeometry(1, 1, height, 6, 1, false); 
    geo.translate(position.x, height * 0.5, position.y);
    return geo;
}

function makeHex(height:number, position: Vector2, id: number) {
    //console.log(hexagonGeometries.index);
    let geo = hexGeometry(height, position);
    //console.log(position.x + `-` + position.y + ' ' + id);
    //hexagonGeometries = mergeBufferGeometries([hexagonGeometries, geo]);
    //console.log(geo);
    if(GeoArray[id].index === undefined || geo.index === undefined){
        console.log('GG');
    }
    //console.log(id);
    GeoArray[id] = mergeBufferGeometries([geo, GeoArray[id]]);
}

function hexMesh(geo: any, color: Color){
    let mat = new MeshStandardMaterial({
        color: color,
        envMap: envMap,
        flatShading: true,
    })

    let mesh = new Mesh(geo, mat);

    return mesh;
}

function clouds() {
  let geo = new SphereGeometry(0, 0, 0); 
  let count = Math.floor(Math.pow(Math.random(), 0.45) * 3) + 1;

  for(let i = 0; i < count; i++) {
    const puff1 = new SphereGeometry(1.2, 12, 12);
    const puff2 = new SphereGeometry(1.5, 15, 15);
    const puff3 = new SphereGeometry(0.9, 12, 12);
   
    puff1.translate(-1.85, Math.random() * 0.3, 0);
    puff2.translate(0,     Math.random() * 0.3, 0);
    puff3.translate(1.85,  Math.random() * 0.3, 0);

    const cloudGeo = mergeBufferGeometries([puff1, puff2, puff3]);
    cloudGeo.translate( 
      Math.random() * 40 - 10, 
      Math.random() * 12 + 10, 
      Math.random() * 40 - 10
    );
    cloudGeo.rotateY(Math.random() * Math.PI * 2);

    geo = mergeBufferGeometries([geo, cloudGeo]);
  }
  
  const mesh = new Mesh(
    geo,
    new MeshStandardMaterial({
      envMap: envMap, 
      envMapIntensity: 0.75, 
      flatShading: true,
      // transparent: true,
      // opacity: 0.85,
    })
  );

  scene.add(mesh);
}

let json: any = new Array;

function convertToCSV(arr : any) {
  const array = [Object.keys(arr[0])].concat(arr)

  return array.map(it => {
    return Object.values(it).toString()
  }).join('\n')
}

function csvToArray(str : any, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row: any) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object: any, header: any, index: any) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

function updateCSV(arr: any){
  let hexagonArr: Hexagon[] = new Array;
      for(let i = 0; i < arr.length ; i++){
        hexagonArr[arr[i].region_id] = new Hexagon(
            1.5, 
            pos[arr[i].region_id],
            arr[i].province_id,
            arr[i].region_id
        );
       // console.log(hexagonArr[csvData[i].region_id].heigth);
    }
    for(let i = 0; i < arr.length ; i++){
        hexagonArr[arr[i].region_id].heigth += Math.pow(Number(arr[i].data)  / 850, 1.4 );
        hexagonArr[arr[i].region_id].heigth /= Number(arr[i].occupation);
        //console.log(hexagonArr[arr[i].region_id].heigth + ` ` + arr[i].region_id + ` ` + arr[i].occupation);
    }
    return hexagonArr;
}

export default {
    name: 'taiwan',
    
    setup(){
      console.log('initializing');
      let textures = {
            dirt: new TextureLoader().load("@/assets/dirt.png"),
            dirt2: new TextureLoader().load("@/assets/dirt2.jpg"),
            water: new TextureLoader().load("@/assets/water.jpg"),
            //stone: await new TextureLoader().loadAsync("assets/stone.png"),
        };
      renderer = new WebGLRenderer({
          canvas: canvas as unknown as HTMLCanvasElement,
          antialias: true,
          alpha: true,
        });
      onMounted(async() => {
        //console.log(canvas.width);
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
        .loadAsync("@/assets/envmap.hdr");  
        envMap = pmrem.fromEquirectangular(envmapTexture).texture;

        let seaTexture = textures.water;
        seaTexture.repeat = new Vector2(1, 1);
        seaTexture.wrapS = RepeatWrapping;
        seaTexture.wrapT = RepeatWrapping;

        let seaMesh = new Mesh(
        new CylinderGeometry(40, 40, MAX_HEIGHT * 0.2, 50),
        new MeshPhysicalMaterial({
            envMap: envMap,
            color: new Color("#55aaff").convertSRGBToLinear().multiplyScalar(3),
            ior: 1.4,
            transmission: 1,
            transparent: true,
            //thickness: 1.5,
            envMapIntensity: 0.2, 
            roughness: 1,
            metalness: 0.025,
            roughnessMap: seaTexture,
            metalnessMap: seaTexture,
        })
        );
        seaMesh.receiveShadow = true;
        seaMesh.rotation.y = -Math.PI * 0.333 * 0.5;
        seaMesh.position.set(0, -1, 0);
        scene.add(seaMesh);

        let mapContainer = new Mesh(
        new CylinderGeometry(40.1, 40.1, MAX_HEIGHT * 0.2, 50, 2, true),
        new MeshPhysicalMaterial({
          envMap: envMap,
          map: textures.dirt,
          envMapIntensity: 0.2, 
          side: DoubleSide,
        })
      );
        mapContainer.receiveShadow = true;
        mapContainer.rotation.y = -Math.PI * 0.333 * 0.5;
        mapContainer.position.set(0, MAX_HEIGHT * 0.005, 0);
        scene.add(mapContainer);

        let mapFloor = new Mesh(
            new CylinderGeometry(41.5, 41.5, MAX_HEIGHT * 0.1, 50),
            new MeshPhysicalMaterial({
            envMap: envMap,
            map: textures.dirt2,
            envMapIntensity: 0.1, 
            side: DoubleSide,
            })
        );
        mapFloor.receiveShadow = true;
        mapFloor.position.set(0, -MAX_HEIGHT * 0.1, 0);
        scene.add(mapFloor);

        clouds();
        updateRenderer();
        updateCamera();
        
        renderer.setAnimationLoop(() => {
        fpsGraph.begin();
        renderer.render(scene, camera);
        controls.update();
        fpsGraph.end();
    })
  })
  onUpdated(async()=>{
      console.log(typeof json);

      const csv = convertToCSV(json);
      console.log(csv);
      // const csv = parserObj.parse(json);
      // console.log(loadDone);
      const csvData = csvToArray(csv);

      const hexagonArr = updateCSV(csvData);
      
      for(let i = 0; i <  csvData.length; i++){
          //console.log(hexagonArr[i]);
          makeHex(hexagonArr[csvData[i].region_id].heigth, makeGaps((-hexagonArr[csvData[i].region_id].position.x) - 2, hexagonArr[csvData[i].region_id].position.y), hexagonArr[csvData[i].region_id].provinceID);
      }

      let meshArray: Mesh[] = new Array;
      
      for(let i = 0; i < 22; i++){
          meshArray[i] = hexMesh(GeoArray[i], colors[i]);
          scene.add(meshArray[i]);
      }
      

      updateRenderer();
      updateCamera();
      
      renderer.setAnimationLoop(() => {
      fpsGraph.begin();
      renderer.render(scene, camera);
      controls.update();
      fpsGraph.end();
    })
  })
    },
    data(){
      return {
        data: [],
      }
    },
    components: {
      sidebar
    },
    methods: {
      getData(data:any){
        console.log(data);
        this.data = data;
        json = data;
      }
    }
}

</script>

<template>
  <canvas ref = "experience" class="z-20" defer></canvas>
  <canvas id="canvas" class="z-20" defer></canvas>
  <sidebar :getOptionData="getData" defer @event = "getData($event)"></sidebar>
  <p> data: {{data[0]}}</p>
</template>
