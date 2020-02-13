const axios = require("axios");

function getRepo(name) {
  return axios.get(`https://api.github.com/users/${name}`);

  // .then(function (response) {
  //     console.log(response);
  //     const { data} = response;
  //     const { avatar_url, login , location , html_url, blog, bio, public_repos, followers} =   data;

  //     const profileImg =  avatar_url;
  //     const userName = login; //??
  //     const userLocation =  location;
  //     const userGitHub =  html_url;
  //     const userBlog =  blog;
  //     const userBio =  bio;
  //     const publicRepo =  public_repos;
  //     const numOfFollowers =  followers;
  //     // let numOfStars = response.data.???;
  //     const numOfFollowing =  following;

  //     const HTML =  generateHTML.generateHTML({color,profileImg, userName, userLocation}); //?

  //   response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
}

module.exports = getRepo;
