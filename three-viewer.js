//TODO: perhaps object hover/select and other interactions other than basic camera movement should be moved
//out of viewer
//TODO: offload handling of complexities of renderer(s) into a renderManager of sorts
Polymer('three-viewer', {
  cameraUp : [0,0,1],
  autoRotate:false,
  
	showShadows:true,
	showStats: false,
	showAxes:true,
  //full screen postprocessing

  //additional
  lighting: null,

  selectedObject : null,

  //generic custom element callbacks
  created: function() {
	  this.scene = new THREE.Scene();
    this.rootAssembly = new THREE.Object3D();
  },
  enteredView: function() {
    this._setStyle();
    this.init();
    this.animate();
  },
  //initialization methods
  init:function(){
    this.setupRenderer();
    this.setupScene();
    this.setupControls();
    this.setupHelpers();
    this.setupPostProcess();
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
  animate: function() 
  {
	  this.render();		
	  this.update();
	  requestAnimationFrame(this.animate.bind(this))
  },
  update: function()
  {
	  this.controls.update(); 
			
		if(this.showStats == true && this.$.stats !== undefined)
		{
				this.$.stats.update();
		}
  },
  
  //attribute change handlers / various handlers
  autoRotateChanged:function()
  {
	  this.controls.autoRotate = this.autoRotate;
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
});
