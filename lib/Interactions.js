//short press (tap) + no move         ===> select/unselect
//long press + without move           ===> context menu ?
//long press + move                   ===> rotate camera/pan

function Interaction
{
  this._actionInProgress = false;
  
  this._longAction = false;
  this._longStaticTap = false;
}

Interaction.prototype.onPointerDown=function()
{
  this._noMove = true;
  this._actionInProgress = true;
  this._pushStart = new Date().getTime();
}

Interaction.prototype.onPointerUp=function()
{
  var _pushEnd = new Date().getTime();
  var _elapsed = _pushEnd - this._pushStart;

  this._longAction = !(_elapsed <= 125);
  this._longStaticTap = (_elapsed >= 300 && this._noMove == true);
}
  

