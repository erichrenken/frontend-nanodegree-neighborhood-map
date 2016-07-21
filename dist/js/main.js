var map;
var markers = [];
var infoWin;

function initMap() {
    // Create a map and center it in downtown Decatur
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 33.783083, lng: -84.298788}, zoom: 16
    });

    // Create the bounds variable to be used when placing markers
    var bounds = new google.maps.LatLngBounds();

    // Iterate through the observable array and create an array of markers
    for (i=0; i < ViewModel.Listings().length; i++){
        var marker = new google.maps.Marker({
            position: ViewModel.Listings()[i].address,
            map: map,
            animation: google.maps.Animation.DROP,
            title: ViewModel.Listings()[i].name
        });
        markers.push(marker);
        marker.setMap(map);
        bounds.extend(marker.position);
    }
    // Adjust the map to fit the markers
    map.fitBounds(bounds);
}

// This function is called after the Foursquare data is returned from the API so
// that there is available data (telephone, URL, picture) retrived from Foursquare
// to populate the InfoWindow
function populateInfoWindow(marker, infowindow, index) {
    // Close any instances of an InfoWindow previously opened. This prevents the
    // map from opening multiple simultanous InfoWindows
    if (infoWin){
        infoWin.close();
    }
    // Stop all previous animations.
    for( var i in markers ){
        markers[i].setAnimation(null);
    }
    // Animate the selected marker
    marker.setAnimation(google.maps.Animation.BOUNCE);

    // Check to make sure the infowindow is not already opened on this marker
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        // Open the infowindow on the correct markers
        infowindow.open(map, marker);
        // Add hardcoded data and data retrieved from Foursquare to the InfoWinfow
        infowindow.setContent('<div>' + marker.title + '</div><div><a href="' + ViewModel.Listings()[index].url + '" target="_blank">'+
            ViewModel.Listings()[index].url + '</a></div><br><div><image src="' +
            ViewModel.Listings()[index].pic + '"></image></div><br><div>' +
            ViewModel.Listings()[index].phone + '</div>');
    }
}

// Create a Listing object from the hardcoded data with empty strings for the data
// that will be retrieved from Foursquare
var Listing = function(name, address, foursquareId){
    var self = this;
    self.name = name;
    self.address = address;
    self.foursquareId = foursquareId;
    self.url = "";
    self.pic = "";
    self.phone = "";
    // This code ensures that the markers array and the observableArray stay synchronized
    self.openInfoWindow = function(listing){
        var index = markers.findIndex(x => x.title == listing.name);
        google.maps.event.trigger(markers[index], 'click');
    }
};

// This is the ViewModel that provides data access to the View
var ListingModel = function(Listings){
    var self = this;
    // Declare the search box as an observable
    self.userInput = ko.observable("");
    // This observableArray holds the list of restaurants
    self.Listings = ko.observableArray(Listings);
    // Loop through the Listings observableArray to retrieve data from Foursquare based on the hardcoded
    // Foursquare ID
    for (i=0; i < Listings.length; i++){
        (function(index) {
            $.ajax({
                url: "https://api.foursquare.com/v2/venues/" + Listings[i].foursquareId + "?client_id=3JWPVC3LYRKNIEBECRKJU1LXCKS4IND1JSBI4GZCL2S4Y0B3&client_secret=Q2OG2A1TEYBQF0UTJ0IDG5JYZTVJX4RXFXEOS5QX2WUTUQZH&v=20160101",
                error: function () {
                    alert("There was a problem connecting with Foursquare.")
                }
            })
                .done(function (data) {
                    Listings[index].url = data.response.venue.url;
                    Listings[index].pic = data.response.venue.bestPhoto.prefix + '100x100' + data.response.venue.bestPhoto.suffix;
                    Listings[index].phone = data.response.venue.contact.formattedPhone;
                    infoWin = new google.maps.InfoWindow();
                    markers[index].addListener('click', function() {
                        populateInfoWindow(this, infoWin, index);
                    });
                });
        })(i);
    }
    // The following code handles the filtering by using the search terms textbox
    // If the characters in the textbox match any portion of the string containing
    // the restaurant name, that restaurant remains in the list
    self.availableLocations = ko.computed(function(){
        return ko.utils.arrayFilter(self.Listings(), function(point){
            return point.name.toLowerCase().indexOf(self.userInput().toLowerCase()) >= 0;
        });
    });
    self.availableLocations.subscribe(function(){
       for(i=0; i<markers.length; i++){
           markers[i].setMap(null);
       }
       for(i=0; i < self.availableLocations().length; i++){
            var index = markers.findIndex(x => x.title == self.availableLocations()[i].name);
            markers[index].setMap(map);
       }
    });
};

// Link the model to the ViewModel
var ViewModel = new ListingModel([
    new Listing("Taqueria del Sol", {lat: 33.775916, lng: -84.30209710000003}, "49dfb321f964a52000611fe3"),
    new Listing("The Pinewood", {lat: 33.775363, lng: -84.299905}, "4fa5cb03e4b094b946a36158"),
    new Listing("Iberian Pig", {lat: 33.774389, lng: -84.29600299999998}, "4aa2b2f8f964a520164220e3"),
    new Listing("Victory Sandwich Bar", {lat: 33.7742212, lng: -84.2951521}, "51198dc3e4b0ec511bcb679a"),
    new Listing("Raging Burrito", {lat: 33.774423, lng: -84.29547589999999}, "49dc0015f964a5203e5f1fe3"),
    new Listing("Souper Jenny", {lat: 33.775347, lng: -84.297062}, "52fd458f11d21705e752dd5f")
]);

// Create the Model
ko.applyBindings(ViewModel);
