var http = require("http");

var DataModel = require("./data/dataModel.js");
var dataModel = new DataModel();
var fs = require("fs");

http.createServer(function(req, res) {
    if(require('url').parse(req.url).pathname.indexOf("/restapi") > -1) {
        switch(req.method) {
            case "GET": doGet(req, res); break;
            case "POST": doPost(req, res); break;
            case "PUT": doPut(req, res); break;
            case "DELETE": doDelete(req, res); break;
        }
    } else {
        res.statusCode = 405;
        res.statusMessage = http.STATUS_CODES[405];
        sendMessage(http.STATUS_CODES[405], res, 405);
    }
}).listen(1337, "127.0.0.1");

console.log("Server running at http://127.0.0.1:1337/");

function doGet(req, res) {
    var pathName = require('url').parse(req.url).pathname;
    var path = parsePathname(pathName);

    // GET /restapi/country
    if(pathName == "/restapi/country") {
        sendMessage(JSON.stringify(dataModel.getCountriesList()), res, 200);
    }

    // GET /restapi/country/countryName/hotel
    if(path[0] == "restapi" && path[1] == "country" && path[3] == "hotel" && path.length == 4) {
        sendMessage(JSON.stringify(dataModel.getHotelsInCountryList(path[2])), res, 200);
    }

    // GET /restapi/hotel/hotelName
    if(path[0] == "restapi" && path[1] == "hotel" && path.length == 3) {
        sendMessage(dataModel.getHotelDescription(path[2]), res, 200);
    }
}

function doPost(req, res) {
    var pathName = require('url').parse(req.url).pathname;
    var path = parsePathname(pathName);

    var query = require('url').parse(req.url).query;
    var jsonQuery = parseQuery(query);

    // POST /restapi/country?name=countryName&description=countryDescription
    if(pathName == "/restapi/country") {
        dataModel.addCountry(jsonQuery["name"], jsonQuery["description"]);
        dataModel.saveModelToFile(fs);
        res.end();
    }

    // POST /restapi/country/countryName/hotel?name=hotelName&description=hotelDescription
    if(path[0] == "restapi" && path[1] == "country" && path[3] == "hotel" && path.length == 4) {
        dataModel.addHotelInCountry(path[2], jsonQuery["name"], jsonQuery["description"]);
        dataModel.saveModelToFile(fs);
        res.end();
    }
}

function doPut(req, res) {
    var path = parsePathname(require('url').parse(req.url).pathname);

    // PUT /restapi/hotel/hotelName
    if(path[0] == "restapi" && path[1] == "hotel" && path.length == 3) {
        var jsonQuery = parseQuery(require('url').parse(req.url).query);
        if(dataModel.updateHotel(path[2], jsonQuery["name"], jsonQuery["description"])) {
            dataModel.saveModelToFile(fs);
            res.end();
        }
    }
}

function doDelete(req, res) {
    var path = parsePathname(require('url').parse(req.url).pathname);

    // DELETE /restapi/hotel/hotelName
    if(path[0] == "restapi" && path[1] == "hotel" && path.length == 3) {
        if(dataModel.deleteHotel(path[2])) {
            dataModel.saveModelToFile(fs);
            res.end();
        }
    }
}

function sendMessage(text, res, code) {
    res.writeHead(code, {
        "Content-Length": text.length,
        "Content-Type": "text/plain" });
    res.write(text);
}

function parseQuery(query) {
    var queryObj = '{"';

    if(query == null) return null;
    query = query.split("+").join(" ");

    while(query.length != 0) {
        var key = query.substring(0, query.indexOf("="));
        queryObj += key + '":"';
        query = query.substring(query.indexOf("=") + 1, query.length);

        if(query.indexOf("&") != -1) {
            var value = query.substring(0, query.indexOf("&"));
            queryObj += value + '","';
            query = query.substring(query.indexOf("&") + 1, query.length);
        } else {
            queryObj += query + '"}';
            return JSON.parse(queryObj);
        }
    }
}

function parsePathname(pathname) {
    var paths = [];

    pathname = pathname.split("+").join(" ");

    while(pathname.length != 0) {
        if(pathname.substring(pathname.length - 1) == "/") {
            // /path/path/ - case
            pathname = pathname.substring(1, pathname.length - 1);
        } else {
            // /path/path - case
            pathname = pathname.substring(1, pathname.length);
        }

        if(pathname.indexOf("/") != -1) {
            var path = pathname.substring(0, pathname.indexOf("/"));
            pathname = pathname.substring(pathname.indexOf("/"), pathname.length);
            paths.push(path);
        } else {
            paths.push(pathname);
            return paths;
        }
    }
}