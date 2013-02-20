var positionHistory = new Array();
var maxPosHistory = 100;
var positionOldest = 0;

google.maps.Map.prototype.clearOverlays = function() {
  for(var i=0; i < positionHistory.length; i++) {
    positionHistory[i].setMap(null);
  }
}

$(function() {
  var mapOptions = {
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(41.909, 12.489) // Rome, Italy
  };
  
  var map = new google.maps.Map($("#map")[0], mapOptions); 

  $("#slider").slider({
    value: maxPosHistory,
    min: 0,
    max: 500,
    step: 25,
    slide: function( event, ui ) {
      if(maxPosHistory > ui.value) {
        for(var i = ui.value; i <= maxPosHistory; i++) {
           if(positionHistory[i]) {
             positionHistory[i].setMap(null);
           }
        }
      }
      maxPosHistory = ui.value;
      $("#amount").val(maxPosHistory);
    }
  });
  $("#amount").val($("#slider").slider("value"));
  
  var socket = io.connect('http://' + window.location.hostname);
  socket.on('news', function (data) {
    if(data != null) {
      var pos = new google.maps.LatLng(data.latitude, data.longitude);
      var marker = new google.maps.Marker({
        map: map,
        draggable: false,
        animation: null, //google.maps.Animation.DROP,
        position: pos
      });
      if(positionOldest > maxPosHistory) {
        positionHistory[positionOldest % maxPosHistory].setMap(null);
      }
      positionHistory[positionOldest % maxPosHistory] = marker; 
      positionOldest++;
    }
  });
});
