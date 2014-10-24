

computeObject3DBoundingBox = function(object, force)
{
  var force = force === undefined ? false: force;
  
  if( object.geometry === undefined)
  {
      var bbox = new THREE.Box3();
  }
  else
  {
    
    if ((! object.geometry.boundingBox) || force )
    {
      object.geometry.computeBoundingBox();
    } 
    var bbox = object.geometry.boundingBox.clone();
  }
  
  object.traverse(function (child) {

    if (child instanceof THREE.Mesh)
    {
        if( child.geometry !==undefined)
        {
             
          if ((! child.geometry.boundingBox) || force ){
            child.geometry.computeBoundingBox();
          }
          var childBox = child.geometry.boundingBox.clone();
          childBox.translate( child.localToWorld( new THREE.Vector3() ) );
          bbox.union( childBox );
        }
    }
  });
  object.boundingBox = bbox;
  return bbox
}

computeObject3DBoundingSphere_old = function(object, force)
{
  object.boundingSphere = computeObject3DBoundingBox(object, force).getBoundingSphere();
  return object.boundingSphere;
}


computeObject3DBoundingSphere = function(object, force)
{
  var bbox = new THREE.Box3().setFromObject( object );
  
  if(object.boundingBox) object.boundingBox.copy( bbox );
  if(!object.boundingBox) object.boundingBox= bbox ;
  object.boundingSphere = bbox.getBoundingSphere();
  return object.boundingSphere;
}
