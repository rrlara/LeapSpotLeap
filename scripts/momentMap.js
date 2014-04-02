_MomentMap = {};

// function getPopupContent(lat,lng,timestamp,comment, timesince){
//
//   var image = '<A width="100%" HREF="' + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + timestamp + '.jpg" TARGET="NEW"><img width="100" height="100" class="imageThumbnail" src="' + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + timestamp + '.jpg" /></A>';
//
//
//   var content = '<h3>' + comment + '</h3>' + '<br />' +
//     '<span class="comments">' + timesince + '</span><br />' +
//     '<span class="comments">(' + lat + "," + lng + ')</span><br />' +
//     image || "";
//
//     return content;
//
// }

function loadLeafMomentMaps(){

  _MomentMap.Map = new _MomentMap.LeafletMap("map", {
      basemapUrl:'http://{s}.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/{z}/{x}/{y}.png',
      latitude: 47.6029766,
      longitude: -122.30845169999999,
      zoom: 4,

      zoomControl:false,
      touchZoom: false,
	  		doubleClickZoom: false,
	  		zoomControl: false,
	  		dragging: false,

      });


  _MomentMap.Map.addBasemap('terrain', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/{z}/{x}/{y}.png', {});
  _MomentMap.Map.addBasemap('streets', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-rpljvvub/{z}/{x}/{y}.png', {});
  _MomentMap.Map.addBasemap('darkCanvas', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-c9z2cyef/{z}/{x}/{y}.png', {});
  _MomentMap.Map.addBasemap('aerial', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-hozgh18d/{z}/{x}/{y}.png', {});


  setTimeout(function() {


    }, 1000);

}



_MomentMap.LeafletMap = function(mapId, options) {
    // set up the map options or defaults
    var scrollWheelZoom = options.scrollWheelZoom || false;
    var keyboard = options.keyboard || false;
    this.minZoom = options.minZoom || 0;
    this.maxZoom = options.maxZoom || 18;
    var loadZoom = options.loadZoom || 10;
    var attributionTxt = options.attributionTxt || '';
    this.tileSize = options.tileSize || 256;
    this.continuousWorld = options.continuousWorld || false;
    var centerLatitude = options.latitude || -16.5;
    var centerLongitude = options.longitude || -67;
    var basemapUrl = options.basemapUrl || 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';


    this.map  = new L.Map(mapId, {
        'keyboard': keyboard,
        'scrollWheelZoom': scrollWheelZoom,


                });

    // create the basemap layer
    this.basemaps = {};
    this.basemaps.mapDefault = L.tileLayer(basemapUrl,
      {
          minZoom: this.minZoom,
          maxZoom: this.maxZoom,
          attribution: attributionTxt,
          tileSize: this.tileSize,
        continuousWorld: this.continuousWorld,
        detectRetina: true

      });

    // Set the map view
    this.map.setView(new L.LatLng(centerLatitude, centerLongitude),loadZoom);

    // Add the basemap
    this.map.addLayer(this.basemaps.mapDefault);

    this.currentBasemap = this.basemaps.mapDefault;

    //this.geoJson( geoPoints ).addTo(Map);




    return this;
};

_MomentMap.LeafletMap.prototype.addBasemap = function(key, basemapUrl, options) {
    var minZoom = options.minZoom || this.minZoom;
    var maxZoom = options.maxZoom || this.maxZoom ;
    var attributionTxt = options.attributionTxt || '';
    var tileSize = options.tileSize || 		this.tileSize;
    var continuousWorld = options.continuousWorld || this.continuousWorld;

    this.basemaps[key] = L.tileLayer(basemapUrl,
      {
          'minZoom': minZoom,
          'maxZoom': maxZoom,
          'attribution': attributionTxt,
          'tileSize': tileSize,
        'continuousWorld': continuousWorld
      });

};

_MomentMap.LeafletMap.prototype.changeBasemap  = function(basemapKey) {

  this.map.removeLayer(this.currentBasemap);
  this.map.addLayer(this.basemaps[basemapKey]);
  this.currentBasemap = this.basemaps[basemapKey];
};
