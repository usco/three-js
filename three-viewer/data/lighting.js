Lighting = function (cameraFar) {
	THREE.Object3D.call( this );

  pointLight = new THREE.PointLight(0x333333,3);
  pointLight.position.x = -2500;
  pointLight.position.y = -2500;
  pointLight.position.z = 2200;

  pointLight2 = new THREE.PointLight(0x333333,2);
  pointLight2.position.x = 2500;
  pointLight2.position.y = 2500;
  pointLight2.position.z = -5200;

  ambientColor = 0x565595;
  ambientColor = 0x161515;
  ambientLight = new THREE.AmbientLight(ambientColor);

  var SHADOW_MAP_WIDTH = 4096, SHADOW_MAP_HEIGHT = 2048;
  spotLight = new THREE.SpotLight( 0xbbbbbb, 0.8, 0, Math.PI, 1 );
	spotLight.position.set( 20, 20, 250 );
	spotLight.target.position.set( 0, 0, 0 );

	spotLight.castShadow = true;

	spotLight.shadowCameraNear = 100;
	spotLight.shadowCameraFar = cameraFar;
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

	for (var i=0; i<lights.length; i++)
	{
		var light = lights[i]
	  this.add(light)
	}
}
Lighting.prototype = Object.create( THREE.Object3D.prototype );


