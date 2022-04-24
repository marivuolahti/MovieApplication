

//Loading the movie theathtre list
loadAndParseXML();
//Getting the current date, and rebuild the date on format dd.mm.yyyy.
	const d = new Date();
	let year = d.getFullYear();
	let month = d.getMonth() + 1;
	if (month < 10) month =  '0' + month 
	let day = d.getDate() + 1;
	let paiva = day + '.' + month  + '.' + year;

function aikat() {
//put user selected id of theater into variable (areaid)
    const areaid = document.getElementById('teatterit').value;
//if the user has entered the date, use it otherwise it will use the current date
// Building the address with theatre id and date and sending a request
	var pvm = document.getElementById('pvm').value;
 	if (pvm != ' ')  paiva = pvm;
    const osoite = "https://www.finnkino.fi/xml/Schedule/?area=" + areaid + '&dt=' + paiva;
	
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", osoite, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        // If we are still loading...
        if (xmlhttp.readyState === 1) {
            document.getElementById("myDiv").innerHTML = "Wait while Im loading...";
        }
        // If everything is ok
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
           
            const xmlDoc = xmlhttp.responseXML;
           //Search for all the shows of the theatre, if it gets shows, build div sections into variable (txt)
            const shows = xmlDoc.getElementsByTagName("Show");

			var txt = '';
			if (shows.length > 0) {
            for (i = 0; i < shows.length; i++) {   
 				console.log(i+","+shows[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue+";"+shows[i].getElementsByTagName("EventMediumImagePortrait")[0]);
                 // If there are not medium image available, using the large image
			    var tutki = shows[i].getElementsByTagName("EventMediumImagePortrait")[0];
				if (tutki == null)
					var kuva ='<img class="kuva2" src="' + shows[i].getElementsByTagName("EventLargeImagePortrait")[0].childNodes[0].nodeValue;
				else
					var kuva = '<img class="kuva" src="' + shows[i].getElementsByTagName("EventMediumImagePortrait")[0].childNodes[0].nodeValue;
            //Build variable (aika) from the showtime and length of the show
				var pituus = shows[i].getElementsByTagName("LengthInMinutes")[0].childNodes[0].nodeValue;		
				var aika = shows[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue;
				var muodaika = aika.substr(8, 2) + '.' +  aika.substr(5, 2) + '.' +  aika.substr(0, 4) +
				 ' klo ' + aika.substr(11, 2) + ':' +  aika.substr(14, 2);
        // Build show with image and link to Finnkino's website into own div
				txt += '<div class="esitys">'+ 
				'<a href="' + shows[i].getElementsByTagName("EventURL")[0].childNodes[0].nodeValue + '" target="_blank" ' + 
				' title="' + 	shows[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue + '">' +
				 kuva + '"></a><br>' +
				'<div class="aika">' + muodaika + ' ' + pituus + ' min' + '</div>' +
				'</div>';
			}
            //When the data is processed, add the result to the html page
            txt = '<div class="elokuvat">' + txt + "</div>";
            document.getElementById("tabledata").innerHTML = txt;
			}
            //If there is no shows available for the selected date this notification will be shown on the screen
			else {
				document.getElementById("tabledata").innerHTML = '<h3>Ei löytynyt esityksiä annetuilla hakutekijöillä, kokeile myöhemmin uudestaan:(</h3>';
			}
        }

    }
}
function loadAndParseXML() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://www.finnkino.fi/xml/TheatreAreas/", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        // If we are still loading...
        if (xmlhttp.readyState === 1) {
            document.getElementById("myDiv").innerHTML = "Wait while Im loading...";
        }
        // If everything is ok
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            // Instead of just placing the RAW XML content we need to parse it
            var xmlDoc = xmlhttp.responseXML;
            var TheatreArea = xmlDoc.getElementsByTagName("TheatreArea");
//Build all the theatres to the select list with name and id

            for (i = 0; i < TheatreArea.length; i++) {
                var option = document.createElement("option");
                option.text = TheatreArea[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                option.value = TheatreArea[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
                var teatterit = document.getElementById("teatterit");
                teatterit.add(option);
            }
            
        }
        //Current date to the date input field
        var apu = document.getElementById('pvm');
		apu.value = paiva;


    }
}