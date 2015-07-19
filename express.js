var express = require("express");
var app = express();

var DataModel = require("./data/dataModel.js");
var dataModel = new DataModel();
var fs = require("fs");

app.route("/restapi/country")
    .get(function(req, res) {
        res.json(dataModel.getCountriesList());
    })
    .post(function(req, res) {
        var name = req.query.name;
        var description = req.query.description;
        dataModel.addCountry(name, description);
        dataModel.saveModelToFile(fs);
        res.end();
    });

app.route("/restapi/country/:countryName/hotel")
    .get(function(req, res) {
        res.json(dataModel.getHotelsInCountryList(req.params.countryName));
    })
    .post(function(req, res) {
        var name = req.query.name;
        var description = req.query.description;
        dataModel.addHotelInCountry(req.params.countryName, name, description);
        dataModel.saveModelToFile(fs);
        res.end();
    });

app.route("/restapi/hotel/:hotelName")
    .get(function(req, res) {
        res.json(dataModel.getHotelDescription(req.params.hotelName));
    })
    .put(function(req, res) {
        var name = req.query.name;
        var description = req.query.description;
        if(dataModel.updateHotel(req.params.hotelName, name, description)) {
            dataModel.saveModelToFile(fs);
            res.end();
        } else res.status(404).end();
    })
    .delete(function(req, res) {
        if(dataModel.deleteHotel(req.params.hotelName)) {
            dataModel.saveModelToFile(fs);
            res.end();
        } else res.status(404).end();
    });

app.listen(1337);

console.log("Server running at http://127.0.0.1:1337/");
