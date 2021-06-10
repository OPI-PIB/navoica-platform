
function showTip(idbtn) {
  var idtip = idbtn.getAttribute('aria-describedby');
  var tip = document.getElementById(idtip);
  var message = idbtn.getAttribute('tooltip-message');
  idbtn.setAttribute("aria-expanded", "true");
  tip.innerHTML=message;
  tip.setAttribute("style", "display: block;");
}

function hideTip(idbtn) {
  var idtip = idbtn.getAttribute('aria-describedby');
  var tip = document.getElementById(idtip);
  idbtn.setAttribute("aria-expanded", "false");
  tip.innerHTML = "";
  tip.setAttribute("style", "display: none;");
}

function toggleTip (idbtn) {
  var idtip = idbtn.getAttribute('aria-describedby');
  var tip = document.getElementById(idtip);
  if (window.getComputedStyle(tip).getPropertyValue('display') === 'none') {
    showTip(idbtn);
  }
  else {
    hideTip(idbtn);
  }
}

$(document).ready(function() {

  var btntip = document.getElementsByClassName('js-tooltips');

  var tooltips = document.querySelectorAll('.js-btntip');
  
  if (btntip) {
    for (var i= 0; i < tooltips.length; i++) {
  
      tooltips[i].addEventListener("mousemove", function (event) {
        var idbtn = document.getElementById(this.getAttribute('id'));
        showTip(idbtn);
      });

      tooltips[i].addEventListener("mouseout", function (event) {
        var idbtn = document.getElementById(this.getAttribute('id'));
        hideTip(idbtn);
      });

      tooltips[i].addEventListener("blur", function (event) {
        var idbtn = document.getElementById(this.getAttribute('id'));
        hideTip(idbtn);
      });

      tooltips[i].addEventListener("click", function (event) {
        var idbtn = document.getElementById(this.getAttribute('id'));
        toggleTip(idbtn);
      });  

      tooltips[i].addEventListener('keyup', function (event) {
        var key = event.which || event.keyCode || event.key;
        if (key === 27) {
          var idbtn = document.getElementById(this.getAttribute('id'));
          hideTip(idbtn);
        }
      });
    }
  }
});
