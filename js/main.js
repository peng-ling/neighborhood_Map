var map;
var wiki;

var callbackGM = function() {

  if (typeof google == 'undefined') {
    nm('error');
  } else {
    initMap();
    nm('ok');
  }
};

var initMap = function() {

  var myLatLng = {
    lat: 50.0716683,
    lng: 8.2309231
  };

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 12
  });
};

var nm = function(state) {

  this.state = state;

  var places = [{
    name: "Ristorante Pizzeria Da Balbi",
    lating: {
      lat: 50.0720994,
      lng: 8.2317455
    },
    description: "great italian food",
    /*icon: '',*/
    visible: true,
    wikipageid: 26496842
  }, {
    name: "Restaurant Mykonos",
    lating: {
      lat: 50.0723748,
      lng: 8.2292886
    },
    description: "great greek food",
    /*icon: '',*/
    visible: true,
    wikipageid: 26496842
  }, {
    name: "Asso",
    lating: {
      lat: 50.0723748,
      lng: 8.2592886
    },
    description: "Asso",
    /*icon: '',*/
    visible: true,
    wikipageid: 16095
  }, {
    name: "Zorro",
    lating: {
      lat: 50.0723748,
      lng: 8.2992886
    },
    description: "Zorro",
    /*icon: '',*/
    visible: true,
    wikipageid: 16095
  }];

  //intializing marker array

  var locationsViewModel = function() {

    var self = this;

    self.Locations = ko.observableArray(places);

    self.filter = ko.observable('');

    self.placesmaker = ko.observableArray([]);

    places.forEach(function(item) {
      self.placesmaker.push(new google.maps.Marker({
        position: item.lating,
        map: map,
        title: item.name,
        label: item.name
      }));
    });

    self.filteredplacesmaker = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter || filter === '') {
        return self.placesmaker();
      } else {
        self.placesmaker().forEach(function(item) {
          if (RegExp(filter).test(item.title.toLowerCase())) {
            console.log('true filter:' + filter + ' item: ' + item.title);
            item.setVisible(true);
          } else {
            console.log('false filter:' + filter + ' item: ' + item.title);
            item.setVisible(false);
          }
        });
      }
      console.log('------------------');
    });

    self.filterLocations = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter || filter === '') {
        return self.Locations();
      } else {
        return self.Locations().filter(function(item) {
          return RegExp(filter).test(item.name.toLowerCase());
        });
      }
    });

  };

  ko.applyBindings(new locationsViewModel());

};

$(document).ready(function() {

  $.ajaxPrefilter("json script", function(options) {
    options.crossDomain = true;
  });



  $.ajaxSetup({
    dataType: "json"
  });
  $.ajax({
    type: "GET",

    //action=query&prop=extracts
    url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=Jimi_Hendrix|Eddie_Van_Halen",
    //url: "https://crossorigin.me/https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Jimi_Hendrix",
    contentType: "application/json; charset=utf-8",
    async: true,
    dataType: "jsonp",
    success: function(data, textStatus, jqXHR) {

      self.placesmaker.forEach(function {

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

      });
      //wiki = data;
      //$('#Hendrix').append(data.query.pages[16095].extract);
      //console.log('wiki: ' + wiki)
    },
    error: function(errorMessage) {}
  });



});
