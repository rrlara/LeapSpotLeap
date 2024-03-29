_SPDEV = {};
var geolat = null;
var geolon = null;

var geoPoints = null;

var geoPointsSEA = null;


var _SEAsurveyPointLayerCircles;

var SEAmarkers = null;

var _keycount = 0;






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

        createMoments(imageTimeStamp, _itemCount, comment)
    });




}

function createMoments(imageTimeStamp, count, comment){
	
	
	
	var momentImage = imageTimeStamp;
	
	var momentPanel = $("<div id='moments' class='moment clearfix'></div>").appendTo('#momentPanelContainer');
	
	var locationNameWrapper = $("<div id='locationNameWrapper' class='moment clearfix'></div>").appendTo(momentPanel);

    var locationName = $("<span class = 'momentText'>" + count + "</span><span class = 'momentText'> - Seattle, WA</span>").appendTo(locationNameWrapper);
	
	var imageWrapper = $("<div id='usersImageWrapper' class='moment clearfix'></div>").appendTo(momentPanel);
	
	var momentImageDiv = $('<img width="320" height="200" class= "images1" src="https://s3-us-west-2.amazonaws.com/leapspotleap/' + momentImage  + '.jpg" />').appendTo(imageWrapper);
	
	var noteWrapper = $("<div id='usersNoteWrapper' class='moment clearfix'></div>").appendTo(momentPanel);
	
    var comment = $("<span class = 'momentText'>" + comment + "</span>").appendTo(noteWrapper);
	
}



function init(){
	
	//$("#sidebarOff").click(slideLocationPanelWrapperOut);
	
	$('#individualPlot').click(clickDetailPanelTab2);
	
	$('#districtLevel').click(clickDetailPanelTab2);
	
	
}

function clickDetailPanelTab2() {
	$(this).addClass('active1').siblings().removeClass('active1');
	
	viewIndividualPlotsStats();

}

function viewIndividualPlotsStats() {
	
	

    if ($('#individualPlot').hasClass('active1')) {
    

        removeMexicoPoints();

        //getSEAPoints();
        
        if (!geoPointsSEA) {
        	getCurrentPoints();
        	console.log("getting SEA Observations");
	    } else {
	        addSEAPoints();
	        console.log("getting SEA Layer");
	        _SPDEV.Map.map.fitBounds(SEAmarkers);
	    }





    } else {
        
        //getMexicoPoints();
        
        removeThailandPoints();
        
        if (!geoPoints) {
        getMexicoPoints();
        console.log("getting Mexico Observations");
	    } else {
	        addMexicoPoints();
	        console.log("getting Mexico Layer");
	        _SPDEV.Map.map.fitBounds(Mexicomarkers);
	    }

  
    }
}

function addMexicoPoints(){
	
	_SPDEV.Map.map.addLayer(Mexicomarkers);
	//_SPDEV.Map.map.addLayer(_RouteGeoJSON);
	//addOutlineDistrictsBoundaries();
}

function removeMexicoPoints(){
	_SPDEV.Map.map.removeLayer(Mexicomarkers);
	//_SPDEV.Map.map.removeLayer(_RouteGeoJSON);
}

function addSEAPoints(){
	
	_SPDEV.Map.map.addLayer(SEAmarkers);
	//_SPDEV.Map.map.addLayer(_RouteGeoJSON);
	//addOutlineDistrictsBoundaries();
}

function removeThailandPoints(){
	_SPDEV.Map.map.removeLayer(SEAmarkers);
	//_SPDEV.Map.map.removeLayer(_RouteGeoJSON);
}



function slideLocationPanelWrapperOut(){
	
	$("#locationPanelWrapper").animate({"right":"0px"}, "slow");
	
}

function slideLocationPanelWrapperOut(){
	
	$("#locationPanelWrapper").animate({"right":"-320px"}, "slow");
	
}

/*
function locateMe (position) {
	console.log(position);
  geolat = position.coords.latitude;
  geolon =  position.coords.longitude;
}
*/

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


//Load points GeoJSON and add to map
function getCurrentPoints(){
	
	 var postArgs = {
               
               
            };
            
            
            //var url = 'https://s3-us-west-2.amazonaws.com/leapspotleap/Observations.json';
            
            var url = APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/Observations.json"

            //Send POST, using JSONP
            $.getJSON(url, postArgs).done(function (data) {
           
                geoPointsSEA = data;
                
                console.log(geoPointsSEA); 
                
                
                 //onPointResults(geoPointsSEA);
                 
                 getMomentInfo(geoPointsSEA);
                 
                 //var image = "https://s3-us-west-2.amazonaws.com/travels2013/" + feature.properties.timestamp;
                 
                 function onEachFeature(feature, layer) {
                 	
                 	var counts = new String(_keycount--);
                 	
                 	counts = (counts.split('-')[1]);
                 	 
                 	 var image = '<A HREF="' + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + feature.properties.timestamp + '.jpg" TARGET="NEW"><img width="100" height="100" class="imageThumbnail" src="' + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + feature.properties.timestamp + '.jpg" /></A>';
					
					
					
                 	//var image = '<img src="https://s3-us-west-2.amazonaws.com/travels2013/' + feature.properties.timestamp + '.jpg" height="100" width="100">';
				    layer.bindPopup('<h2>' + counts + " - " + feature.properties.comment + '</eh2>' + '<br />' + 
				      '<span class="comments">Time Stamp: ' + feature.properties.timestamp + '</span><br />' + 
				      '<span class="comments">lat/lng: ' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + '</span><br />' + 
				      image || ""
				      );
				    
				      
					
					layer.on("mouseover", function(e) {
						
						panelDiv = feature.properties.timestamp;
						
						$("#" + panelDiv).addClass("activepanel");
						
						console.log(panelDiv);
						//$("#" + markerid).animate({scrollTop:$("#" + markerid).position().top}, 'slow');
				
						
						
						//$("#" + markerid).css("color","#009fe4");
						
					});
					
					layer.on("mouseout", function(e) {
			            $("#" + panelDiv).removeClass("activepanel");
			            
			            console.log(panelDiv);
	            
	        		});
				      
				      
				  }
				  
				 var treeIcon = L.icon({
				      iconUrl: 'images/tree_small.png'
				    });

                
                var geojsonMarkerOptions = {
				    radius: 8,
				    fillColor: "#ffae19",
				    color: "#fff",
				    weight: 1,
				    opacity: 1,
				    fillOpacity: 1
				};
				
				_SEAsurveyPointLayerCircles = L.geoJson(data.features, {
				    pointToLayer: function (feature, latlng) {
				        return L.circleMarker(latlng, geojsonMarkerOptions);
				    },
				    
				    onEachFeature: onEachFeature
				
				});
				
				SEAmarkers = L.markerClusterGroup({showCoverageOnHover: false,maxClusterRadius: 40});
				    SEAmarkers.addLayer(_SEAsurveyPointLayerCircles);
    				_SPDEV.Map.map.addLayer(SEAmarkers);
    				
    				
    			_SPDEV.Map.map.fitBounds(SEAmarkers);
    			
    			
    			
				
				
                
                
                
            }).fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ', ' + error;
                console.log("Request Failed: " + err);
            });
            
           
			    
}

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



function loadLeafMaps(){
	
	_SPDEV.Map = new _SPDEV.LeafletMap("map", {
			basemapUrl:'http://{s}.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/{z}/{x}/{y}.png',
			latitude: 47.6029766,
		    longitude: -122.30845169999999,
		    zoom: 4

			});
	
	
	_SPDEV.Map.addBasemap('terrain', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/{z}/{x}/{y}.png', {});
	_SPDEV.Map.addBasemap('streets', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-rpljvvub/{z}/{x}/{y}.png', {});
	_SPDEV.Map.addBasemap('darkCanvas', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-c9z2cyef/{z}/{x}/{y}.png', {});
	_SPDEV.Map.addBasemap('aerial', 'http://{s}.tiles.mapbox.com/v3/spatialdev.map-hozgh18d/{z}/{x}/{y}.png', {});
	
	//getMexicoPoints();
	setTimeout(function() {
      // Do something after 5 seconds
      getCurrentPoints();
      
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
				continuousWorld: this.continuousWorld
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

