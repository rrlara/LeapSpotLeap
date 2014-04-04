var geoName = null;

function getCityCountry(lat,lng){

   var postArgs = {};


            var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=false';

            console.log(url);
            //var url = APP_CONFIG.creds.aws.url + APP_CONFIG.creds.aws.bucketname + "/" + APP_CONFIG.creds.aws.observations +  ""

            //Send POST, using JSONP
            $.getJSON(url, postArgs).done(function (data) {

                // geoName = data;
                geoName = (data.results[2].formatted_address) || "";

                //alert(geoName);

                //var orale = geoJSONMoments[2];
                console.log(geoName);

            }).fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ', ' + error;
                console.log("Request Failed: " + err);
            });



}
