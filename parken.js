greyIcon = L.icon({
	iconUrl: './icons/silver.png',
	iconSize: [32, 20],
	iconAnchor: [9, 9],
	popupAnchor: [0, -9],
	labelAnchor: [-12,1]
});

yellowIcon = L.icon({
	iconUrl: './icons/yellow.png',
	iconSize: [32, 20],
	iconAnchor: [9, 9],
	popupAnchor: [0, -9],
	labelAnchor: [-12,1]
});

greenIcon = L.icon({
	iconUrl: './icons/green.png',
	iconSize: [32, 20],
	iconAnchor: [9, 9],
	popupAnchor: [0, -9],
	labelAnchor: [-12,1]
});

allMarker = [];


function getParkData () {
	parkzahlen = {};
	$.getJSON("http://ubahn.draco.uberspace.de/opendata/cached_api.php", function (data) {
		$.each(data, function (k, v){

			parkzahlen[v['name']] = v;

			
		});
		getParkplaetze();
	});

}

function getParkplaetze () {
	$.getJSON("./parkplaetze.json", function (data) {
		$.each(data, function (k, v){
			if (typeof(parkzahlen[v['name']])!='undefined'){
				//console.log(v['name'])
				var element = parkzahlen[v['name']];

				//Icon Typ errechnen und erzeugen
				var prozent = element['free'] / element['count'];
				console.log(prozent)
				if (prozent>0.2){
					var mIcon = greenIcon;
					var lClass = 'labelgreen';
				} else if (prozent>0.01) {
					var mIcon = yellowIcon;
					var lClass = 'labelyellow';
				} else {
					var mIcon = greyIcon;
					var lClass = 'labelgrey';
				}

				//Taschenbergpalais muss links vom Marker sein
				var lPosition = "right";
				if (element['name']=="Taschenbergpalais"){
					lPosition = "left";
				}

				var m = L.marker([v['lat'], v['lon']],{
					icon: mIcon
				})
				
				var popUpText = "<strong>" + element['name'] + "</strong><br>" + element['free'].toString() + " von " + element['count'].toString() + " Parkplätzen sind noch frei<br><a href=\""+v['website']+"\">mehr infos auf dresden.de</a>";
				m.bindPopup(popUpText);
				m.bindLabel(element['free'].toString(),{
					noHide: true,
					direction: lPosition,
					className: lClass
				});
				m.showLabel();

				m.addTo(map);

				allMarker.push(m);
			}
			else {
				console.log("-----nicht dabei" + v['name'])
			}
		});
	});
}

function onMove (){
	$.each(allMarker, function(key,marker){
		if (map.getZoom()<14){
			marker.hideLabel();
		}
		else {
			marker.showLabel();
		}
	});

	
}

//initial Call
$(function() {
	getParkData();
});
