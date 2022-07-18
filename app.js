const express = require('express');
const bodyParser = require('body-parser');  //Requiring express, body-parser, request, and mailchimp modules
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

const port = 3000; 

app.use(express.static("static")); //Using express.static to load css and images
app.use(bodyParser.urlencoded({extended : true})); //Using body-parser to parse request body

mailchimp.setConfig({ //Setting up mailchimp
    apiKey: "ea7a7cae750a773d8b7a3f8714b2cd56-us8",
    server: "us8"
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userEmail = req.body.userEmail;

    const listId = "24725d7ed5";

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: userEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
            });
    
            res.sendFile(__dirname + "/success.html");
            
        } catch (error) {
            res.sendFile(__dirname + "/failure.html");
        }
        
    }
   run();

});

app.post("/success", (req, res) => {
    res.redirect("/");
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is listening on port " + port);
});
