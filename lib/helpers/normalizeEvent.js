//This is to be able to use offsetX in firefox
var normalizeEvent = function(event) 
{
  if(!event.offsetX)
  {
    var target = event.target || event.srcElement;
    var rect = target.getBoundingClientRect();
    event.offsetX = event.clientX - rect.left;
    event.offsetY = event.clientY - rect.top;
  }
  return event;
};
