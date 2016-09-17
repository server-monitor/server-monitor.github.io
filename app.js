$(document).ready(function () {
  var M3UInfobox = {
    format: function (events, marker) {
      var infoBoxClass = 'infobox';

      var titles = events.map(function (event, ix) {
        var num = '';
        if (events.length > 1) {
          num = ix + 1 + '. ';
        }

        var date = Date.now();

        // date.setTime(event.time);

        return '<p><a href="' + event.link + '">' +
                  event.name + '</a><br></p>';

        // return '<p><a href="' + event.link + '" target="_blank">' +
        //           event.name + '</a><br>' + date + '<br></p>';
      }).join('');

      return '<div class="' + infoBoxClass + '">' +
          'Latitude:longitude' + titles +
        '</div>'
      ;

      // marker.name + '<br>' +
      // marker.address + '<br>' +
      // marker.city + ', ' + marker.state +
    },

    formatYourLocation: function (userGeoData, yourInfo) {
      var infoBoxClass = 'infobox';

      return '<div class="' + infoBoxClass + '">' +
          '<p>...</p>' +
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
      var geo = this.loadMarkers(map, params.locIGroups);
      this.showMap(map, geo.bounds, geo.markers);
    },

    initMap: function (mapAreaId) {
      mapAreaId = mapAreaId || 'map_canvas';

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

      var markers = [
        L.marker([34.0522300, -118.2436800], { riseOnHover: true, })
         .addTo(map)
         .bindPopup(M3UInfobox.formatYourLocation(
            { city_name: 'Los Angeles', region_name: 'CA' }, { name: 'Downtown' })
         ),
      ];

      for (var i = 0; i < listLength; i++) {
        var locIGroup = locIGroups[i];
        var markerInput = locIGroup.venue;

        var latLong = L.latLng(markerInput.latitude, markerInput.longitude);
        bounds.push(latLong);

        var iconProp = {
          iconUrl: '/planet-express-ship.png',

          // iconUrl: 'https://a248.e.akamai.net/' +
          //   'secure.meetupstatic.com/s/img/94156887029318281691566697/logo.svg',
        };

        if (i === (listLength - 1)) {
          iconProp.className = 'animated_marker';
        }

        var marker = L.marker([markerInput.latitude, markerInput.longitude], {
          icon: L.icon(iconProp), riseOnHover: true,
        });

        marker.addTo(map)
              .bindPopup(M3UInfobox.format(locIGroup.events, markerInput));

        // var marker = L.marker([markerInput.latitude, markerInput.longitude], {
        //   icon: L.icon(iconProp), riseOnHover: true,
        // }).addTo(map)
        //   .bindPopup(M3UInfobox.format(locIGroup.events, markerInput));

        markers.push(marker);
      }

      return { bounds: bounds, markers: markers };
    },

    showMap: function (map, bounds, markers) {
      if (bounds.length === 0) {
        map.setView(new L.LatLng(34.0522300, -118.2436800), 12);
      } else if (bounds.length === 1) {
        var firstNotCenter = markers[1].getLatLng();
        map.setView(new L.LatLng(firstNotCenter.lat, firstNotCenter.lng), 5);
      } else {
        map.fitBounds(L.latLngBounds(bounds));
      }
    },

    createYourLocationMarker: function (
      map, userGeoData, userInfo, title, bounds, infowindow
    ) {
      var markerInfo = {
        title: title,
        position: {
          lat: parseFloat(userGeoData.latitude),
          lng: parseFloat(userGeoData.longitude),
        },

        // icon: '???',
        map: map,
      };

      if (railsEnv === 'test') markerInfo.optimized = false;

      // var marker = new google.maps.Marker(markerInfo);

      // this.attachInfoWindow(
      //   map, marker, infowindow, M3UInfobox.formatYourLocation(userGeoData, userInfo)
      // );

      bounds.extend(marker.getPosition());

      return marker;
    },
  };

  M3ULeaflet.load({
    locIGroups: [
    ],
  });

  $('form#new-todo').submit(function (e) {
    var todos = $('ul#todo-list').html();
    var newTodo = e.target[0].value;

    if (newTodo) todos += '<li>' + newTodo + '</li>';

    $("input[type='text']").val('');
    $('ul#todo-list').html(todos);
    e.preventDefault();
  });

  function randomNumberFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  $('.travel').click(function (e) {
    var ranLat = randomNumberFromRange(-85, 85);
    var ranLon = randomNumberFromRange(-180, 180);

    // US only
    // var ranLat = randomNumberFromRange(24, 49);
    // var ranLon = randomNumberFromRange(-124, -66);

    M3ULeaflet.load({
      locIGroups: [
        {
          venue: { latitude: ranLat, longitude: ranLon },
          events: [{ name: ranLat + ':' + ranLon, link: '/' }],
        },
      ],
    });
    e.preventDefault();
  });
});
