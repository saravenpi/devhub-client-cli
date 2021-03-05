const colors = require("colors/safe");
const readlineSync = require("readline-sync");
const axios = require("axios");
const rp = require("request-promise");

console.log(colors.rainbow("WELCOME TO THE DEVHUB CLIENT!"));

const actions = ["signup", "login"];
const index = readlineSync.keyInSelect(actions, "What do you want to do?");

if (actions[index] == "signup") {
  const username = readlineSync.question(">Choose an username: ");
  if (username.trim() == "")
    return console.log(colors.red("PLEASE CHOOSE AN USERNAME"));

  const password = readlineSync.question(">Choose a password: ");
  if (password.trim() == "")
    return console.log(colors.red("PLEASE CHOOSE A PASSWORD"));

  const data = {
    username,
    password,
  };

  axios
    .post("https://devhub-driaug.herokuapp.com/api/auth/signup", data)
    .then(function (res) {
      console.log(`statusCode: ${res.statusCode}`);
      console.log(res.data);
    })
    .catch(function (error) {
      console.error(error);
    });
}

if (actions[index] == "login") {
  const username = readlineSync.question(">Enter your username: ");
  if (username.trim() == "")
    return console.log(colors.red("PLEASE ENTER AN USERNAME"));
  const password = readlineSync.question(">Enter your password: ");
  if (password.trim() == "")
    return console.log(colors.red("PLEASE ENTER A PASSWORD"));

  const data = { username, password };

  axios
    .post("https://devhub-driaug.herokuapp.com/api/auth/login", data)
    .then(function (res) {
      process.stdout.write("\033c");
      console.log(
        "You're logged in as: ",
        colors.rainbow(res.data.data.username)
      );
      const cookie = res.headers["set-cookie"][0];

      const options = {
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          cookie: cookie,
        },
        method: "GET",
        uri: "https://devhub-driaug.herokuapp.com/api/posts/post",
      };

      rp(options).then(function (body) {
        const tmtc = JSON.parse(body);
        const posts = tmtc.data;

        for (const post of posts) {
          console.log(post);
        }
      });
    })
    .catch(function (error) {
      console.error(error);
    });
}
