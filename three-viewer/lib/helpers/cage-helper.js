
THREE.BoundingCage = function () {
}

class BoundingCage extends BaseHelper
    #Draws a bounding box (wireframe) around a mesh, and shows its dimentions
    constructor:(options)->
      super options
      defaults = {mesh:null,color:0xFFFFFF,textColor:"#FFFFFF",addLabels:true}
      options = merge defaults, options
      {mesh, @color, @textColor,@addLabels} = options
      color = new THREE.Color().setHex(@color)
      #attempt to draw bounding box
      try
        if not mesh.geometry.boundingBox
          mesh.geometry.computeBoundingBox()
        bbox = mesh.geometry.boundingBox
        length = bbox.max.x-bbox.min.x
        width  = bbox.max.y-bbox.min.y
        height = bbox.max.z-bbox.min.z
        
        cageGeo= new THREE.CubeGeometry(length,width,height)
        v=(x,y,z)->
           return new THREE.Vector3(x,y,z)
       
        ###lineMat = new THREE.LineBasicMaterial
          color: helpersColor
          lineWidth: 2
        ###
        lineMat = new THREE.MeshBasicMaterial
          color: color
          wireframe: true
          shading:THREE.FlatShading
        
        cage = new THREE.Object3D()#new THREE.Mesh(cageGeo, lineMat)
        #cage = new THREE.Line(cageGeo, lineMat, THREE.Lines)
        middlePoint=(geometry)->
          middle  = new THREE.Vector3()
          middle.x  = ( geometry.boundingBox.max.x + geometry.boundingBox.min.x ) / 2
          middle.y  = ( geometry.boundingBox.max.y + geometry.boundingBox.min.y ) / 2
          middle.z  = ( geometry.boundingBox.max.z + geometry.boundingBox.min.z ) / 2
          return middle
        
        delta = middlePoint(mesh.geometry)
        cage.position = delta
        
        
        
        widthArrowPos = new THREE.Vector3( length/2+10, 0, -height/2 )
        lengthArrowPos = new THREE.Vector3( 0, width/2+10, -height/2)
        heightArrowPos = new THREE.Vector3( -length/2-5,-width/2-5,0)
        
        if @addLabels
          labelSize = 24
          widthLabel=@drawText("#{width.toFixed(2)}",labelSize)
          widthLabel.position = widthArrowPos 
          
          lengthLabel=@drawText("#{length.toFixed(2)}",labelSize)
          lengthLabel.position = lengthArrowPos
    
          heightLabel=@drawText("#{height.toFixed(2)}",labelSize)
          heightLabel.position = heightArrowPos
          
          cage.add widthLabel
          cage.add lengthLabel
          cage.add heightLabel
       
          widthLabel.material.depthTest = false
          widthLabel.material.depthWrite = false
          widthLabel.material.side= THREE.FrontSide 
          
          lengthLabel.material.depthTest = false
          lengthLabel.material.depthWrite = false
          lengthLabel.material.side= THREE.FrontSide 
          
          heightLabel.material.depthTest = false
          heightLabel.material.depthWrite = false
          heightLabel.material.side= THREE.FrontSide 
          
          
       
        forceOverlay=(arrows,sideLines)=>
          for arrow in arrows
            arrow.cone.material.side= THREE.FrontSide 
            arrow.line.material.side= THREE.FrontSide 
            #arrow.line.material.depthWrite = false
            arrow.line.material.depthTest = false
            #arrow.cone.material.depthWrite = false
            arrow.cone.material.depthTest = false
            arrow.line.renderDepth = 1e20
            arrow.cone.renderDepth = 1e20
          
          for line in sideLines
            line.material.side= THREE.FrontSide 
            line.material.depthTest = false
            line.renderDepth = 1e20
          
        require 'ArrowHelper2'  
        
        widthArrow1 = new THREE.ArrowHelper2(new THREE.Vector3(0,-1,0),widthArrowPos,width/2, 0x000000)
        widthArrow2 = new THREE.ArrowHelper2(new THREE.Vector3(0,1,0),widthArrowPos,width/2, 0x000000)
        
        widthLineGeometry = new THREE.Geometry();
        widthLineGeometry.vertices.push( new THREE.Vector3( length/2, width/2, -height/2 ) );
        widthLineGeometry.vertices.push( new THREE.Vector3( length/2+10, width/2, -height/2 ) );
        widthLine = new THREE.Line( widthLineGeometry, new THREE.LineBasicMaterial( { color: 0x000000,depthTest:false,depthWrite:false,renderDepth : 1e20 } ) );
        cage.add( widthLine)
        
        widthLineGeometry2 = new THREE.Geometry();
        widthLineGeometry2.vertices.push( new THREE.Vector3( length/2, -width/2, -height/2 ) );
        widthLineGeometry2.vertices.push( new THREE.Vector3( length/2+10, -width/2, -height/2 ) );
        widthLine2 = new THREE.Line( widthLineGeometry2, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
        cage.add( widthLine2)
        forceOverlay([widthArrow1,widthArrow2], [widthLine,widthLine2])
         
        lengthArrow1 = new THREE.ArrowHelper2(new THREE.Vector3(1,0,0),lengthArrowPos,length/2, 0x000000)
        lengthArrow2 = new THREE.ArrowHelper2(new THREE.Vector3(-1,0,0),lengthArrowPos,length/2, 0x000000)
        
        lengthLineGeometry = new THREE.Geometry();
        lengthLineGeometry.vertices.push( new THREE.Vector3( length/2, width/2,  -height/2 ) )
        lengthLineGeometry.vertices.push( new THREE.Vector3( length/2, width/2+10, -height/2 ) )
        lengthLine = new THREE.Line( lengthLineGeometry, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
        cage.add( lengthLine);
        
        lengthLineGeometry2 = new THREE.Geometry();
        lengthLineGeometry2.vertices.push( new THREE.Vector3( -length/2, width/2, -height/2 ) )
        lengthLineGeometry2.vertices.push( new THREE.Vector3( -length/2, width/2 +10, -height/2 ) )
        lengthLine2 = new THREE.Line( lengthLineGeometry2, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
        cage.add( lengthLine2)
        
        forceOverlay([lengthArrow1,lengthArrow2], [lengthLine,lengthLine2])
        
        
        heightArrow1 = new THREE.ArrowHelper2(new THREE.Vector3(0,0,1),heightArrowPos,height/2, 0x000000)
        heightArrow2 = new THREE.ArrowHelper2(new THREE.Vector3(0,0,-1),heightArrowPos,height/2, 0x000000)
        
        
        heightLineGeometry = new THREE.Geometry();
        heightLineGeometry.vertices.push( new THREE.Vector3( -length/2, -width/2, -height/2 ) )
        heightLineGeometry.vertices.push( new THREE.Vector3( -length/2-5, -width/2 -5, -height/2 ) )
        heightLine = new THREE.Line( heightLineGeometry, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
        
        heightLineGeometry2 = new THREE.Geometry();
        heightLineGeometry2.vertices.push( new THREE.Vector3( -length/2, -width/2, height/2 ) )
        heightLineGeometry2.vertices.push( new THREE.Vector3( -length/2-5, -width/2 -5, height/2 ) )
        heightLine2 = new THREE.Line( heightLineGeometry2, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
        
        
        forceOverlay([heightArrow1,heightArrow2], [heightLine,heightLine2])
        
        cage.add( heightLine)
        cage.add( heightLine2)
        
        
        ###
        selectionAxis = new THREE.AxisHelper(Math.min(width,length, height))
        selectionAxis.material.depthTest = false
        selectionAxis.material.transparent = true
        selectionAxis.position = mesh.position###
        #selectionAxis.matrixAutoUpdate = false
        
        dashMaterial = new THREE.LineDashedMaterial( { color: 0x000000, dashSize: 0.5, gapSize: 2, depthTest: false,linewidth:2} )
        baseCubeGeom = new THREE.CubeGeometry(length,width,0)
        baseOutline = new THREE.Line( geometryToline(baseCubeGeom.clone()), dashMaterial, THREE.LinePieces )
        baseOutline.renderDepth = 1e20
        baseOutline.position = new THREE.Vector3(delta.x,delta.y,-delta.z)
        cage.add(baseOutline)
        
        
        cage.name = "boundingCage"
        cage.add widthArrow1
        cage.add widthArrow2
        
        cage.add lengthArrow1
        cage.add lengthArrow2
        
        cage.add heightArrow1
        cage.add heightArrow2
        
        mesh.cage = cage
        mesh.add cage
        
        computeVolume(mesh)
        
      catch error
