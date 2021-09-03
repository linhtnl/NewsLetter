const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')



const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.listen(process.env.PORT || 3000, function () {
    console.log("Connected!")
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/pages/signup.html')
})
app.post('/signup', function (req, res) {
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let email = req.body.email
    let data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    let jsonData = JSON.stringify(data)
    const mailChimpAPI = '6ccd3f805ed2768ddcdd2e4ea7828aa7-us5'
    const ID = '744198b412'
    const url = 'https://us5.api.mailchimp.com/3.0/lists/' + ID
    const options = {
        method: 'POST',
        auth: 'linhtnl:' + mailChimpAPI
    }
    const request = https.request(url, options, function(response) {
        if(response.statusCode === 200){
            res.sendFile(__dirname+'/pages/success.html')
        }else{
            res.sendFile(__dirname+'/pages/failure.html')
        }
        response.on('data', function(data){
            //console.log(JSON.parse(data))
        })
    })
    request.write(jsonData)
    request.end()

})

app.post("/failure", function(req,res){
    res.redirect('/')
})