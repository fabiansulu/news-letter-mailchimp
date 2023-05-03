//jshint esversion:6

const express = require("express");
const bodyParser = require ("body-parser");
const request = require("request");
const https = require("https")

const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req, res){

    const firstname = req.body.fName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME : firstname,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://usX.api.mailchimp.com/3.0/lists/your-list-id";

    const options = {
        method: "POST",
        auth: "authentik:your-api"
    }

    const rq = https.request(url, options, function(response){
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }


        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    rq.write(jsonData);
    rq.end();

});


app.post("/home", function(req, res){
    res.redirect("/");
})




app.listen(process.env.PORT || 3000, function(){
    console.log("Server is up and running")
});


