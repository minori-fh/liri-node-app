var dotenv = require("dotenv").config();
var axios = require("axios");
var moments = require("moment")
var inquirer = require("inquirer");
var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);

//Variable declarations
var movie = ""


//Function declarations
function moviePrompt(){
    inquirer
    .prompt([
        {
        type: "input",
        message: "What movie would you like to get information about?",
        name: "movie"
        },
    ])
    .then(function(inquirerResponse){
        movie = inquirerResponse.movie

        axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
            function(response){
                console.log("Title: " + response.data.Title)
                console.log("Year: " + response.data.Year)
                console.log("IMDB Rating: " + response.data.imdbRating)
                console.log("Rotten Tomatoes Rating : " + response.data.Ratings[1].Value)
                console.log("Country produced : " + response.data.Country)
                console.log("Language : " + response.data.Language)
                console.log("Plot : " + response.data.Plot)
                console.log("Actors : " + response.data.Actors)
            }
            // .catch(function(error){
            //     if (error) {
            //         return console.log(error);
            //       }
            // })
        )
    });
}

function concertPrompt(){
    inquirer
        .prompt([
            {
            type: "input",
            message: "Which artist would you like to get concert information about?",
            name: "concert"
            },
        ])
}

function spotifyPrompt(){
    inquirer
        .prompt([
            {
            type: "input",
            message: "Which song would you like to get information about?",
            name: "song"
            },
        ])
}


// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    // Here we give the user a list to choose from.
    {
      type: "list",
      message: "Which command would you like to run?",
      choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
      name: "command"
    },
  ])
  .then(function(inquirerResponse){
      if (inquirerResponse.command === "concert-this"){
          concertPrompt();

      } else if (inquirerResponse.command === "spotify-this-song") {
          spotifyPrompt();

      } else if (inquirerResponse.command === "movie-this") {
          moviePrompt();

      } else if (inquirerResponse.command === "do-what-it-says"){

      }

  });