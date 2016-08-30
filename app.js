$(document).ready(function () {
  var M3UInfobox = {
    format: function (events, marker) {
      var infoBoxClass = 'infobox';

      var titles = events.map(function (event, ix) {
        var num = '';
        if (events.length > 1) {
          num = ix + 1 + '. ';
        }

        var date = new Date();
        date.setTime(event.time);

        return '<p><a href="' + event.link + '" target="_blank">' +
                  event.name + '</a><br>' + date + '<br></p>';
      }).join('');

      return '<div class="' + infoBoxClass + '">' +
          titles +
          marker.name + '<br>' +
          marker.address + '<br>' +
          marker.city + ', ' + marker.state +
        '</div>'
      ;
    },

    formatYourLocation: function (userGeoData, yourInfo) {
      var infoBoxClass = 'infobox';

      return '<div class="' + infoBoxClass + '">' +
          '<p>Your location</p>' +
          'Name: ' + yourInfo.name + '<br>' +
          'City: ' + userGeoData.city_name + '<br>' +
          'State/Region: ' + userGeoData.region_name +
        '</div>'
      ;
    },
  };

  var M3ULeaflet = {
    load: function (params) {
      var map = this.initMap(params.mapAreaId);

      // var bounds = this.loadMarkers(map, params.locIGroups);
      this.showMap(map, bounds);
    },

    initMap: function (mapAreaId) {
      mapAreaId = mapAreaId || 'map';

      var upper = $('#' + mapAreaId).parent();
      $('#' + mapAreaId).remove();
      upper.append('<div id="' + mapAreaId + '"></div>');

      var map = L.map(mapAreaId);

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      return map;
    },

    loadMarkers: function (map, locIGroups) {
      var bounds = [];
      var listLength = locIGroups.length;

      var markers = [];

      for (var i = 0; i < listLength; i++) {
        var locIGroup = locIGroups[i];
        var markerInput = locIGroup.venue;

        var latLong = L.latLng(markerInput.latitude, markerInput.longitude);
        bounds.push(latLong);

        var iconProp = {
          iconUrl: '/dog.png',

          // iconUrl: 'https://a248.e.akamai.net/' +
          //   'secure.meetupstatic.com/s/img/94156887029318281691566697/logo.svg',
        };

        if (i === (listLength - 1)) {
          iconProp.className = 'animated_marker';
        }

        var marker = L.marker([markerInput.latitude, markerInput.longitude], {
          icon: L.icon(iconProp), riseOnHover: true,
        }).addTo(map)
          .bindPopup(M3UInfobox.format(locIGroup.events, markerInput));

        markers.push(marker);
      }

      return bounds;
    },

    showMap: function (map, bounds) {
      if (bounds.length === 0) {
        map.setView(new L.LatLng(34.0522300, -118.2436800), 12);
      } else {
        map.fitBounds(L.latLngBounds(bounds));
      }
    },
  };

  // $('form#new-todo').submit(function(e){
  //   var todos = $('ul#todo-list').html();
  //   todos += '<li>' + e.target[0].value + '</li>';
  //   $("input[type='text']").val('')
  //   $('ul#todo-list').html(todos);
  //   e.preventDefault();
  // });

  M3ULeaflet.load({ locIGroups: [] });
});
