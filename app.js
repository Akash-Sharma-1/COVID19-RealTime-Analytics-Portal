const path = require("path");
const express = require("express");
const hbs = require("hbs");
var request = require("request");
var Handlebars = require("hbs");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "public");
app.use(express.static(publicDirectoryPath));

app.set("view engine", "hbs");
const viewsPath = path.join(__dirname, "views");
app.set("views", viewsPath);

// Handlebars.registerHelper("json", function(context) {
//   return JSON.stringify(context);
// });

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  //total world
  var options1 = {
    method: "GET",
    url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php",
    json: true,
    headers: {
      "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
      "x-rapidapi-key": "8ca55d83ccmsha37b92cc7723a3cp17ec51jsnb62a8633e050"
    }
  };

  request(options1, function(error, response, body) {
    if (error) throw new Error(error);

    console.log("total cases: around the World is: " + body.total_cases);

    const total_cases = body.total_cases;
    console.log("total deaths :" + body.total_deaths);

    var options2 = {
      method: "GET",
      url:"https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php",
      json: true,
      headers: {
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
        "x-rapidapi-key": "8ca55d83ccmsha37b92cc7723a3cp17ec51jsnb62a8633e050"
      }
    };

    request(options2, function(error, response, body1) {
    	//india cases
	    var options3 = {
	      method: "GET",
	      url:"https://api.rootnet.in/covid19-in/stats/latest",
	      json: true,
	    };
	     request(options3, function(error, response, body2) {

		      if (error) throw new Error(error);
		      var india_total_cases=body2["data"]["summary"]["total"];
		      var india_total_IndianCases=body2["data"]["summary"]["confirmedCasesIndian"];
		      var india_total_ForeignCases=body2["data"]["summary"]["confirmedCasesForeign"];
		      var india_total_deaths=body2["data"]["summary"]["deaths"];
		      var india_total_recovered=body2["data"]["summary"]["discharged"];
		      // console.log(india_total_cases);

		      let jsonforstates=body2["data"]["regional"];
		      let arrforstates=[];
		      jsonforstates.forEach(myFunc);

		      function myFunc(value, index, array) {
				  arrforstates.push([value["loc"],value["confirmedCasesIndian"],value["confirmedCasesForeign"],value["deaths"],value["discharged"]]);
				}

				jsonarrforstates={"data":arrforstates};

				// console.log(arrforstates);
		      let d = JSON.stringify(body1);
		      let sta = body1.statistic_taken_at;
		      // console.log(d);
		      console.log(sta);

		      var arrforgraph=[];
		      var arrforcou=body1["countries_stat"];

			arrforcou.forEach(myFunction);
		      function myFunction(value, index, array) {
				  arrforgraph.push([value["country_name"],value["cases"],value["deaths"]]);
				}
				// console.log(arrforgraph);
				var jsonarrforgraph={"data":arrforgraph};

           var options4 = {
            method: "GET",
            url:"https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise",
            json: true,
          };

          request(options4, function(error, response, body4) {

          if (error) throw new Error(error);
          var total_cases_unoff=body4["data"]["total"]["confirmed"];
          var total_recovered_unoff=body4["data"]["total"]["recovered"];
          var total_deaths_unoff=body4["data"]["total"]["deaths"];
          var total_active_unoff=body4["data"]["total"]["active"];
           let jsonforstates_unoff=body4["data"]["statewise"];
          let arrforstates_unoff=[];
              jsonforstates_unoff.forEach(myFunc_unoff);

              function myFunc_unoff(value, index, array) {
              arrforstates_unoff.push([value["state"],value["confirmed"],value["recovered"],value["deaths"],value["active"]]);
            }

            jsonarrforstate_unoff={"data":arrforstates_unoff};

         


		      res.render("index_new", {
		        title: "DATA",
		        tc: body.total_cases,
		        td: body.total_deaths,
		        tr: body.total_recovered,
		        tnc: body.new_cases,
		        tnd: body.new_deaths,
				arrforgraph: encodeURI(JSON.stringify(jsonarrforgraph)),
		        hello: d,
		        sta:sta,
		        itc:india_total_cases,
		        itic:india_total_IndianCases,
		        itfc:india_total_ForeignCases,
		        itd:india_total_deaths,
		        itr:india_total_recovered,
		        arrforstate:encodeURI(JSON.stringify(jsonarrforstates)),
            itc_unoff:total_cases_unoff,
            iac_unoff:total_active_unoff,
            itd_unoff:total_deaths_unoff,
            itr_unoff:total_recovered_unoff,
            arrforstate_unoff:encodeURI(JSON.stringify(jsonarrforstate_unoff))
		      });


        });
      });
    });
  });
});

app.get("/search", (req, res) => {
  res.render("search");
});

app.post("/search", (req, res) => {
  console.log(req.body.sbc);

  const cname = req.body.sbc;

  var options = {
    method: "GET",
    url:"https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php",
    json: true,
    qs: { country: cname },
    headers: {
      "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
      "x-rapidapi-key": "8ca55d83ccmsha37b92cc7723a3cp17ec51jsnb62a8633e050"
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    // console.log(body);
    // var b = JSON.parse()
    if (Object.keys(body.latest_stat_by_country).length === 0) {
      return res.render("search", {
        err: "Check Spelling or result not Found"
      });
    } else {
      res.render("search", {
        country: body.country,
        tc: body.latest_stat_by_country[0].total_cases,
        nc: body.latest_stat_by_country[0].new_cases,
        ac: body.latest_stat_by_country[0].active_cases,
        td: body.latest_stat_by_country[0].total_deaths,
        nd: body.latest_stat_by_country[0].new_deaths,
        trc: body.latest_stat_by_country[0].total_recovered,
        sc: body.latest_stat_by_country[0].serious_critical,
        tcpm: body.latest_stat_by_country[0].total_cases_per1m,
        rd: body.latest_stat_by_country[0].record_date
      });
    }
  });
});

app.get("/instruction", (req, res) => {
  res.render("instruction");
});

app.get("/myth", (req, res) => {
  res.render("myth");
});

app.listen(port, () => {
  console.log("Server is Up on Port" + port);
});
