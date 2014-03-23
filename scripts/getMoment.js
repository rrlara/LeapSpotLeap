var geoJSONMoments = null;



var momentLat = null;
var momentLng = null;

var momentMarker;

function slideMomentToTopOnHover(id){



  var momentID = id;


  //$( 'pad2 keyline-bottom' ).scrollTo(500);





}



function initMoment(){

  //$('#content').click(hideMomentMapDiv);

  $('.pad2').on('click', '.icon-location', function(){

    var sourceDiv = this;
    var s = $(sourceDiv).attr('id');


    slideMomentMapDiv(s);



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
                console.log(orale);



                momentLat = String(geoJSONMoments.features[2].geometry.coordinates[1]);
                momentLng = String(geoJSONMoments.features[2].geometry.coordinates[0]);

                console.log(momentLng);

                 getMomentInfo(geoJSONMoments);

            }).fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ', ' + error;
                console.log("Request Failed: " + err);
            });



}





function slideMomentMapDiv(s){

    //var containerClicked = Date.parse(s);

    $('.icon-location').removeClass('activePin');

    $("[id='" + s + "']").toggleClass( "activePin" );





    s = s.split('_')[1];

    getLocationMap(s);


    //$("[id='" + s + "']").addClass('activeMomentMap').siblings().removeClass('activeMomentMap');

    //$('#momentMapDiv').removeClass('activeMomentMap');

    //$($("[id='" + s + "']").children('#momentMapDiv')).removeClass('activeMomentMap');

	   //$($("[id='" + s + "']").children('#momentMapDiv')).addClass('activeMomentMap');


    //$( '#momentMapDiv').toggleClass( "activeMomentMap" );


    /*
    //loadLeafMaps();

    var momentSpot = new L.LatLng(momentLat, momentLng);

    _LS.Map.map.setView(momentSpot,14);

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

function getLocationMap(MomentID){


    var momentData = geoJSONMoments.features;

    var clickedID = null;

    $.each(momentData, function (id, item) {

        var imageTimeStamp = item.properties.timestamp;

        if (imageTimeStamp == MomentID) {
        clickedID = id;
        return;
        }

    });
    console.log(clickedID);

    var momentLat = momentData[clickedID].geometry.coordinates[1];

    var momentLng = momentData[clickedID].geometry.coordinates[0];

    var comment = momentData[clickedID].properties.comment;

    var timestamp = momentData[clickedID].properties.timestamp;

    console.log(momentLat, momentLng);

    var timesince = timeSince(timestamp);

    zoomToMoment(momentLat, momentLng,timestamp, comment, timesince);

}

function zoomToMoment(lat, lng, timestamp, comment, timesince){

  if(momentMarker){
      _SPDEV.Map.map.removeLayer(momentMarker)
  }

  var momentSpot = new L.LatLng(lat, lng);

  _SPDEV.Map.map.setView(momentSpot,15);

  var geojsonMarkerOptions = {
      radius: 10,
      fillColor: "#de6b28",
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
  };

  momentMarker = L.circleMarker([lat, lng], geojsonMarkerOptions).addTo(_SPDEV.Map.map);



  momentMarker.bindPopup(getPopupContent(lat,lng,timestamp,comment,timesince));



  //http://api.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/-73.99,40.70,13/500x300.png

}

function timeSince(date) {

    var date = Date.parse(date);



    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";

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

  var momentPanel = $("<div id='" + imageTimeStamp + "' class='momentContainer clearfix'></div>").appendTo('.pad2');

  var locationNameWrapper = $("<div id='locationNameWrapper' class='moment clearfix'></div>").appendTo(momentPanel);

  var locationName = $("<span class = 'momentText'>" + count + "</span><span class = 'momentText'> - Seattle, WA</span><span id='icon_" + imageTimeStamp + "' class ='icon-location'></span>").appendTo(locationNameWrapper);

  var imageWrapper = $("<div id='usersImageWrapper' class='moment clearfix'></div>").appendTo(momentPanel);

  // var momentImageDiv = $('<img width="100%" class="lazy image1" data-original="'  + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + momentImage  + '.jpg" />').appendTo(imageWrapper);

  var momentImageDiv = $('<img width="100%" class="lazy" src="images/loading.gif" data-original="'  + APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + momentImage  + '.jpg" />').appendTo(imageWrapper);

  var momentMapDiv = $("<div id='momentMapDiv' class= 'momentMapDiv'></div>").appendTo(momentPanel);


  var noteWrapper = $("<div id='usersNoteWrapper' class='moment clearfix'></div>").appendTo(momentPanel);

  var comment = $("<div class = 'momentText'>" + comment + "</div>" + "  <span class = 'momentsince'> " + timeSince(imageTimeStamp) + "<span>").appendTo(noteWrapper);

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
