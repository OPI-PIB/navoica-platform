function showTip() {
  var tip = document.getElementById("tooltip");
  var btntip = document.getElementById("btntip");
  var message = btntip.getAttribute('tooltip-message');
  btntip.setAttribute("aria-expanded", "true");
  tip.innerHTML=message;
  tip.setAttribute("style", "display: block;");
}

function hideTip() {
  var tip = document.getElementById("tooltip");
  var btntip = document.getElementById("btntip");
  btntip.setAttribute("aria-expanded", "false");
  tip.innerHTML = "";
  tip.setAttribute("style", "display: none;");
}

function toggleTip (event) {
  var tip = document.getElementById("tooltip");
  if (window.getComputedStyle(tip).getPropertyValue('display') === 'none') {
    showTip();
  }
  else {
    hideTip();
  }
}

$(document).ready(function() {

  var btntip = document.getElementById("btntip");

  btntip.addEventListener("mousemove", function (event) {
    showTip();
  });

  btntip.addEventListener("mouseout", function (event) {
    hideTip();
  });

  btntip.addEventListener("blur", function (event) {
    hideTip();
  });

  btntip.addEventListener("click", toggleTip, false);

  btntip.addEventListener('keyup', function (event){
    var key = event.which || event.keyCode || event.key;
    if (key === 27) {
      hideTip();
    }
  });
});
