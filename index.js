// LIBRARIES PACKAGES

const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generateHTML.js");
var pdf = require("html-pdf");

var starCount = 0;

async function init() {
  try {
    // QUESTIONS TO USER
    const responses = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is your GitHub username?"
      },
      {
        type: "list",
        message: "What is your preferred color for background?",
        name: "color",
        choices: ["green", "blue", "pink", "red"]
      }
    ]);

    const { name, color } = responses;
    console.log({ name, color });

    // GET GITHUB INFO FROM GITHUB API
    const repo = await axios.get(`https://api.github.com/users/${name}`);
    const { data } = repo;
    const {
      name: gitName,
      avatar_url,
      login,
      location,
      html_url,
      blog,
      bio,
      public_repos,
      followers,
      following
    } = data;

    // GET STARS COUNT
    const getStars = await axios.get(
      `https://api.github.com/users/${name}/starred`
    );

    for (i = 0; i < getStars.data.length; i++) {
      starCount += getStars.data[0].stargazers_count;
    }
    console.log("stars inside: " + starCount);

    // CREATE HTML FILE
    const html = await generateHTML({
      color,
      starCount,
      gitName,
      avatar_url,
      login,
      location,
      html_url,
      blog,
      bio,
      public_repos,
      followers,
      following
    });

    fs.writeFileSync(data.login + ".html", html, function(err) {
      if (err) {
        throw err;
      }
    });

    // CREATE PDF FROM HTML
    const filename = data.login;
    var readHtml = fs.readFileSync(filename + ".html", "utf8");
    var options = { format: "Letter" };

    pdf.create(readHtml, options).toFile(filename + ".pdf", function(err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
  } catch (err) {
    console.log(err);
  }
}

init();
