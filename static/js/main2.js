var heatmap;
var heatmapData = new Array();

$(function() {
  var mapOptions = {
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(41.909, 12.489) // Rome, Italy
  };
  
  var map = new google.maps.Map($("#map")[0], mapOptions); 
  
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData
  });
  heatmap.setMap(map);

  var socket = io.connect('http://' + window.location.hostname);
  socket.on('news', function (data) {
    if(data != null) {
      var pos = new google.maps.LatLng(data.latitude, data.longitude);
      
      heatmapData.push(pos);
      heatmap.setData(heatmapData);
    }
  });
});
