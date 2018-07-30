function init () {
  var scene = new THREE.Scene();
  var gui = new dat.GUI();
  var enableFog = false;
  var clock = new THREE.Clock();

  if (enableFog) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.2);
  }

  //var box = getBox(1, .2, 2);


  var boxGrid = getBoxGrid(10, 1.5);
  boxGrid.name = "boxGrid";
  var plane = getPlane(20);
  //var light1 = getPointLight(1);
  //var light2 = getSpotLight(1);
  var light3 = getDirectionalLight(1);
  var sphere1 = getSphere(0.05);
  var light4 = getAmbientLight(.1);
  var helper = new THREE.CameraHelper(light3.shadow.camera);

  scene.add(plane);
  // scene.add(helper);
  // scene.add(box);
  // scene.add(light2);
  scene.add(light3);
  //light2.add(sphere1);
  scene.add(boxGrid);
  scene.add(light4);

  plane.name = 'plane-1';
  plane.rotation.x=Math.PI/2;
  //box.position.y=box.geometry.parameters.height/2;


  //add camera
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    1,
    1000
  );

  //add camera rig
  var cameraYPosition = new THREE.Group();
  var cameraZPosition = new THREE.Group();
  var cameraYRotation = new THREE.Group();
  var cameraXRotation = new THREE.Group();

  cameraZPosition.name = 'cameraZPosition';
  cameraYPosition.name = 'cameraYPosition';
  cameraXRotation.name = 'cameraXRotation';
  cameraYRotation.name = 'cameraYRotation';

  cameraYPosition.add(camera);
  cameraZPosition.add(cameraYPosition);
  cameraXRotation.add(cameraZPosition);
  cameraYRotation.add(cameraXRotation);
  scene.add(cameraYRotation);

  cameraYPosition.position.y = 1;
  cameraZPosition.position.z = 100;
  cameraXRotation.rotation.x = -Math.PI/2;
  cameraYRotation.rotation.y = 0;

  console.log("starting here");

  new TWEEN.Tween({val: 100})
      .to({val: 30}, 12000)
      .onUpdate(function(){
        cameraZPosition.position.z = this.val;
        console.log( "z position value: " + this.val );
      })
      .start();

  new TWEEN.Tween({val:-Math.PI/2})
      .to({val:-.2}, 12000)
      .delay(3000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(function(){
        cameraXRotation.rotation.x = this.val;
        console.log("x rotation value: " + this.val);
      })
      .start();

  gui.add(cameraZPosition.position, 'z', -10, 100);
  gui.add(cameraXRotation.rotation, 'x', -Math.PI, Math.PI);
  gui.add(cameraYRotation.rotation, 'y', -Math.PI, Math.PI);

  light3.position.y = 12;
  light3.position.x = 7;
  light3.position.z = 7;
  light3.intensity = 1.2;
  //light2.penumbra = .9;
  light4.position.y = 13;

  //add all GUI elements.
  // gui.add(light3, 'intensity', 0, 10);
  // gui.add(light3.position, 'y', -10, 10);
  // gui.add(light3.position, 'x', -10, 10);
  // gui.add(light3.position, 'z', -10, 10);
  //gui.add(light2, 'penumbra', 0, 1);
  //gui.add(box.position, 'y', 0, 10);

  // camera.position.z = 20;
  // camera.position.x = 7;
  // camera.position.y = 10;
  // camera.lookAt(new THREE.Vector3(0, 0, 0));




  var renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);
  document.getElementById('webgl').appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls, clock);
  return scene;
}

function getBox(w, h, d) {
  console.log("starting getBox");
  var geometry = new THREE.BoxGeometry(w, h, d);
  var material = new THREE.MeshPhongMaterial({color: 'rgb(240,0,60)'});

  var mesh = new THREE.Mesh(
    geometry,
    material
  );
  mesh.castShadow = true;
  return mesh;

}

function getSphere(radius) {
  console.log("starting getSphere");
  var geometry = new THREE.SphereGeometry(radius, 24, 24);
  var material = new THREE.MeshBasicMaterial({color: 'rgb(255,255,200)'});

  var mesh = new THREE.Mesh(
    geometry,
    material
  );

  return mesh;

}

function getPointLight (intensity) {
  var light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;
  return light;
}

function getSpotLight (intensity) {
  var light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;
  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  return light;
}

function getDirectionalLight (intensity) {
  var light = new THREE.DirectionalLight(0xffffff, intensity);
  light.castShadow = true;
  light.shadow.camera.left = -10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  return light;
}

function getAmbientLight (intensity) {
  var light = new THREE.PointLight('rgb(10,30,50)', intensity);
  return light;
}

function getPlane(size) {
  console.log("starting getPlane");
  var geometry = new THREE.PlaneGeometry(size, size);
  var material = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});

  var mesh = new THREE.Mesh(
    geometry,
    material
  );
  mesh.receiveShadow = true;
  return mesh;

}

function getBoxGrid (amount, separationMultiplier) {
  var group = new THREE.Group();
  for (var i=0; i<amount; i++) {
    var obj = getBox(1, 1, 1);
    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height/2;
    group.add(obj);
      for (var j = 1; j < amount; j++) {
        var obj = getBox(1, 1, 1);
        obj.position.x = i * separationMultiplier;
        obj.position.y = obj.geometry.parameters.height/2;
        obj.position.z = j*separationMultiplier;
        group.add(obj);
      }
  }
  group.position.x = -(separationMultiplier * (amount-1)/2);
  group.position.z = -(separationMultiplier * (amount-1)/2);
  return group;
}

function update(renderer, scene, camera, controls, clock){
  renderer.render(scene, camera);
  controls.update();
  TWEEN.update();

  var timeElapsed = clock.getElapsedTime();

  var boxGrid = scene.getObjectByName('boxGrid');

  boxGrid.children.forEach(function(child, index) {
    var x = timeElapsed*.5 + index/2;
    child.scale.y = (Math.sin(x)+2.01);
  //  child.scale.y = (noise.simplex2(x,x)+1)/2 + 0.001;
    child.position.y = child.scale.y/2 + .01;
  });

  //
  // var cameraZPosition = scene.getObjectByName('cameraZPosition');
  // if (cameraZPosition.position.z > 30) {
  //   cameraZPosition.position.z -= 0.05;
  // }
  //
  //
  // var cameraXRotation = scene.getObjectByName('cameraXRotation');
  // if (cameraXRotation.rotation.x > -.55) {
  //   cameraXRotation.rotation.x -= 0.0005;
  // }


  var cameraYRotation = scene.getObjectByName('cameraYRotation');
  // if (cameraYRotation.rotation.y < .9) {
  //   cameraYRotation.rotation.y += 0.0005;
  // }
  cameraYRotation.rotation.y += 0.0009;
  requestAnimationFrame(function(){
    update(renderer, scene, camera, controls, clock);
  })
}

var scene = init();

console.log("THREE");
