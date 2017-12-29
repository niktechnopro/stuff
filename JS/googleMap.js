console.log('google map loading');
  ///////////////////////////////
  // google map
  ///////////////////////////////

function myMap()
{
var mapOptions = {
  center:new google.maps.LatLng(51.508742,-0.120850),
  zoom:5,
  mapTypeId:google.maps.MapTypeId.ROADMAP,
  disableDefaultUI: true,
  scrollwheel: false
  };
var map=new google.maps.Map(document.getElementById("googleMap")
  ,mapOptions);
}
