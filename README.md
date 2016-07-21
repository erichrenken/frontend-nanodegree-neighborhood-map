# P5: Neighborhood Map Project

By [Erich Renken](https://github.com/erichrenken)

## Description
This project was designed to locate restaurants in the city of Decatur, GA. Once the restaurant data is loaded, Google Maps markers are placed on the map and clicking the list of restaurants or the markers themselves displays an InfoWindow with additional restaurant data loaded from Foursquare. The array of restaurants is loaded using a Knockout observableArray which allows for the list and corresponding markers to be dynamically filtered using search terms

## Installation

Download the files

```Git
git clone https://github.com/erichrenken/frontend-nanodegree-neighborhood-map
```

Then simply open the index.html file with your favorite HTML5-enabled browser.

## Configuration

This project uses the Knockout.js and jQuery libraries. The project can be launched by opening the src\index.html file. The names, longitudes/latitudes, and Foursquare IDs are hardcoded into the src\js\main.js file, but those could be loaded dynamically at run-time with a little more configuration.

## Information

I used WebStorm 2016 to develop the project. The model contains my personal "Client ID" and "Client Secret" that I signed up for on the foursquare.com websute.

## Authors

* Erich Renken

## License

MIT/X11.
