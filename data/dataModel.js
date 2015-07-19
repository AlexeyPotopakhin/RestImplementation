function DataModel() {
    this.data = require("./hotels.json");
}

DataModel.prototype.getCountriesList = getCountriesList;
DataModel.prototype.getHotelsInCountryList = getHotelsInCountryList;
DataModel.prototype.getHotelDescription = getHotelDescription;
DataModel.prototype.addCountry = addCountry;
DataModel.prototype.addHotelInCountry = addHotelInCountry;
DataModel.prototype.deleteHotel = deleteHotel;
DataModel.prototype.updateHotel = updateHotel;
DataModel.prototype.saveModelToFile = saveModelToFile;

function getCountriesList() {
    var countriesList = [];
    this.data.forEach(function(country) {
        countriesList.push(country.name);
    });
    return countriesList;
}

function getHotelsInCountryList(countryName) {
    var hotelsList = [];
    for(var country in this.data) {
        if(this.data[country].name == countryName) {
            for(var hotel in this.data[country].hotels) {
                hotelsList.push(this.data[country].hotels[hotel].name);
            }
            break;
        }
    }
    return hotelsList;
}

function getHotelDescription(hotelName) {
    for(var country in this.data) {
        for(var hotel in this.data[country].hotels) {
            if(this.data[country].hotels[hotel].name == hotelName) {
                return this.data[country].hotels[hotel].description;
            }
        }
    }
}

function addCountry(name, description) {
    var country = '{'
        + '"name":"' + name
        + '", "description":"' + description
        + '", "hotels":[]}';
    this.data.push(JSON.parse(country));
}

function addHotelInCountry(countryName, name, description) {
    for(var country in this.data) {
        if(this.data[country].name == countryName) {
            var hotel = '{'
                + '"name":"' + name
                + '", "description":"' + description
                + '"}';
            this.data[country].hotels.push(JSON.parse(hotel));
            return true;
        }
    }
    return false;
}

function deleteHotel(hotelName) {
    for(var country in this.data) {
        for(var hotel in this.data[country].hotels) {
            if(this.data[country].hotels[hotel].name == hotelName) {
                this.data[country].hotels.splice(hotel, 1);
                return true;
            }
        }
    }
    return false;
}

function updateHotel(hotelName, newName, newDescription) {
    for(var country in this.data) {
        for(var hotel in this.data[country].hotels) {
            if(this.data[country].hotels[hotel].name == hotelName) {
                this.data[country].hotels[hotel].name = newName;
                this.data[country].hotels[hotel].description = newDescription;
                return true;
            }
        }
    }
    return false;
}

function saveModelToFile(fs) {
    fs.writeFile("data/hotels.json", JSON.stringify(this.data));
}

module.exports = DataModel;