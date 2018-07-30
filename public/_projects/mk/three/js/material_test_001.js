function init() {
  var scene = new THREE.Scene();
  var gui = new dat.GUI();
  var clock = new THREE.Clock();

  // initialize objects in the scene

  var sphereMaterial = getMaterial('standard', 'rgb(240,240,240)');
  var sphere = getSphere(sphereMaterial, 1, 48);

  var planeMaterial = getMaterial('standard', 'rgb(255,255,255)');
  var plane = getPlane(planeMaterial, 100);

  var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
  var lightRight = getSpotLight(1, 'rgb(255, 220, 180)');

  scene.add(lightRight);
  scene.add(lightLeft);
  scene.add(plane);
  scene.add(sphere);
  // manipluate objects

  sphere.position.y = sphere.geometry.parameters.radius;
  plane.rotation.x = Math.PI/2;

  lightLeft.position.x = -5;
  lightLeft.position.y = 2;
  lightLeft.position.z = -4;

  lightRight.position.x = 5;
  lightRight.position.y = 2;
  lightRight.position.z = -4;

  // manipulate materials
  // load cube map

  var path = '/images/cubemaps/swedish_castle/';
  var format = '.jpg';
  var urls = [
      path + 'px' + format,
      path + 'nx' + format,
      path + 'py' + format,
      path + 'ny' + format,
      path + 'pz' + format,
      path + 'nz' + format,
  ];
  // var urls = [
  //     path + 'bk' + format,
  //     path + 'dn' + format,
  //     path + 'ft' + format,
  //     path + 'lf' + format,
  //     path + 'rt' + format,
  //     path + 'up' + format
  // ];
  var reflectionCube = new THREE.CubeTextureLoader().load(urls);
  reflectionCube.format = THREE.RGBFormat;

  scene.background = reflectionCube;

  var loader = new THREE.TextureLoader();
  planeMaterial.map = loader.load('/images/concrete_002.jpg');
  planeMaterial.bumpMap = loader.load('/images/concrete_002.jpg');
  planeMaterial.roughnessMap = loader.load('/images/concrete_002.jpg');
  planeMaterial.bumpScale = 0.01;
  planeMaterial.metalness = 0.1;
  planeMaterial.roughness = 0.7;
  planeMaterial.envMap = reflectionCube;

  sphereMaterial.roughnessMap = loader.load('/images/fingerprints_001.jpg');
  sphereMaterial.roughness = 1;
  sphereMaterial.envMap = reflectionCube;


  var maps = ['map', 'bumpMap'];
  maps.forEach(function(mapName){
    var texture = planeMaterial[mapName];
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);
  })

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    1,
    1000
  );
  scene.add(camera);
  camera.position.z = 15;
  camera.position.y = 5;

  //dat.gui

  var folder1 = gui.addFolder('light_1');
  folder1.add(lightLeft, 'intensity', 0, 10);
  folder1.add(lightLeft.position, 'x', -5, 15);
  folder1.add(lightLeft.position, 'y', -5, 15);
  folder1.add(lightLeft.position, 'z', -5, 15);

  var folder2 = gui.addFolder('light_2');
  folder2.add(lightRight, 'intensity', 0, 10);
  folder2.add(lightRight.position, 'x', -5, 15);
  folder2.add(lightRight.position, 'y', -5, 15);
  folder2.add(lightRight.position, 'z', -5, 15);

  var folder3 = gui.addFolder('materials');
  folder3.add(sphereMaterial, 'roughness', 0, 1);
  folder3.add(planeMaterial, 'roughness', 0, 1);
  folder3.add(sphereMaterial, 'metalness', 0, 1);
  folder3.add(planeMaterial, 'metalness', 0, 1);
  // gui.add(camera.position, 'z', 10, 20);




  var renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);
  document.getElementById('webgl').appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);


  update(renderer, scene, camera, controls, clock);

  return scene;

}

function getSphere(material, size, segments) {
  var geometry = new THREE.SphereGeometry(size, segments, segments);
  var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  return obj;
}

function getPlane(material, size) {
  var geometry = new THREE.PlaneGeometry(size, size);
  material.side = THREE.DoubleSide;
  var obj = new THREE.Mesh(geometry, material);
  obj.receiveShadow = true;
  return obj;
}

function getMaterial(type, color) {
  var selectedMaterial;
  var materialOptions = {
    color: color === undefined ? 'rgb(255, 255, 255)' : color,
  };

  switch (type) {
    case 'basic':
        selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
        break;
    case 'lambert':
        selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
        break;
    case 'phong':
        selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
        break;
    case 'standard':
        selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
        break;
    default:
        selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
        break;
  }

  return selectedMaterial;
}

function getSpotLight(intensity, color) {
  color = color === undefined ? 'rgb(255, 255, 255)' : color;
  var light = new THREE.SpotLight(color, intensity);
  light.castShadow = true;
  light.penumbra = .5;

  // set up shadow properties for light
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.bias = 0.001;

  return light;
}

function update(renderer, scene, camera, controls, clock){
  renderer.render(scene, camera);
  controls.update();
  var timeElapsed = clock.getElapsedTime();
  // console.log(timeElapsed);
  // var cameraYRotation = scene.getObjectByName('cameraYRotation');
  // if (cameraYRotation.rotation.y < .9) {
  //   cameraYRotation.rotation.y += 0.0005;
  // }
  // cameraYRotation.rotation.y += 0.0009;
  requestAnimationFrame(function(){
    update(renderer, scene, camera, controls, clock);
  })
}

init();
