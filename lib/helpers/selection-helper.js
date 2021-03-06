//straight compile from coffeescript, temporary
var  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };


function SelectionHelper(options) {
    this.highlightObjectAt = __bind(this.highlightObjectAt, this);

    this.selectObjectAt = __bind(this.selectObjectAt, this);

    this.getObjectAt = __bind(this.getObjectAt, this);

    this.isThereObjectAt = __bind(this.isThereObjectAt, this);

    this.get2DBB = __bind(this.get2DBB, this);

    this.getScreenCoords = __bind(this.getScreenCoords, this);

    this._get3DBB = __bind(this._get3DBB, this);

    this._unSelect = __bind(this._unSelect, this);

    this._onSelect = __bind(this._onSelect, this);

    this._unHover = __bind(this._unHover, this);

    this._onHover = __bind(this._onHover, this);

    var defaults;
    //SelectionHelper.__super__.constructor.call(this, options);
    defaults = {
      hiearchyRoot: null,
      camera: null,
      viewWidth: 640,
      viewHeight: 480
    };
    //options = merge(defaults, options);

    this.hiearchyRoot = options.hiearchyRoot, this.camera = options.camera, this.viewWidth = options.viewWidth, this.viewHeight = options.viewHeight;
    this.options = options;
    this.currentHover = null;
    this.currentSelect = null;
    this.projector = new THREE.Projector();
    this.addEventListener = THREE.EventDispatcher.prototype.addEventListener;
    this.hasEventListener = THREE.EventDispatcher.prototype.hasEventListener;
    this.removeEventListener = THREE.EventDispatcher.prototype.removeEventListener;
    this.dispatchEvent = THREE.EventDispatcher.prototype.dispatchEvent;

		//for camera
		this.isOrtho = false;
		this.selectionColor = 0xfffccc;
		this.outlineColor = 0xffc200;
  }

  SelectionHelper.prototype._onHover = function(selection) {
    var outline, outlineMaterial;
    if (selection != null) {
      this.currentHover = selection;
      /*
      if (!(selection.hoverOutline != null) && !(selection.outline != null) && !(selection.name === "hoverOutline") && !(selection.name === "boundingCage") && !(selection.name === "selectOutline")) {
        selection.currentHoverHex = selection.material.color.getHex();
        selection.material.color.setHex(this.selectionColor);
        outlineMaterial = new THREE.MeshBasicMaterial({
          color: 0xffc200,
          side: THREE.BackSide
        });
        outline = new THREE.Mesh(selection.geometry.clone(), outlineMaterial);
        outline.scale.multiplyScalar(1.03);
        outline.name = "hoverOutline";
        selection.hoverOutline = outline;
        selection.add(outline);
      }*/
      return this.dispatchEvent({
        type: 'hoverIn',
        selection: selection
      });
    }
  };

  SelectionHelper.prototype._unHover = function() {
    if (this.currentHover) {
      /*if (this.currentHover.hoverOutline != null) {
        this.currentHover.material.color.setHex(this.currentHover.currentHoverHex);
        this.currentHover.remove(this.currentHover.hoverOutline);
        this.currentHover.hoverOutline = null;
      }*/
      this.currentHover = null;
      return this.dispatchEvent({
        type: 'hoverOut',
        selection: this.currentHover
      });
    }
  };

  SelectionHelper.prototype._onSelect = function(selection) {
    var outline, outlineMaterial;
    this._unHover();
    this.currentSelect = selection;
    /*new BoundingCage({
      mesh: selection,
      color: this.options.color,
      textColor: this.options.textColor
    });*/
  
    /*
    var cage = new THREE.BoundingBoxHelper( selection,0xFF0000 );
		cage.name = "boundingCage";
		cage.update();
    selection.cage = cage;
    selection.add(cage);*/
		
    /*outlineMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,//0xffc200,
      side: THREE.BackSide
    });
    outline = new THREE.Mesh(selection.geometry.clone(), outlineMaterial);
    outline.name = "selectOutline";
    outline.scale.multiplyScalar(1.03);
    selection.outline = outline;
    selection.add(outline);*/
    return this.dispatchEvent({
      type: 'selected',
      selection: selection
    });
  };

  SelectionHelper.prototype._unSelect = function() {
    var selection;
    if (this.currentSelect) {
      selection = this.currentSelect;
      /*selection.remove(selection.cage);
      selection.remove(selection.outline);
      selection.cage = null;
      selection.outline = null;
      this.currentSelect = null;*/
      return this.dispatchEvent({
        type: 'unselected',
        selection: selection
      });
    }
  };

  SelectionHelper.prototype._get3DBB = function(object) {
    if (object != null) {
      if (object.geometry != null) {
        if (object.geometry.boundingBox != null) {
          return object.geometry.boundingBox;
        } else {
          object.geometry.computeBoundingBox();
          return object.geometry.boundingBox;
        }
      }
    }
    return null;
  };

  SelectionHelper.prototype.getScreenCoords = function(object, width, height) {
    var result, vector;
    if (object != null) {
      vector = this.projector.projectVector(object.position.clone(), this.camera);
      result = new THREE.Vector2();
      result.x = Math.round(vector.x * (width / 2)) + width / 2;
      result.y = Math.round((0 - vector.y) * (height / 2)) + height / 2;
      return result;
    }
  };

  SelectionHelper.prototype.get2DBB = function(object, width, height) {
    var bbox3d, centerLeft, centerPercX, centerPercY, centerTop, max3d, maxLeft, maxPercX, maxPercY, maxTop, min3d, minLeft, minPercX, minPercY, minTop, objHeight, objLength, objWidth, pMax, pMin, pos, result;
    if (object != null) {
      bbox3d = this._get3DBB(object);
      min3d = bbox3d.min.clone();
      max3d = bbox3d.max.clone();
      objLength = bbox3d.max.x - bbox3d.min.x;
      objWidth = bbox3d.max.y - bbox3d.min.y;
      objHeight = bbox3d.max.z - bbox3d.min.z;
      pMin = this.projector.projectVector(min3d, this.camera);
      pMax = this.projector.projectVector(max3d, this.camera);
      minPercX = (pMin.x + 1) / 2;
      minPercY = (-pMin.y + 1) / 2;
      minLeft = minPercX * width;
      minTop = minPercY * height;
      maxPercX = (pMax.x + 1) / 2;
      maxPercY = (-pMax.y + 1) / 2;
      maxLeft = maxPercX * width;
      maxTop = maxPercY * height;
      pos = object.position.clone();
      pos = this.projector.projectVector(pos, this.camera);
      centerPercX = (pos.x + 1) / 2;
      centerPercY = (-pos.y + 1) / 2;
      centerLeft = centerPercX * width;
      centerTop = centerPercY * height;
      result = [centerLeft, centerTop, objLength, objWidth, objHeight];
      return result;
    }
  };



	SelectionHelper.prototype.pick = function(x,y,isOrtho){
		var isOrtho = isOrtho || this.isOrtho;
		var intersected, intersects, raycaster, v, _ref;
		v = new THREE.Vector3((x / this.viewWidth) * 2 - 1, -(y / this.viewHeight) * 2 + 1, 1);
		if( !isOrtho)
		{
		  var s = Date.now();
		  v.unproject( this.camera );
		  var v1 = v.clone();
		  var fooV = v.clone();
		  
		  raycaster = new THREE.Raycaster(this.camera.position, v.sub(this.camera.position).normalize());
		  //raycaster.precision = 10;
		  intersects = raycaster.intersectObjects(this.hiearchyRoot, true);
		}
		else
		{
				// use picking ray since it's an orthographic camera
				//var ray = this.projector.pickingRay( v, this.camera );
				//intersects = ray.intersectObjects( this.hiearchyRoot, true );
				
				//see here:
				THREE.Vector3.prototype.pickingRay = function ( camera ) {
            var tan = Math.tan( 0.5 * THREE.Math.degToRad( camera.fov ) ) / camera.zoom;

            this.x *= tan * camera.aspect;
            this.y *= tan; 
            this.z = - 1;

            return this.transformDirection( camera.matrixWorld );
        };
				
				//v.unproject( this.camera );
		    //raycaster = new THREE.Raycaster(this.camera.position, v.sub(this.camera.position).normalize());
		     raycaster = new THREE.Raycaster();
         v.pickingRay( this.camera );
         raycaster.set( this.camera.position, v );
		     intersects = raycaster.intersectObjects(this.hiearchyRoot, true);
		}
		
		//remove invisibles
		var i = intersects.length;
    while (i--) {
      if(intersects[i].object && intersects[i].object.visible === false)
		  {
		    intersects.splice(i, 1);
		  }
    }
    
		return intersects;
	};

  SelectionHelper.prototype.getSceneCoords = function(x,y,isOrtho){
		var isOrtho = isOrtho || this.isOrtho;
		var raycaster, v, pos;
		v = new THREE.Vector3((x / this.viewWidth) * 2 - 1, -(y / this.viewHeight) * 2 + 1, 1);
		if( !isOrtho)
		{
		  v.unproject( this.camera);

      var dir = v.sub( this.camera.position ).normalize();
      var distance = - this.camera.position.z / dir.z;
      var pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
		}
		else
		{
				// use picking ray since it's an orthographic camera
				var ray = this.projector.pickingRay( v, this.camera );
				//intersects = ray.intersectObjects( this.hiearchyRoot, true );
		}
		return pos;
	};

  SelectionHelper.prototype.filterIntersects = function( intersects ){
    function goUpHierarchy(node, stopCondition)
		{
		  if(stopCondition( node ) ){
        return node;
      }
      else{
        if(node.parent){
        return goUpHierarchy( node.parent, stopCondition );}
        else{
          return null;
        }
      }
		}
		
		var hierarchyRoot = this.hiearchyRoot;
		var finalInteresects = [];
		//now go up the hierarchy until we find one "root" object ie in hierarchy root
		for(var i=0;i<intersects.length;i++)
		{
		  var node = intersects[i].object;
		  //console.log("intersect", intersects[i]);
		  
		  function isOk(node)
		  {
		    if(hierarchyRoot.indexOf( node ) !=-1 ) return true;
		    return false
		  }
		  var validNode = goUpHierarchy(node, isOk);
		  
		  if( validNode && !validNode.userData.unselectable )
		  {
		    var existingNodeIndex = finalInteresects.indexOf( validNode );
		    if(existingNodeIndex !== -1)
		    {
		      var prevNode = finalInteresects[existingNodeIndex];
		      prevNode.userData.tmpIntersectData.push( intersects[ i ] );
		      continue;
		    }
		    validNode.userData.tmpIntersectData = [ intersects[ i ] ];
		    finalInteresects.push( validNode );
		  }
		}
		//console.log("intersects",finalInteresects);
    return finalInteresects;
  }
  
  //FIXME: we still need access to the face etc of picked items
    /*if(intersects.length > 0)
		  {
		    
		  }*/

  /*SelectionHelper.prototype.isThereObjectAt = function(x, y) {
		var intersects = this.pick(x,y,false);
    if (intersects.length > 0) {
      return true;
    }
    return false;
  };*/

  SelectionHelper.prototype.getObjectAt = function(x, y, isOrtho, filter) {
    var filter    = filter !== undefined ? filter : false;
    var isOrtho = isOrtho || false;
    var s = Date.now();
		var intersects = this.pick(x,y,isOrtho);
		if(filter) intersects = this.filterIntersects( intersects );
		var e = Date.now();
    //console.log( "Time to pick " + (e-s) + " ms" );
		//console.log("intersects",intersects);
		
    if (intersects.length > 0) {
      if(filter){
        var intersected = intersects[0];
      }else{
        var intersected = intersects[0].object;
        intersected.userData.tmpIntersectData = intersects ;
      }
      //console.log("intersected",intersects[0]);
      return intersected;
    } else {
      return null;
    }
  };

  SelectionHelper.prototype.selectObjectAt = function(x, y) {
    var intersects = this.pick(x,y,false);
    if (intersects.length > 0) {
      intersected = intersects[0].object;
      intersected._data = {};
      intersected._data.face = intersects[0].face;
      intersected._data.point = intersects[0].point;
      //console.log("intersected",intersected);
      
      if ((_ref = intersected.name) === "hoverOutline" || _ref === "selectOutline" || _ref === "boundingCage") {
        intersected = intersected.parent;
      }
      if (intersected !== this.currentSelect) {
        this._unSelect();
        this._onSelect(intersected);
        return this.currentSelect;
      } else {
        return this.currentSelect;
      }
    } else {
      return this._unSelect();
    }
  };

  SelectionHelper.prototype.highlightObjectAt = function(x, y) {
    var intersects = this.pick(x,y,false);
    if (intersects.length > 0) {
      if (intersects[0].object !== this.currentHover) {
        if (intersects[0].object.name !== "workplane" && intersects[0].object.name !== "hoverOutline" && intersects[0].object.name !== "boundingCage") {
          this._unHover();
          return this._onHover(intersects[0].object);
        }
      }
    } else {
      return this._unHover();
    }
  };

