var needle = require("needle")
var colors = require("colors/safe")
var readlineSync = require('readline-sync')
const axios = require('axios')
var rp = require("request-promise")

console.log(colors.rainbow("WELCOME TO THE DEVHUB CLIENT!"))
var actions = ['signup', 'login']

var index = readlineSync.keyInSelect(actions, 'What do you want to do?');
if (actions[index] == "signup") {
  var username = readlineSync.question(">Choose an username: ")
  if (username.trim() == '') return console.log(colors.red("PLEASE CHOOSE AN USERNAME"));
  var password = readlineSync.question(">Choose a password: ")
  if (password.trim() == '') return console.log(colors.red("PLEASE CHOOSE A PASSWORD"));

  var data = {
    username: username,
    password: password
  }
  axios.post('https://devhub-driaug.herokuapp.com/api/auth/signup', data).then(function(res) {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res.data)

  }).catch(function(error) {
    console.error(error)

  })



}

if (actions[index] == "login") {
  var username = readlineSync.question(">Enter your username: ")
  if (username.trim() == '') return console.log(colors.red("PLEASE ENTER AN USERNAME"));
  var password = readlineSync.question(">Enter your password: ")
  if (password.trim() == '') return console.log(colors.red("PLEASE ENTER A PASSWORD"));

  var data = {
    username: username,
    password: password,
  }
  axios.post('https://devhub-driaug.herokuapp.com/api/auth/login', data).then(function(res) {
    process.stdout.write('\033c')
    console.log("You're logged in as: ", colors.rainbow(res.data.data.username))
    var cookie = res.headers["set-cookie"][0]


    var options = {
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        cookie: cookie
      },
      method: "GET",
      uri: "https://devhub-driaug.herokuapp.com/api/posts/post"
    }


    rp(options).then(function(body) {
      var tmtc = JSON.parse(body)
      //process.stdout.write('\033c')
      console.log(tmtc.data)
    });


  }).catch(function(error) {
    console.error(error)

  })
}