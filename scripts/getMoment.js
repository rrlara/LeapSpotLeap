var geoMoments = null;

var momentLat = null;
var momentLng = null;

function initMoment(){

  //$('#content').click(hideMomentMapDiv);

  $('.pad2').on('click', '.icon-location', function(){

    var sourceDiv = this;
    var s = $(sourceDiv).attr('id');


    console.log(s);

    //slideMomentMapDiv(s);



  });



}


function getMoments(){

   var postArgs = {};


            //var url = 'https://s3-us-west-2.amazonaws.com/leapspotleap/Observations.json';

            var url = APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/Observations.json"

            //Send POST, using JSONP
            $.getJSON(url, postArgs).done(function (data) {

                geoMoments = data;

                momentLat = String(geoMoments.features[2].geometry.coordinates[1]);
                momentLng = String(geoMoments.features[2].geometry.coordinates[0]);

                console.log(momentLng);

                 getMomentInfo(geoMoments);

            }).fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ', ' + error;
                console.log("Request Failed: " + err);
            });



}

function detectElement(arrow) {
    arrow.parent().find('#momentMapDiv').addClass("activeMomentMap");
}




function slideMomentMapDiv(s){

    var containerClicked = Date.parse(s);


    console.log(containerClicked)


    $( '#momentMapDiv' ).toggleClass( "activeMomentMap" );

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

    var s = new Date(MomentID).toISOString();

    var pointdata = geoMoments.features;
    //pointdata = pointdata.reverse();
    //var numberOfPoints = data.features.length;

    //console.log(pointdata);

    //var keycount = 0;


    function getId(pointdata, id) {
      var obj = pointdata.filter(function (val) {
          return val.id === s;
      });
      //filter returns an array, and we just want the matching item
      return obj[0];

    }


    if(numberOfPoints === 0) {
        return;
    }

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

  var momentPanel = $("<div id='" + dateID + "' class='momentContainer clearfix'></div>").appendTo('.pad2');

  var locationNameWrapper = $("<div id='locationNameWrapper' class='moment clearfix'></div>").appendTo(momentPanel);

  var locationName = $("<span class = 'momentText'>" + count + "</span><span class = 'momentText'> - Seattle, WA</span><span id='" + imageTimeStamp + "' class ='icon-location'></span>").appendTo(locationNameWrapper);

  var imageWrapper = $("<div id='usersImageWrapper' class='moment clearfix'></div>").appendTo(momentPanel);

  var momentImageDiv = $('<img width="100%" class= "images1" src="https://s3-us-west-2.amazonaws.com/leapspotleap/' + momentImage  + '.jpg" />').appendTo(imageWrapper);

  var momentMapDiv = $('<div id="momentMapDiv" class= "momentMapDiv"></div>').appendTo(momentPanel);


  var noteWrapper = $("<div id='usersNoteWrapper' class='moment clearfix'></div>").appendTo(momentPanel);

  var comment = $("<span class = 'momentText'>" + comment + "</span>" + "  <span class = 'momentsince'> " + timeSince(imageTimeStamp) + "<span>").appendTo(noteWrapper);

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
