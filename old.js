//FIXME: workaround for bad child element insertion order
        /*if(this._tmpBuff)
        {
          for(var i=this._tmpBuff.length-1;i >= 0 ; i--)
          {
            var child = this._tmpBuff[i];
            var childObj = child.object;
            this._tmpBuff.splice(i, 1);
             if(child.object &&  CustomElements.instanceOf(child, three-js-scene ) && child.localName !== 'three-js-orbitcontrols')//child.localName !== 'three-js-scene' && child.localName !== 'three-js-orbitcontrols')
            {
              console.log("SCENE");
              //console.log("in root: child", child.localName, "added to ", this.localName);
              this.scene.add(child.object);
            }
            else if(child.object && CustomElements.instanceOf(child, three-js-orbitcontrols ) )//child.localName === 'three-js-orbitcontrols')
            {
              console.log("lkmklmlk");
              child.init(this.camera,this.renderer);
              this.controls = child.object;
              //this.controls.addEventListener("change",function(){console.log("controls changed")})
            }
          }
        } */ 
