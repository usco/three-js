Polymer('three-viewer', {
  viewAngle: 40,
  cameraUp : [0,0,1],
  projection: "perspective",
  orientation: "diagonal",
  autoRotate:false,
  
  showGrid: true,
	showShadows:true,
	showStats: false,
	showAxes:true,

  selectedObject : null,

  created: function() {
    this.width = 0;
    this.height = 0;

	  this.scene = new THREE.Scene();
    this.rootAssembly = new THREE.Object3D();
  },
  ready:function(){
    this.cameraUp = new THREE.Vector3(this.cameraUp[0],this.cameraUp[1],this.cameraUp[2]);
  },
  enteredView: function() {
    this.setInitialStyle();
    this.init();
    this.animate();

    window.addEventListener("resize",this.onResize.bind(this));
    window.onresize=this.onResize.bind(this);
  },
  init:function(){
    this.setupRenderer();
    this.setupScene();
    this.setupControls();
    this.setupHelpers();
  },
  setupRenderer: function()
  {
    if ( Detector.webgl )
    {
				var renderer = new THREE.WebGLRenderer( {antialias:true,preserveDrawingBuffer:true} );
    }
		else
    {
				var renderer = new THREE.CanvasRenderer(); 
    }
		renderer.setSize(this.width, this.height);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;

		renderer.shadowMapEnabled = true;
		renderer.shadowMapAutoUpdate = true;
		renderer.shadowMapSoft = true;
		renderer.shadowMapType = THREE.PCFShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
			
    this.$.viewer.appendChild( renderer.domElement );
    this.renderer = renderer;
    /*
		this.convertColor(this.bg)
		renderer.setClearColor( this.bg, 1 );*/
  },
  setupScene:function()
  {
    //todo: read camera params from camera config/settings
		this.defaultCameraPosition = new THREE.Vector3(100,100,200);

    ASPECT = this.width / this.height;
    this.NEAR = 0.1;
    this.FAR = 20000;
    this.camera = new THREE.CombinedCamera(
        this.width,
        this.height,
        this.viewAngle,
        this.NEAR,
        this.FAR,
        this.NEAR,
        this.FAR);
    this.camera.up = this.cameraUp;
    this.camera.position.copy(this.defaultCameraPosition);
    this.camera.defaultPosition.copy(this.defaultCameraPosition);
    this.scene.add(this.camera);

    /*
    //add grid
    /*
    this.grid = new THREE.CustomGridHelper(200,10,this.cameraUp)
    this.scene.add(this.grid);
    //add axes
    this.axes = new THREE.LabeledAxes()
    this.scene.add(this.axes);*/

    //add 3D shapes
    var geometry = new THREE.CubeGeometry( 100, 100, 100 ); 
    geometry.computeCentroids();
  	geometry.computeBoundingSphere();
    geometry.computeBoundingBox();
	  var material = new THREE.MeshBasicMaterial( {opacity:1,transparent:true,color: 0x0088ff} ); 
	  var cube = new THREE.Mesh(geometry, material);
    cube.name = "TestCube";
    cube.position.set(-200,0,0);
    this.scene.add(cube);

    var geometry = new THREE.SphereGeometry(75, 20,20);
    geometry.computeCentroids();
  	geometry.computeBoundingSphere();
    geometry.computeBoundingBox();
    var material = new THREE.MeshBasicMaterial( {opacity:1,transparent:true,color: 0xff8800} );
    var sphere = new THREE.Mesh(geometry, material);
    sphere.name = "testSphere";
    sphere.position.set(50,0,0);
    this.scene.add(sphere);


    this.scene.add(this.rootAssembly); //entry point to store meshes
    this.setupLights();
  },
  setupLights: function()
	{
		mainScene = 	this.scene
	  	pointLight = new THREE.PointLight(0x333333,3)
	  	pointLight.position.x = -2500
	  	pointLight.position.y = -2500
	  	pointLight.position.z = 2200
		  
	  	pointLight2 = new THREE.PointLight(0x333333,2)
	  	pointLight2.position.x = 2500
	  	pointLight2.position.y = 2500
	  	pointLight2.position.z = -5200
		
	  	ambientColor = 0x565595
      ambientColor = 0x161515
	  	ambientLight = new THREE.AmbientLight(ambientColor)
		  
  /*
	  	spotLight = new THREE.SpotLight( 0xbbbbbb, 1.5)  ;  
	  	spotLight.position.x = 50;
	  	spotLight.position.y = 50;
	  	spotLight.position.z = 150;
	  	
		spotLight.shadowCameraNear = 1;
		spotLight.shadowCameraFov =60;
		spotLight.shadowMapBias = 0.0039;
		spotLight.shadowMapDarkness = 0.5;
		shadowResolution = 512; //parseInt(this.settings.shadowResolution.split("x")[0])
		spotLight.shadowMapWidth = shadowResolution
		spotLight.shadowMapHeight = shadowResolution
		spotLight.castShadow = true*/

    var SHADOW_MAP_WIDTH = 4096, SHADOW_MAP_HEIGHT = 2048;
    spotLight = new THREE.SpotLight( 0xbbbbbb, 0.8, 0, Math.PI, 1 );
		spotLight.position.set( 20, 20, 250 );
		spotLight.target.position.set( 0, 0, 0 );

		spotLight.castShadow = true;

		spotLight.shadowCameraNear = 100;
		spotLight.shadowCameraFar = this.camera.far;
		spotLight.shadowCameraFov = 50;

			//light.shadowCameraVisible = true;

		spotLight.shadowBias = 0.0001;
		spotLight.shadowDarkness = 0.5;

		spotLight.shadowMapWidth = SHADOW_MAP_WIDTH;
		spotLight.shadowMapHeight = SHADOW_MAP_HEIGHT;


    //sky color ground color intensity 
    hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
    hemiLight = new THREE.HemisphereLight( 0xffEEEE, 0xffEEEE, 0.2 );
			/*hemiLight.color.setHSV( 0.8, 0.25, 1 );
			hemiLight.groundColor.setHSV( 0.095, 0.2, 1 );*/
			hemiLight.position.set( 0, 1200, 5000 );
		  
    
    dirLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
			//dirLight.color.setHSV( 0.1, 0.1, 1 );
			dirLight.position.set( 0, 50, 300 );
			//dirLight.position.multiplyScalar( 50 );

			dirLight.castShadow = true;

			dirLight.shadowMapWidth = 2048;
			dirLight.shadowMapHeight = 2048;

			var d = 50;

			dirLight.shadowCameraLeft = -d;
			dirLight.shadowCameraRight = d;
			dirLight.shadowCameraTop = d;
			dirLight.shadowCameraBottom = -d;

			dirLight.shadowCameraFar = 3500;
			dirLight.shadowBias = -0.0001;
			dirLight.shadowDarkness = 0.35;
      dirLight.onlyShadow = true;

    var shadowConst = 0.8;
    dirLight.shadowDarkness = shadowConst * dirLight.intensity;

    //3 point lighting test
    var pLigthIntensity = 0.5;
    var pLight = new THREE.DirectionalLight( 0xfcfc7e, pLigthIntensity );
    pLight.position.set( 100, 150, 200 );
    pLight.target.position.set(0,0,0);

    var pLight2 = new THREE.DirectionalLight( 0xfcfc7e, pLigthIntensity );
    pLight2.position.set( 100, -150, 200 );
    pLight2.target.position.set(0,0,0);

    var pLight3 = new THREE.DirectionalLight( 0x86f4eb, pLigthIntensity );
    pLight3.position.set( -100, 0, -200 );
    pLight3.target.position.set(0,0,0);


		lights = [ambientLight,hemiLight,dirLight,pLight,pLight2]
		mainScene.lights = lights
		for (var i=0; i<lights.length; i++)
		{
			var light = lights[i]
		  mainScene.add(light)
		}
	},
  setupHelpers: function()
  {
    this.selectionHelper = new SelectionHelper({camera:this.camera,color:0x000000,textColor:0xffffff})
		this.selectionHelper.hiearchyRoot=this.rootAssembly.children;
  },
  setupControls: function()
  {
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement, this.cameraUp );
		this.controls.userPanSpeed = 8.0;
		this.controls.userZoomSpeed = 2.0;
  	this.controls.userRotateSpeed = 2.0;

		this.controls.autoRotate = this.autoRotate;
		this.controls.autoRotateSpeed = 4.0;
  },
  animate: function() 
  {
	  this.render();		
	  this.update();
	  requestAnimationFrame(this.animate.bind(this))
  },
  update: function()
  {
	  this.controls.update(); 
  },
  render:function() {
    this.renderer.render(this.scene, this.camera);
  },
  setInitialStyle:function()
  {
	  //setup width & height
	  var cs = window.getComputedStyle(this);
	  this.width = parseInt(cs.getPropertyValue("width").replace("px",""));
	  this.height = parseInt(cs.getPropertyValue("height").replace("px",""));
  },
  onResize: function()
  {
	var cs = window.getComputedStyle(this);
	this.width = parseInt(cs.getPropertyValue("width").replace("px",""));
	this.height = parseInt(cs.getPropertyValue("height").replace("px",""));

	this.renderer.setSize( this.width,this.height );
},
//event handlers
onPointerDown:function(event)
{
  var event = event.impl || event;
  var x = event.offsetX;
  var y = event.offsetY;
  var intersects = this._pick(x,y);

  console.log("mouseX,Y",x,y);
  if(intersects.length>0)
  {
    var selected = intersects[0].object;
    selected._oldColor = selected.material.color.clone();
    selected.material.color.setRGB(1,0,0);
    this.selectedObject = selected;
  }else
  {
    this.selectedObject = null;
  }
},
//attribute change handlers / various handlers
autoRotateChanged:function()
{
	this.controls.autoRotate = this.autoRotate;
},
selectedObjectChanged:function(oldSelection)
{
  if(oldSelection != null)
  {
    oldSelection.material.color = oldSelection._oldColor;
  }
},
//helpers
_pick:function(x,y)
{
  var intersected, intersects, raycaster, v;
  v = new THREE.Vector3((x / this.width) * 2 - 1, -(y / this.height) * 2 + 1, 1);
  new THREE.Projector().unprojectVector(v, this.camera);
  raycaster = new THREE.Raycaster(this.camera.position, v.sub(this.camera.position).normalize());
  intersects = raycaster.intersectObjects(this.scene.children, true);
  return intersects;
}
});
