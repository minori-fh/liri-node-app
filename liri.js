var dotenv = require("dotenv").config();
var axios = require("axios");
var moments = require("moment")
var inquirer = require("inquirer");

var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);

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