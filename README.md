three-js
============================

Three.js based custom element(s), ie things like:


      <three-js id="threeJs">
          <three-js-webglRenderer id="webglRenderer"></three-js-webglRenderer>
          <three-js-scene name="main" active pickable>
            <three-ambientLight color="0x565523" intensity="4"> </three-ambientLight>
          </three-js-scene>
          <three-js-viewport name="perspective" id="perspectiveView">
            <three-js-combinedCamera pos="[150,75,180]" orientation="diagonal" up=[0,0,1]></three-js-combinedCamera>
            <three-js-orbitControls cameraUp=[0,0,1]> </three-js-orbitControls>
          </three-js-viewport>
      </three-js>

It provides custom elements and an api to set up 3d viewers/editors/noodles/whatever real fast.



Base structure:
---------------

- everything needs to be within a "<three-js> </three-js>" tag
- three-js-scene for a 3d scene (wrapper around three.js scene + some extras)

Renderers:
----------

- webglRenderer, with fallback on canvasRenderer
- css3DRenderer

Basic objects:
--------------

  - TODO (implemented)

Lights:
-------

 - ambientlight
 - pointlight
 - hemisphere
 - directional

Post-processing
---------------

  - TODO (implemented)


The programatic API
-------------------

  - addToScene:
     Add any three.js (note the dot, not dash) object to the given scene.

     Defaults to the first acive scene if no sceneName is specified

        threeJs.addToScene( object, sceneName )


Notes:
=====

- you can find some additional components (grid, axis, etc) for **three-js** here : https://github.com/usco/three-js-helpers

- This is a mix between my old attempt at creating three.js custom elements and the Polymer team's own THREE-JS elements

Licence
=======
MIT
