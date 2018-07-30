var theClock = document.querySelector('#clock');
var theBody = document.querySelector('body');
var theScreenX = document.querySelector('#screenX');
var theScreenY = document.querySelector('#screenY');
var theClientX = document.querySelector('#clientX');
var theClientY = document.querySelector('#clientY');
var theTest = document.querySelector('#test');
var offButton = document.querySelector('#off');

theClock.addEventListener('click', function(){
    console.log("clicked");
  })

theBody.onmousemove = function(e){
      theClientX.innerHTML = e.clientX;
      theScreenX.innerHTML = e.screenX;
      theClientY.innerHTML = e.clientY;
      theScreenY.innerHTML = e.screenY;
      console.log(e.clientY + "px");
      offButton.style.top= e.screenY + "px";
      offButton.style.right= (1500- e.screenX )+ "px";
    }

theTest.classList.add('red');

var newTitle = document.createElement('h2');
var titleText = document.createTextNode('new title here');

newTitle.appendChild(titleText);
theTest.appendChild(newTitle);

console.log(newTitle);
