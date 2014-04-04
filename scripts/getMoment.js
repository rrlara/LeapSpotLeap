var geoJSONMoments = null;


var recentMomentLat = null;
var recentMomentLng = null;



var momentLat = null;
var momentLng = null;



var momentMarker;

var momentOverviewMapMarker;

var setMomentView = 10;

var geojsonMarkerOptions = {
    radius: 10,
    fillColor: "#de6b28",
    color: "#fff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1,
    zIndexOffset: 10000
};

var activeMomentData = [];

function slideMomentToTopOnHover(id){



  var momentID = id;


  //$( 'pad2 keyline-bottom' ).scrollTo(500);








}



function initMoment(){

  //$('#content').click(hideMomentMapDiv);


  $('.pad2').on('click',".momentContainer", function(){
    var sourceDiv = this;
    var elementDivID = $(sourceDiv).attr('id');
    //console.log(elementDivID);
    slideMomentMapDiv(elementDivID);
    $("#map").click(clickMomentMapExpand);
  });



  $('#momentMainContainer').on('click',".locationMomentImage", function(){

    console.log("transfrom");

    $('#momentMainContainer').toggleClass( "momentContainerTransform" );

    _SPDEV.Map.map.fitBounds(SEAmarkers);

  });





}


function getMoments(){

   var postArgs = {};


            //var url = 'https://s3-us-west-2.amazonaws.com/leapspotleap/Observations.json';

            var url = APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + APP_CONFIG.creds.aws.observations +  ""

            //Send POST, using JSONP
            $.getJSON(url, postArgs).done(function (data) {

                geoJSONMoments = data;

                var orale = geoJSONMoments[2];
                //console.log(orale);



                momentLat = String(geoJSONMoments.features[2].geometry.coordinates[1]);
                momentLng = String(geoJSONMoments.features[2].geometry.coordinates[0]);


                 getMomentInfo(geoJSONMoments);

                 getMostRecentMoment(geoJSONMoments);

            }).fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ', ' + error;
                console.log("Request Failed: " + err);
            });



}





function slideMomentMapDiv(s){

    //var containerClicked = Date.parse(s);

    $('.icon-location').removeClass('activePin');



    $('.momentContainer').removeClass('momentActive');

    $("[id='" + s + "']").toggleClass( "momentActive" );





    s = s.split('_')[1];

    $("[id='icon_" + s + "']").toggleClass( "activePin" );

    // $( "[id='geoName_" + s + "']" ).html( " - " + geoName );

    setTimeout(function () { $( "[id='geoName_" + s + "']" ).html(geoName ); }, 1000);


    getLocationMap(s);

    //getCurrentMomentData();


    //$("[id='" + s + "']").addClass('activeMomentMap').siblings().removeClass('activeMomentMap');

    //$('#momentMapDiv').removeClass('activeMomentMap');

    //$($("[id='" + s + "']").children('#momentMapDiv')).removeClass('activeMomentMap');

	   //$($("[id='" + s + "']").children('#momentMapDiv')).addClass('activeMomentMap');


    //$( '#momentMapDiv').toggleClass( "activeMomentMap" );


    /*
    //loadLeafMaps();

    var momentSpot = new L.LatLng(momentLat, momentLng);

    _LS.Map.map._MomentMap(momentSpot,14);

    var geojsonMarkerOptions = {
        radius: 10,
        fillColor: "#de6b28",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    };
    var marker = L.circleMarker([momentLat, momentLng], geojsonMarkerOptions).addTo(_LS.Map.map);
    */
}

function hideMomentMapDiv(){

  $( '#momentMapDiv' ).css({
      'height':'0',

    }, 500, function() {
      // Animation complete.
      //$('#momentMapDiv').fadeOut();
    });


}

function getMostRecentMoment(geoJSONMoments){

  activeMomentData = [];

  recentMomentLat = geoJSONMoments.features[0].geometry.coordinates[1];

  recentMomentLng = geoJSONMoments.features[0].geometry.coordinates[0];

  var comment = geoJSONMoments.features[0].properties.comment;

  var timestamp = geoJSONMoments.features[0].properties.timestamp;

  var timesince = timeSince(timestamp);

  //console.log(momentLat, momentLng,comment,timesince);

  zoomToMoment(recentMomentLat, recentMomentLat, timestamp, comment, timesince);

  var recentMomentSpot = new L.LatLng(recentMomentLat, recentMomentLng);

  _MomentMap.Map.map.setView(recentMomentSpot,setMomentView);

  momentMarker = L.circleMarker([recentMomentLat, recentMomentLng], geojsonMarkerOptions).addTo(_MomentMap.Map.map);



  putActiveMomentImage(recentMomentLat, recentMomentLng, timestamp, comment, timesince);

  getCityCountry(recentMomentLat,recentMomentLng);

  $("[id='icon_" + timestamp + "']").addClass( "activePin" );

  $("[id='parent_" + timestamp + "']").toggleClass( "momentActive" );

  setTimeout(function () { $( "[id='geoName_" + timestamp + "']" ).html(geoName ); }, 2000);


  _MomentMap.Map.map.touchZoom.disable();
  _MomentMap.Map.map.doubleClickZoom.disable();
  _MomentMap.Map.map.scrollWheelZoom.disable();
  _MomentMap.Map.map.boxZoom.disable();
  _MomentMap.Map.map.keyboard.disable();

  activeMomentData.push([recentMomentLat]);
  activeMomentData.push([recentMomentLng]);
  activeMomentData.push([comment]);
  activeMomentData.push([timestamp]);
  activeMomentData.push([timesince]);

  console.log(activeMomentData);



}

function clickMomentMapExpand(){

  console.log
  ("orale");

}



function putActiveMomentImage(recentMomentLat, recentMomentLat, timestamp, comment, timesince){

  $("#locationContainer").empty();

  //var imageWrapper = $("<div id='usersImageWrapper' class='moment clearfix'></div>").appendTo("#locationContainer");

  var momentImageDiv = $('<img class="locationMomentImage" width="100%" src="'  + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + '/' + timestamp  + '.jpg" />').appendTo("#locationContainer");


}


function getLocationMap(MomentID){

    activeMomentData = [];

    var momentData = geoJSONMoments.features;

    var clickedID = null;

    $.each(momentData, function (id, item) {

        var imageTimeStamp = item.properties.timestamp;

        if (imageTimeStamp == MomentID) {
        clickedID = id;
        return;
        }

    });
    //console.log(clickedID);

    var momentLat = momentData[clickedID].geometry.coordinates[1];

    var momentLng = momentData[clickedID].geometry.coordinates[0];

    var comment = momentData[clickedID].properties.comment;

    var timestamp = momentData[clickedID].properties.timestamp;

    //console.log(momentLat, momentLng);

    var timesince = timeSince(timestamp);

    zoomToMoment(momentLat, momentLng,timestamp, comment, timesince);

    putActiveMomentImage(momentLat, momentLng, timestamp, comment, timesince);

    getCityCountry(momentLat,momentLng);
    /////////////////////////////////

    activeMomentData.push([momentLat]);
    activeMomentData.push([momentLng]);
    activeMomentData.push([comment]);
    activeMomentData.push([timestamp]);
    activeMomentData.push([timesince]);

    console.log(activeMomentData);

}

function zoomToMoment(lat, lng, timestamp, comment, timesince){

  if(momentMarker){
      _MomentMap.Map.map.removeLayer(momentMarker)
  }
  if(momentOverviewMapMarker){
      _SPDEV.Map.map.removeLayer(momentOverviewMapMarker)
  }


  var momentSpot = new L.LatLng(lat, lng);

  _MomentMap.Map.map.setView(momentSpot,setMomentView);



  momentMarker = L.circleMarker([lat, lng], geojsonMarkerOptions).addTo(_MomentMap.Map.map);

  if ($('#map-overview').length){
    var setzoom = 13;
    _SPDEV.Map.map.setView(momentSpot,setzoom);
    momentOverviewMapMarker = L.circleMarker([lat, lng], geojsonMarkerOptions).addTo(_SPDEV.Map.map);

  }



  //momentMarker.bindPopup(getPopupContent(lat,lng,timestamp,comment,timesince));



  //http://api.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/-73.99,40.70,13/500x300.png

}

function timeSince(date) {

    var date = Date.parse(date);



    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";

}

function getMomentInfo(data){

    $(".pad2").empty();

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

  var dateID = Date.parse(imageTimeStamp);

  var momentImage = imageTimeStamp;

  var momentPanel = $("<div id='parent_" + imageTimeStamp + "' class='momentContainer clearfix'></div>").appendTo('.pad2');

  var locationNameWrapper = $("<div id='locationNameWrapper_" + imageTimeStamp + "' class='moment clearfix'></div>").appendTo(momentPanel);

  var profileImageWrapper = $("<div class = 'thumbnailProfile'></div>").appendTo(locationNameWrapper);

  var profileNameWrapper = $("<div class = 'profileName'>" + APP_CONFIG.creds.aws.profileName +"</div>").appendTo(locationNameWrapper);

  var mapPin = $("<span id='icon_" + imageTimeStamp + "' class ='icon-location'></span>").appendTo(locationNameWrapper);

  var profileImageDiv = $('<img width="100%" class="profileImage" src="'  + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + APP_CONFIG.creds.aws.profileImage  + '.jpg" />').appendTo(profileImageWrapper);

  var imageWrapper = $("<div id='usersImageWrapper_" + imageTimeStamp + "' class='moment clearfix'></div>").appendTo(momentPanel);

  // var momentImageDiv = $('<img width="100%" class="lazy image1" data-original="'  + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + momentImage  + '.jpg" />').appendTo(imageWrapper);

  var momentImageDiv = $('<img width="100%" class="lazy" src="images/loading.gif" data-original="'  + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + momentImage  + '.jpg" />').appendTo(imageWrapper);

  //var momentMapDiv = $("<div id='momentMapDiv' class= 'momentMapDiv'></div>").appendTo(momentPanel);


  var noteWrapper = $("<div id='usersNoteWrapper_" + imageTimeStamp + "' class='moment clearfix'></div>").appendTo(momentPanel);

  var comment = $("<div class = 'momentText'>" + comment + "</div>").appendTo(noteWrapper);

  var timesince = $("<div class = 'momentsince'> " + timeSince(imageTimeStamp) + "</div><div id='geoName_" + imageTimeStamp + "' class='geoName'></div>").appendTo(locationNameWrapper);

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
