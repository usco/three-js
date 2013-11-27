//TODO: perhaps object hover/select and other interactions other than basic camera movement should be moved
//out of viewer
//TODO: offload handling of complexities of renderer(s) into a renderManager of sorts
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

  //full screen postprocessing
  postProcess:true,
  fullScreen:false,
  rootObject: new THREE.Object3D(),

  selectedObject : null,

  created: function() {
    this.width = 0;
    this.height = 0;
    this.bg = "rgb(255, 255, 255)";

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
    this.setupPostProcess();
  },
  setupRenderer: function()
  {
    if ( Detector.webgl )
    {
				var renderer = new THREE.WebGLRenderer( {antialias:true, preserveDrawingBuffer:true} );
    }
		else
    {
				var renderer = new THREE.CanvasRenderer(); 
    }
		renderer.setSize(this.width, this.height);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;

		renderer.shadowMapEnabled = this.showShadows;
		renderer.shadowMapAutoUpdate = this.showShadows;
		renderer.shadowMapSoft = true;
		renderer.shadowMapType = THREE.PCFShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
    this.convertColor(this.bg);
		renderer.setClearColor( this.bg, 1 );	  

    this.$.viewer.appendChild( renderer.domElement );
    this.renderer = renderer;
		
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

    this.scene.add(this.rootAssembly); //entry point to store meshes
    this.setupLights();

	  //add axes
	  this.axes = new THREE.LabeledAxes()
	  this.addToScene(this.axes);

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
  setupPostProcess:function()
  {
      if(this.renderer instanceof THREE.WebGLRenderer && this.postProcess == true)
      {
        //shaders, post processing etc
        var resolutionBase = 1;
        var resolutionMultiplier = 1.5;

        //various passes and rtts
        var renderPass = new THREE.RenderPass(this.scene, this.camera)
        var copyPass = new THREE.ShaderPass( THREE.CopyShader )
      
        /*this.edgeDetectPass3 = new THREE.ShaderPass(THREE.EdgeShader3)
      
        var contrastPass = new THREE.ShaderPass(THREE.BrightnessContrastShader)
        contrastPass.uniforms['contrast'].value=0.5
        contrastPass.uniforms['brightness'].value=-0.4*/
        
        var vignetteEffect = new VignetteEffect();

        this.fxaaResolutionMultiplier = resolutionBase/resolutionMultiplier;
        var composerResolutionMultiplier = resolutionBase*resolutionMultiplier;

        this.finalComposer = new THREE.EffectComposer( this.renderer )

        /*
        var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
        var renderTarget = new THREE.WebGLRenderTarget( this.width , this.height, renderTargetParameters );
      
        this.finalComposer = new THREE.EffectComposer( this.renderer , renderTarget );          
        this.finalComposer.setSize(this.hRes, this.vRes);
        */
        //prepare the final render passes
        this.finalComposer.addPass( renderPass );
        //this.finalComposer.addPass(this.fxAAPass)

        //blend in the edge detection results
        /*
        var effectBlend = new THREE.ShaderPass( THREE.AdditiveBlendShader, "tDiffuse1" );
        effectBlend.uniforms[ 'tDiffuse2' ].value = this.normalComposer.renderTarget2;
        effectBlend.uniforms[ 'tDiffuse3' ].value = this.depthComposer.renderTarget2;
        this.finalComposer.addPass( effectBlend );*/
        this.finalComposer.addPass( vignetteEffect.pass );
        //make sure the last pass renders to screen
        this.finalComposer.passes[this.finalComposer.passes.length-1].renderToScreen = true;
      }
  },
  setupHelpers: function()
  {
    this.selectionHelper = new SelectionHelper({camera:this.camera,color:0x000000,textColor:0xffffff})
		this.selectionHelper.hiearchyRoot = this.rootAssembly.children;

    //TODO: move this?
    this.selectionHelper.viewWidth = this.width;
    this.selectionHelper.viewHeight = this.height;
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
    if (this.renderer instanceof THREE.WebGLRenderer && this.postProcess == true)
    {
      //necessary hack for effectomposer
      THREE.EffectComposer.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
      THREE.EffectComposer.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );
      THREE.EffectComposer.scene = new THREE.Scene();
      THREE.EffectComposer.scene.add( THREE.EffectComposer.quad );
      /*
      originalStates = helpers.toggleHelpers(this.scene)#hide helpers from scene
      this.depthComposer.render()
      this.normalComposer.render()
      helpers.enableHelpers(this.scene, originalStates)#show previously shown helpers again
      
      this.finalComposer.passes[this.finalComposer.passes.length-1].uniforms[ 'tDiffuse2' ].value = this.normalComposer.renderTarget2
      this.finalComposer.passes[this.finalComposer.passes.length-1].uniforms[ 'tDiffuse3' ].value = this.depthComposer.renderTarget2*/
      this.finalComposer.render();
    }
    else
    {
      this.renderer.render( this.scene, this.camera );
    }
  },
  setInitialStyle:function()
  {
	  //setup width & height
	  var cs = window.getComputedStyle(this);
	  this.width = parseInt(cs.getPropertyValue("width").replace("px",""));
	  this.height = parseInt(cs.getPropertyValue("height").replace("px",""));
    //setup backround color
	  this.bg = cs.getPropertyValue("background-color");
  },
  onResize: function()
  {
	  var cs = window.getComputedStyle(this);
	  this.width = parseInt(cs.getPropertyValue("width").replace("px",""));
	  this.height = parseInt(cs.getPropertyValue("height").replace("px",""));

    //resize all that is needed

    //BUG in firefox: dpr is not 1 on desktop, scaling issue ensue, so forcing to "1"
    this.dpr=1;
		this.resUpscaler = 1;
    this.hRes = this.width * this.dpr * this.resUpscaler;
    this.vRes = this.height * this.dpr * this.resUpscaler;
    
		this.camera.aspect = this.width / this.height;
    this.camera.setSize(this.width,this.height);
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.width,this.height );

    if(this.renderer instanceof THREE.WebGLRenderer && this.postProcess == true)
    {
      this.finalComposer.setSize(this.hRes, this.vRes)
    }

    this.selectionHelper.viewWidth = this.width;
    this.selectionHelper.viewHeight = this.height;
  },
  //public api
	addToScene: function ( object )
	{
		try
		{
			this.rootAssembly.add( object );
		}
		catch(error)
		{
			console.log("Failed to add object",object, "to scence: error", error)
		}
	},
	captureScreen:function(callback, width, height)
	{
		var width = width || 640;
		var height = height || 480;
		if(callback === undefined)
		{
			throw new Error("no callback provided");
		}
		captureScreen(callback, this.renderer.domElement, width, height);
	},

  //utilities: TODO: move this to seperate js file
	convertColor: function(hex)
	{
    hex = parseInt("0x"+hex.split('#').pop(),16);
    return  hex;
	},

  //event handlers
  keyDown:function(event)
	{//overidable method stand in
	},
  keyUp:function(event)
	{//overidable method stand in
	},
  onPointerMove:function(event)
  {
    var event = event.impl || event;
    var x = event.offsetX;
    var y = event.offsetY;

    this.highlightedObject = this.selectionHelper.getObjectAt(x,y);

    this._noMove = false;
  },
  onPointerDown:function(event)
  {
    var event = event.impl || event;
    var x = event.offsetX;
    var y = event.offsetY;

    this._noMove = true;
    this._actionInProgress = true;
    this._pushStart = new Date().getTime();

  },
  onPointerUp:function(event)
  {
    var event = event.impl || event;
    var x = event.offsetX;
    var y = event.offsetY;

    this._actionInProgress = false;
      var _pushEnd = new Date().getTime()
      var _elapsed = _pushEnd - this._pushStart;
      this._longAction = !(_elapsed <= 125);
      this._longStaticTap = (_elapsed >= 300 && this._noMove == true);

      var selected = this.selectionHelper.getObjectAt(x,y);

      if(this._longStaticTap)
      {
        if(this.longStaticTap) this.longStaticTap(x,y);//TODO: change this into an event ?
      }
      else if( selected != null && selected != undefined)
      {
        this.selectionHelper.selectObjectAt(x,y)
        this.selectedObject = selected
      }
      else
      {
        if (this._longAction == false)
        {
          this.selectedObject = null;
					this.selectionHelper._unSelect();
        }
      }

  },

  //attribute change handlers / various handlers
  autoRotateChanged:function()
  {
	  this.controls.autoRotate = this.autoRotate;
  },
  showGridChanged:function()
	{
		console.log("showGridChanged", this.showGrid);
		this.grid.toggle(this.showGrid)
	},
	showShadowsChanged:function()
	{
		console.log("showShadowsChanged", this.showShadows);
		
		//hack for now
		var settings = {};
		settings.shadows = this.showShadows;
		settings.selfShadows =this.showShadows;
		settings.objectViewMode = "shaded";
		updateVisuals(this.rootAssembly, settings);
	},
	showAxesChanged: function()
	{
		console.log("showAxesChanged", this.showAxes);
		this.axes.toggle( this.showAxes ) ;
	},
	projectionChanged:function()
	{
		console.log("projectionChanged", this.projection);
		if(this.projection == "orthographic")
		{
				this.camera.toOrthographic();
				this.selectionHelper.isOrtho = true;
		}
		else
		{
        this.camera.toPerspective();
				this.selectionHelper.isOrtho = false;
        //this.camera.setZoom(1);
		}
	},
	orientationChanged:function()
	{
			console.log("orientation changed");
			//TODO: streamline this
			switch(this.orientation)
			{
				case 'diagonal':
					this.camera.toDiagonalView();
					break;
				case 'top':
					this.camera.toTopView();
					break;
				case 'bottom':
					this.camera.toBottomView();
					break;
				case 'left':
					this.camera.toLeftView();
					break;
				case 'right':
					this.camera.toRightView();
					break;
				case 'front':
					this.camera.toFrontView();
					break;
				case 'back':
					this.camera.toBackView();
					break;
				default:
					this.camera.toDiagonalView();
			}
	},
  highlightedObjectChanged:function(oldHighlight)
  {
    console.log("highlighted object changed",this.highlightedObject);
  },
  selectedObjectChanged:function(oldSelection)
  {
     console.log("SELECTED object changed",this.selectedObject);
  }
});
