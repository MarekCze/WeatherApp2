const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

/*
-----------Flickr API----------------

API Key = f4a5306f77de14c9fecd1b2d8d9f78de
Secret = cfc7e020b0eff0fe

-----------Flickr API----------------
*/

function apiCall(url){
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if(!err && res.statusCode == 200){
        resolve(JSON.parse(body));
      }

      reject(err);
    });
  });
}

const apiKey = 'c49a2d1598fabe97e4895101e8dfdf51';
const flickrAPIKey = 'f4a5306f77de14c9fecd1b2d8d9f78de';



app.get('/', async function(req, res){
  res.render('index', {weather: null, error: null});

});

app.post('/', async function(req, res){
    let city = req.body.city;
    var owmURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    var flickrURL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrAPIKey}&text=${city}&sort=relevance&per_page=20&format=json&nojsoncallback=1`;

    try{
    let weather = await apiCall(owmURL);
    let photos = await apiCall(flickrURL);

    console.log("Weather information");
    console.log(weather);
    console.log("Photo information");
    console.log(photos);

    let cityName = `${weather.name}`;
    let countryCode = `${weather.sys.country}`;
    let temperature = `${Math.round(weather.main.temp)}`;
    let description = `${weather.weather[0].description}`;
    let iconCode = `${weather.weather[0].icon}`;
    let windSpeed = `${weather.wind.speed}`;
    let windDirection = `${weather.wind.deg}`;
    let pressure = `${weather.main.pressure}`;
    let humidity = `${weather.main.humidity}`;


    let randomPhoto = Math.round(Math.random() * (20 - 0) + 0);
    console.log("Photo number " + randomPhoto + " has been chosen as the background");

    let farmID = photos.photos.photo[randomPhoto].farm;
    let serverID = photos.photos.photo[randomPhoto].server;
    let id = photos.photos.photo[randomPhoto].id;
    let secret = photos.photos.photo[randomPhoto].secret;

    photoURL = `https://farm${farmID}.staticflickr.com/${serverID}/${id}_${secret}.jpg`;
    console.log(photoURL);

    res.render('weatherView', {city: cityName, country: findCountry(countryCode), weather: temperature, des: description, ic: pickIcon(iconCode), ws: windSpeed, wd: findWindDirection(windDirection), p: pressure, h: humidity, photos: photoURL, error: null});
    } catch(err){
      res.render('weatherView', {weather: null, error: 'An error has occured during one of the API calls'})
    }
});

function pickIcon(iconCode){
  let iconImage;
  if(iconCode == '01d'){
    iconImage = '/img/01d.svg';
  } else if(iconCode == '01n'){
    iconImage = '/img/01n.svg';
  } else if(iconCode == '02d'){
    iconImage = '/img/02d.svg';
  } else if(iconCode == '02n'){
    iconImage = '/img/02n.svg';
  } else if(iconCode == '03d' || iconCode == '03n'){
    iconImage = '/img/03d.svg';
  } else if(iconCode == '04d' || iconCode == '04n'){
    iconImage = '/img/04d.svg';
  } else if(iconCode == '09d' || iconCode == '09n'){
    iconImage = '/img/09d.svg';
  } else if(iconCode == '10d'){
    iconImage = '/img/10d.svg';
  } else if(iconCode == '10n'){
    iconImage = '/img/10n.svg';
  } else if(iconCode == '11d' || iconCode == '11n'){
    iconImage = '/img/11d.svg';
  } else if(iconCode == '13d' || iconCode == '13n'){
    iconImage = '/img/13d.svg';
  } else if(iconCode == '50d' || iconCode == '50n'){
    iconImage = '/img/50d.svg';
  }

  return iconImage;
}

function findWindDirection(degrees){
  let direction;
  if(degrees <= 15 || degrees >= 345){
    direction = '/img/n.svg';
  } else if(degrees > 15 && degrees < 75){
    direction = '/img/ne.svg';
  } else if(degrees >=75 && degrees <= 105){
    direction = '/img/e.svg';
  } else if(degrees > 105 && degrees < 165){
    direction = '/img/se.svg';
  } else if(degrees >= 165 && degrees <= 195){
    direction = '/img/s.svg';
  } else if(degrees > 195 && degrees < 255){
    direction = '/img/sw.svg';
  } else if(degrees >= 255 && degrees <= 285){
    direction = '/img/w.svg';
  } else if(degrees > 285 && degrees < 345){
    direction = '/img/nw.svg';
  }

  return direction;
}

function findCountry(countryCode){
  let country;
  let countries = [
      {code:"AF", name:"AFGHANISTAN"},
      {code:"AL", name:"ALBANIA"},
      {code:"DZ", name:"ALGERIA"},
      {code:"AS", name:"AMERICAN SAMOA"},
      {code:"AD", name:"ANDORRA"},
      {code:"AO", name:"ANGOLA"},
      {code:"AQ", name:"ANTARCTICA"},
      {code:"AG", name:"ANTIGUA AND BARBUDA"},
      {code:"AR", name:"ARGENTINA"},
      {code:"AM", name:"ARMENIA"},
      {code:"AW", name:"ARUBA"},
      {code:"AU", name:"AUSTRALIA"},
      {code:"AT", name:"AUSTRIA"},
      {code:"AZ", name:"AZERBAIJAN"},
      {code:"BS", name:"BAHAMAS"},
      {code:"BH", name:"BAHRAIN"},
      {code:"BD", name:"BANGLADESH"},
      {code:"BB", name:"BARBADOS"},
      {code:"BY", name:"BELARUS"},
      {code:"BE", name:"BELGIUM"},
      {code:"BZ", name:"BELIZE"},
      {code:"BJ", name:"BENIN"},
      {code:"BM", name:"BERMUDA"},
      {code:"BT", name:"BHUTAN"},
      {code:"BO", name:"BOLIVIA"},
      {code:"BA", name:"BOSNIA AND HERZEGOVINA"},
      {code:"BW", name:"BOTSWANA"},
      {code:"BV", name:"BOUVET ISLAND"},
      {code:"BR", name:"BRAZIL"},
      {code:"IO", name:"BRITISH INDIAN OCEAN TERRITORY"},
      {code:"BN", name:"BRUNEI DARUSSALAM"},
      {code:"BG", name:"BULGARIA"},
      {code:"BF", name:"BURKINA FASO"},
      {code:"BI", name:"BURUNDI"},
      {code:"KH", name:"CAMBODIA"},
      {code:"CM", name:"CAMEROON"},
      {code:"CA", name:"CANADA"},
      {code:"CV", name:"CAPE VERDE"},
      {code:"KY", name:"CAYMAN ISLANDS"},
      {code:"CF", name:"CENTRAL AFRICAN REPUBLIC"},
      {code:"TD", name:"CHAD"},
      {code:"CL", name:"CHILE"},
      {code:"CN", name:"CHINA"},
      {code:"CX", name:"CHRISTMAS ISLAND"},
      {code:"CC", name:"COCOS (KEELING) ISLANDS"},
      {code:"CO", name:"COLOMBIA"},
      {code:"KM", name:"COMOROS"},
      {code:"CG", name:"CONGO"},
      {code:"CD", name:"CONGO, THE DEMOCRATIC REPUBLIC OF THE"},
      {code:"CK", name:"COOK ISLANDS"},
      {code:"CR", name:"COSTA RICA"},
      {code:"CI", name:"CÔTE D'IVOIRE"},
      {code:"HR", name:"CROATIA"},
      {code:"CU", name:"CUBA"},
      {code:"CY", name:"CYPRUS"},
      {code:"CZ", name:"CZECH REPUBLIC"},
      {code:"DK", name:"DENMARK"},
      {code:"DJ", name:"DJIBOUTI"},
      {code:"DM", name:"DOMINICA"},
      {code:"DO", name:"DOMINICAN REPUBLIC"},
      {code:"EC", name:"ECUADOR"},
      {code:"EG", name:"EGYPT"},
      {code:"SV", name:"EL SALVADOR"},
      {code:"GQ", name:"EQUATORIAL GUINEA"},
      {code:"ER", name:"ERITREA"},
      {code:"EE", name:"ESTONIA"},
      {code:"ET", name:"ETHIOPIA"},
      {code:"FK", name:"FALKLAND ISLANDS (MALVINAS)"},
      {code:"FO", name:"FAROE ISLANDS"},
      {code:"FJ", name:"FIJI"},
      {code:"FI", name:"FINLAND"},
      {code:"FR", name:"FRANCE"},
      {code:"GF", name:"FRENCH GUIANA"},
      {code:"PF", name:"FRENCH POLYNESIA"},
      {code:"TF", name:"FRENCH SOUTHERN TERRITORIES"},
      {code:"GA", name:"GABON"},
      {code:"GM", name:"GAMBIA"},
      {code:"GE", name:"GEORGIA"},
      {code:"DE", name:"GERMANY"},
      {code:"GH", name:"GHANA"},
      {code:"GI", name:"GIBRALTAR"},
      {code:"GR", name:"GREECE"},
      {code:"GL", name:"GREENLAND"},
      {code:"GD", name:"GRENADA"},
      {code:"GP", name:"GUADELOUPE"},
      {code:"GU", name:"GUAM"},
      {code:"GT", name:"GUATEMALA"},
      {code:"GN", name:"GUINEA"},
      {code:"GW", name:"GUINEA-BISSAU"},
      {code:"GY", name:"GUYANA"},
      {code:"HT", name:"HAITI"},
      {code:"HM", name:"HEARD ISLAND AND MCDONALD ISLANDS"},
      {code:"HN", name:"HONDURAS"},
      {code:"HK", name:"HONG KONG"},
      {code:"HU", name:"HUNGARY"},
      {code:"IS", name:"ICELAND"},
      {code:"IN", name:"INDIA"},
      {code:"ID", name:"INDONESIA"},
      {code:"IR", name:"IRAN, ISLAMIC REPUBLIC OF"},
      {code:"IQ", name:"IRAQ"},
      {code:"IE", name:"IRELAND"},
      {code:"IL", name:"ISRAEL"},
      {code:"IT", name:"ITALY"},
      {code:"JM", name:"JAMAICA"},
      {code:"JP", name:"JAPAN"},
      {code:"JO", name:"JORDAN"},
      {code:"KZ", name:"KAZAKHSTAN"},
      {code:"KE", name:"KENYA"},
      {code:"KI", name:"KIRIBATI"},
      {code:"KP", name:"KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF"},
      {code:"KR", name:"KOREA, REPUBLIC OF"},
      {code:"KW", name:"KUWAIT"},
      {code:"KG", name:"KYRGYZSTAN"},
      {code:"LA", name:"LAO PEOPLE'S DEMOCRATIC REPUBLIC (LAOS)"},
      {code:"LV", name:"LATVIA"},
      {code:"LB", name:"LEBANON"},
      {code:"LS", name:"LESOTHO"},
      {code:"LR", name:"LIBERIA"},
      {code:"LY", name:"LIBYAN ARAB JAMAHIRIYA"},
      {code:"LI", name:"LIECHTENSTEIN"},
      {code:"LT", name:"LITHUANIA"},
      {code:"LU", name:"LUXEMBOURG"},
      {code:"MO", name:"MACAO"},
      {code:"MK", name:"MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF"},
      {code:"MG", name:"MADAGASCAR"},
      {code:"MW", name:"MALAWI"},
      {code:"MY", name:"MALAYSIA"},
      {code:"MV", name:"MALDIVES"},
      {code:"ML", name:"MALI"},
      {code:"MT", name:"MALTA"},
      {code:"MH", name:"MARSHALL ISLANDS"},
      {code:"MQ", name:"MARTINIQUE"},
      {code:"MR", name:"MAURITANIA"},
      {code:"MU", name:"MAURITIUS"},
      {code:"YT", name:"MAYOTTE"},
      {code:"MX", name:"MEXICO"},
      {code:"FM", name:"MICRONESIA, FEDERATED STATES OF"},
      {code:"MD", name:"MOLDOVA, REPUBLIC OF"},
      {code:"MC", name:"MONACO"},
      {code:"MN", name:"MONGOLIA"},
      {code:"ME", name:"MONTENEGRO"},
      {code:"MS", name:"MONTSERRAT"},
      {code:"MA", name:"MOROCCO"},
      {code:"MZ", name:"MOZAMBIQUE"},
      {code:"MM", name:"MYANMAR"},
      {code:"NA", name:"NAMIBIA"},
      {code:"NR", name:"NAURU"},
      {code:"NP", name:"NEPAL"},
      {code:"NL", name:"NETHERLANDS"},
      {code:"AN", name:"NETHERLANDS ANTILLES"},
      {code:"NC", name:"NEW CALEDONIA"},
      {code:"NZ", name:"NEW ZEALAND"},
      {code:"NI", name:"NICARAGUA"},
      {code:"NE", name:"NIGER"},
      {code:"NG", name:"NIGERIA"},
      {code:"NU", name:"NIUE"},
      {code:"NF", name:"NORFOLK ISLAND"},
      {code:"MP", name:"NORTHERN MARIANA ISLANDS"},
      {code:"NO", name:"NORWAY"},
      {code:"OM", name:"OMAN"},
      {code:"PK", name:"PAKISTAN"},
      {code:"PW", name:"PALAU"},
      {code:"PS", name:"PALESTINIAN TERRITORY, OCCUPIED"},
      {code:"PA", name:"PANAMA"},
      {code:"PG", name:"PAPUA NEW GUINEA"},
      {code:"PY", name:"PARAGUAY"},
      {code:"PE", name:"PERU"},
      {code:"PH", name:"PHILIPPINES"},
      {code:"PN", name:"PITCAIRN"},
      {code:"PL", name:"POLAND"},
      {code:"PT", name:"PORTUGAL"},
      {code:"PR", name:"PUERTO RICO"},
      {code:"QA", name:"QATAR"},
      {code:"RE", name:"RÉUNION"},
      {code:"RO", name:"ROMANIA"},
      {code:"RU", name:"RUSSIAN FEDERATION"},
      {code:"RW", name:"RWANDA"},
      {code:"SH", name:"SAINT HELENA"},
      {code:"KN", name:"SAINT KITTS AND NEVIS"},
      {code:"LC", name:"SAINT LUCIA"},
      {code:"PM", name:"SAINT PIERRE AND MIQUELON"},
      {code:"VC", name:"SAINT VINCENT AND THE GRENADINES"},
      {code:"WS", name:"SAMOA"},
      {code:"SM", name:"SAN MARINO"},
      {code:"ST", name:"SAO TOME AND PRINCIPE"},
      {code:"SA", name:"SAUDI ARABIA"},
      {code:"SN", name:"SENEGAL"},
      {code:"RS", name:"SERBIA"},
      {code:"SC", name:"SEYCHELLES"},
      {code:"SL", name:"SIERRA LEONE"},
      {code:"SG", name:"SINGAPORE"},
      {code:"SK", name:"SLOVAKIA"},
      {code:"SI", name:"SLOVENIA"},
      {code:"SB", name:"SOLOMON ISLANDS"},
      {code:"SO", name:"SOMALIA"},
      {code:"ZA", name:"SOUTH AFRICA"},
      {code:"GS", name:"SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS"},
      {code:"ES", name:"SPAIN"},
      {code:"LK", name:"SRI LANKA"},
      {code:"SD", name:"SUDAN"},
      {code:"SR", name:"SURINAME"},
      {code:"SJ", name:"SVALBARD AND JAN MAYEN"},
      {code:"SZ", name:"SWAZILAND"},
      {code:"SE", name:"SWEDEN"},
      {code:"CH", name:"SWITZERLAND"},
      {code:"SY", name:"SYRIAN ARAB REPUBLIC"},
      {code:"TW", name:"TAIWAN"},
      {code:"TJ", name:"TAJIKISTAN"},
      {code:"TZ", name:"TANZANIA, UNITED REPUBLIC OF"},
      {code:"TH", name:"THAILAND"},
      {code:"TL", name:"TIMOR-LESTE"},
      {code:"TG", name:"TOGO"},
      {code:"TK", name:"TOKELAU"},
      {code:"TO", name:"TONGA"},
      {code:"TT", name:"TRINIDAD AND TOBAGO"},
      {code:"TN", name:"TUNISIA"},
      {code:"TR", name:"TURKEY"},
      {code:"TM", name:"TURKMENISTAN"},
      {code:"TC", name:"TURKS AND CAICOS ISLANDS"},
      {code:"TV", name:"TUVALU"},
      {code:"UG", name:"UGANDA"},
      {code:"UA", name:"UKRAINE"},
      {code:"AE", name:"UNITED ARAB EMIRATES"},
      {code:"GB", name:"UNITED KINGDOM"},
      {code:"US", name:"UNITED STATES"},
      {code:"UM", name:"UNITED STATES MINOR OUTLYING ISLANDS"},
      {code:"UY", name:"URUGUAY"},
      {code:"UZ", name:"UZBEKISTAN"},
      {code:"VU", name:"VANUATU"},
      {code:"VE", name:"VENEZUELA"},
      {code:"VN", name:"VIET NAM"},
      {code:"VG", name:"VIRGIN ISLANDS, BRITISH"},
      {code:"VI", name:"VIRGIN ISLANDS, U.S."},
      {code:"WF", name:"WALLIS AND FUTUNA"},
      {code:"EH", name:"WESTERN SAHARA"},
      {code:"YE", name:"YEMEN"},
      {code:"ZM", name:"ZAMBIA"},
      {code:"ZW", name:"ZIMBABWE"}
    ]

  countries.forEach(function (element) {
    if(element.code == countryCode){
      console.log(element.name);
      country =  element.name;
    }
  });

  return country;
}

app.listen(3000, function () {
  console.log('Weather app listening on port 3000!')
})
