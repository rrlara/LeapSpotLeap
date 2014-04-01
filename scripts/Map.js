_SPDEV = {};
var geolat = null;
var geolon = null;

var geoPoints = null;

var geoMomentPoints = null;


var _SEAsurveyPointLayerCircles;

var SEAmarkers = null;

var _keycount = 0;

var activemomentMarker = null;

function init(){


  loadLeafMaps();

  $('#overallMapContainer').on('click', '#fullextent', function(){
      backtoFullExtent();
  });

}


// function getCurrentMomentData(){
//
//   if(activemomentMarker){
//       _SPDEV.Map.map.removeLayer(activemomentMarker)
//   }
//
//   var lat = activeMomentData[0].value;
//   var lng = activeMomentData[1].value;
//
//   var activemomentSpot = new L.LatLng(lat, lng);
//
//   console.log(activemomentSpot);
//
//   //_SPDEV.Map.map.setView(activemomentSpot,setMomentView);
//
//   activemomentMarker = L.circleMarker([lat, lng], geojsonMarkerOptions).addTo(_SPDEV.Map.map);
//
// }

function backtoFullExtent(){
  _SPDEV.Map.map.fitBounds(_SEAsurveyPointLayerCircles);
}

function mapOverView(){

  if ($('#map-overview').length == 0) {
      // Does not exists
      var mapOverview = $("<div id='map-overview' class='' ></div>").appendTo('#overallMapContainer');
      var fullExtent = $("<div id='fullextent' class='' ></div>").appendTo(mapOverview);
      var fullExtent = $("<div id='basemapImage' class='icon-earth' ></div>").appendTo(fullExtent);

      init();
      getCurrentPoints();
    }else{
      $('#map-overview').toggle();
    }

    $("#mapPinsContainer").toggleClass('activeOverViewMap');

}

function addCachedGeoMomentPoints(){

	_SPDEV.Map.map.addLayer(geoMomentPoints);

}



/*
function getMomentInfo(data){

    $("#momentPanelContainer").empty();

    var pointdata = data.features;
    //pointdata = pointdata.reverse();
    var numberOfPoints = data.features.length;

    console.log(pointdata);

    //var keycount = 0;



    if(numberOfPoints === 0) {
        return;
    }

    $.each(data.features, function (keycount, item) {

        //console.log(keycount + 1);

        //$("#surveystat").text(keycount + 1);

        var imageTimeStamp = item.properties.timestamp;

        var comment = item.properties.comment;

        //console.log(imageTimeStamp);


        //keycount++;
        _itemCount = numberOfPoints - keycount;

        //createMoments(imageTimeStamp, _itemCount, comment)
    });




}



function createMoments(imageTimeStamp, count, comment){



	var momentImage = imageTimeStamp;

	var momentPanel = $("<div id='moments' class='moment clearfix'></div>").appendTo('.pad2');

	var locationNameWrapper = $("<div id='locationNameWrapper' class='moment clearfix'></div>").appendTo(momentPanel);

    var locationName = $("<span class = 'momentText'>" + count + "</span><span class = 'momentText'> - Seattle, WA</span>").appendTo(locationNameWrapper);

	var imageWrapper = $("<div id='usersImageWrapper' class='moment clearfix'></div>").appendTo(momentPanel);

	var momentImageDiv = $('<img width="100%" class= "images1" src="https://s3-us-west-2.amazonaws.com/leapspotleap/' + momentImage  + '.jpg" />').appendTo(imageWrapper);

	var noteWrapper = $("<div id='usersNoteWrapper' class='moment clearfix'></div>").appendTo(momentPanel);

    var comment = $("<span class = 'momentText'>" + comment + "</span>").appendTo(noteWrapper);

}













function onPointResults(data)  {

	stringlineArray = [];

	//var topGeoJson = '{ "type": "FeatureCollection","features": [{ "type": "Feature","geometry": {"type": "LineString","coordinates":[';

	var topGeoJson = ['{"type": "LineString","coordinates": ['];

	stringlineArray.push(topGeoJson);

	var pointdata = data.features;
	pointdata = pointdata.reverse();
	var numberOfPoints = data.features.length;
	console.log(numberOfPoints);

	if(numberOfPoints === 0) {
		return;
	}

	for(var i=0; i < numberOfPoints; i++) {
		var pointData = pointdata[i];
		//console.log(pointData);
		var lat = pointData.geometry.coordinates[1];
		var lng = pointData.geometry.coordinates[0];
		//console.log("lat: ",lat);
		//console.log("lng: ", lng);

		if (lat && lng){

			var pointItem = "[" + lng + ", " + lat + "],";

			//console.log(pointItem);

			stringlineArray.push(pointItem);

		}

	}

	//SEAPointArray.shift();

	//var bottomGeoJson = [']}'];

	stringlineArray.push(']}');

	//var GeoJSONLineString = topGeoJson.concat(SEAPointArray, bottomGeoJson);

	//console.log(GeoJSONLineString);

	var myVar = stringlineArray.join("");

	myVar = myVar.replace(/,(?=[^,]*$)/, '');


	console.log(myVar);

	_geoJSONLine = jQuery.parseJSON(myVar);



	console.log(_geoJSONLine);


	var myStyle = {
		"color" : "#000000",
		"weight" : 2,
		"opacity" : 0.55,
		"dashArray": 15
	};



}

*/



function getPopupContent(lat,lng,timestamp,comment, timesince){

  var image = '<A width="100%" HREF="' + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + timestamp + '.jpg" TARGET="NEW"><img width="100" height="100" class="imageThumbnail" src="' + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + timestamp + '.jpg" /></A>';


  var content = '<h3>' + comment + '</h3>' + '<br />' +
    '<span class="comments">' + timesince + '</span><br />' +
    '<span class="comments">(' + lat + "," + lng + ')</span><br />' +
    image || "";

    return content;

}

//Load points GeoJSON and add to map
function getCurrentPoints(){

	 var postArgs = {


            };


            //var url = 'https://s3-us-west-2.amazonaws.com/leapspotleap/Observations.json';

            var url = APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + APP_CONFIG.creds.aws.observations +  ""

            //Send POST, using JSONP
            $.getJSON(url, postArgs).done(function (data) {

                geoMomentPoints = data;

                console.log(geoMomentPoints);


                 //onPointResults(geoMomentPoints);

                 //getMomentInfo(geoMomentPoints);

                 //var image = "https://s3-us-west-2.amazonaws.com/travels2013/" + feature.properties.timestamp;

                 function onEachFeature(feature, layer) {

                    var comment = feature.properties.comment;
                    var timestamp = feature.properties.timestamp;
                    var lat = feature.geometry.coordinates[1];
                    var lng = feature.geometry.coordinates[0];




                 	//var image = '<img src="https://s3-us-west-2.amazonaws.com/travels2013/' + feature.properties.timestamp + '.jpg" width="100%">';
				    layer.bindPopup(getPopupContent(lat,lng,timestamp,comment));



					layer.on("mouseover", function(e) {

						panelDiv = feature.properties.timestamp;

						$("#" + panelDiv).addClass("activepanel");

						console.log(panelDiv);

            //$("#" + panelDiv).animate({scrollTop:$("#" + panelDiv).position()}, 'slow');

            slideMomentToTopOnHover(panelDiv);

						//$("#" + markerid).css("color","#009fe4");

					});

					layer.on("mouseout", function(e) {


			           //console.log(panelDiv);

                 slideMomentToTopOnHover(panelDiv);

	        		});


				  }



				 var treeIcon = L.icon({
				      iconUrl: 'images/tree_small.png'
				    });


        var geojsonMarkerClusterOptions = {
				    radius: 8,
				    fillColor: "#3c4e5a",
				    color: "#fff",
				    weight: 1,
				    opacity: 1,
				    fillOpacity: 1
				};

				_SEAsurveyPointLayerCircles = L.geoJson(data.features, {
				    pointToLayer: function (feature, latlng) {
				        return L.circleMarker(latlng, geojsonMarkerClusterOptions);
				    },

				    onEachFeature: onEachFeature

				});


				SEAmarkers = L.markerClusterGroup({showCoverageOnHover: false,maxClusterRadius: 60,singleMarkerMode: true,spiderfyOnMaxZoom: false});
				    SEAmarkers.addLayer(_SEAsurveyPointLayerCircles);
    				_SPDEV.Map.map.addLayer(SEAmarkers);

        _SPDEV.Map.map.addLayer(SEAmarkers);


    		_SPDEV.Map.map.fitBounds(SEAmarkers);

        console.log(SEAmarkers);

        SEAmarkers.on('clusterclick', function (a) {
            console.log('cluster ' + a.layer.getAllChildMarkers().length);
            console.log( a.layer._markers);

        });

        // SEAmarkers.on('click', function (a) {
        //     console.log(a.layer);
        // });









            }).fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ', ' + error;
                console.log("Request Failed: " + err);
            });



}

/*

function imageLoader(comments, timestamp){

	//var imageSize = '<img width="70" height="60" src="https://s3-us-west-2.amazonaws.com/travels2013/' + timestamp + '.jpg" />'

	var imageSize = '<img src="' + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/"  + timestamp + '.jpg" >';


	console.log(imageSize);

	var imageDiv = document.createElement("div");
        imageDiv.id = "image_" + timestamp;
        imageDiv.className = "imageThumbnail";
        //imageDiv.innerHTML = '<img src="https://s3-us-west-2.amazonaws.com/travels2013/' + timestamp + '.jpg" height="60" width="70">';

        imageDiv.innerHTML = '<A HREF="' + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/"  + timestamp + '.jpg" TARGET="NEW"><img width="70" height="60" src="' + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/"  + timestamp + '.jpg" /></A>';


        $("#locationPanelWrapper").append(imageDiv);

}
*/


function loadLeafMaps(){

	_SPDEV.Map = new _SPDEV.LeafletMap("map-overview", {
			basemapUrl:'http://{s}.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/{z}/{x}/{y}.png',
			latitude: 47.6029766,
		    longitude: -122.30845169999999,
		    zoom: 4,
        detectRetina: true

			});


	_SPDEV.Map.addBasemap('terrain', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/{z}/{x}/{y}.png', {});
	_SPDEV.Map.addBasemap('streets', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-rpljvvub/{z}/{x}/{y}.png', {});
	_SPDEV.Map.addBasemap('darkCanvas', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-c9z2cyef/{z}/{x}/{y}.png', {});
	_SPDEV.Map.addBasemap('aerial', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-hozgh18d/{z}/{x}/{y}.png', {});

	//getMexicoPoints();
	setTimeout(function() {
      // Do something after 5 seconds
      //getCurrentPoints();

		}, 1000);
	//getSEAPoints();
}




_SPDEV.LeafletMap = function(mapId, options) {
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

_SPDEV.LeafletMap.prototype.addBasemap = function(key, basemapUrl, options) {
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

_SPDEV.LeafletMap.prototype.changeBasemap  = function(basemapKey) {

	this.map.removeLayer(this.currentBasemap);
	this.map.addLayer(this.basemaps[basemapKey]);
	this.currentBasemap = this.basemaps[basemapKey];
};
