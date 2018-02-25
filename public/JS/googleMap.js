console.log('loading google map');
  ///////////////////////////////
  // google map
  ///////////////////////////////
var LatLng = {lat: 33.7537, lng: -84.3850};

// infor about marker with resizing
var image = {
    url: "images/mylocation.gif", // url
    scaledSize: new google.maps.Size(50, 50), // scaled size
    // origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(30, 65) // anchor
};
// var image = 'https://i.imgur.com/FRSwoOV.gif';

var mapOptions = {
  center:new google.maps.LatLng(LatLng),
  zoom:6,
  mapTypeId:google.maps.MapTypeId.ROADMAP,
  disableDefaultUI: true,
  scrollwheel: false

};
var map=new google.maps.Map(document.getElementById("googleMap")
  ,mapOptions);

var marker = new google.maps.Marker({
        position: LatLng,
        map: map,
        title: 'I am here!',
        icon: image
      });

//to recenter map when window resizing
google.maps.event.addDomListener(window, 'resize', function() {
    var center = map.getCenter()
    google.maps.event.trigger(map, "resize")
    map.setCenter(center)
})
