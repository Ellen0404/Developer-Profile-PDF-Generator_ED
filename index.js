// library packages
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const getRepo = require("./getRepo");
const generateHTML = require("./generateHTML.js");
var pdf = require("html-pdf");
var starCount = 0;

async function init() {
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

  const repo = await getRepo(name);
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

  axios.get(`https://api.github.com/users/${name}/starred`).then(function(res) {
    for (i = 0; i < res.data.length; i++) {
      starCount += res.data[0].stargazers_count;
    }

    return starCount;
    // console.log("stars: " + starCount);
  });

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
  const filename = data.login;
  var readHtml = fs.readFileSync(filename + ".html", "utf8");
  var options = { format: "Letter" };

  pdf.create(readHtml, options).toFile(filename + ".pdf", function(err, res) {
    if (err) return console.log(err);
    console.log(res);
  });

  // const conversion = await convertFactory({
  //   converterPath: convertFactory.converters.PDF
  // });
  // conversion({ html: html }, function(err, result) {
  //   if (err) {
  //     return console.error(err);
  //   }

  //   console.log(result.numberOfPages);
  //   console.log(result.logs);
  //   result.stream.pipe(fs.createWriteStream("profile.pdf"));
  //   conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
  // });
}

init();
