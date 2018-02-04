console.log('loading google map');
  ///////////////////////////////
  // google map
  ///////////////////////////////

var mapOptions = {
  center:new google.maps.LatLng(33.7537,-84.3850),
  zoom:6,
  mapTypeId:google.maps.MapTypeId.ROADMAP,
  disableDefaultUI: true,
  scrollwheel: false
  };
var map=new google.maps.Map(document.getElementById("googleMap")
  ,mapOptions);

//to recenter map when window resizing
google.maps.event.addDomListener(window, 'resize', function() {
    var center = map.getCenter()
    google.maps.event.trigger(map, "resize")
    map.setCenter(center)
})
