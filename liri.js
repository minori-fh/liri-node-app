require("dotenv").config();
var axios = require("axios");
var moments = require("moment")
var inquirer = require("inquirer");


var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Variable declarations
var movie = ""
var song = ""
var artist = ""


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
        .then(function(inquirerResponse){
            artist = inquirerResponse.concert
            console.log("picked artist" + artist)

            axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&date=upcoming").then(
                function(response){
                    console.log(response)
                }
            )
        })
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
        .then(function(inquirerResponse){
            song = inquirerResponse.song
            console.log("You picked a song!" + song)

            spotify.search({ type: 'track', query: song},
                function(err, data){

                    if (err){
                        return console.log("Error occured: " + err)
                    }
            
                    console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name)

                    if (data.tracks.items[0].album.album_type === "album"){ //freaky is a single
                        console.log("Song name: " + song)
                    } else {
                        console.log("Song name: " + data.tracks.items[0].album.name)
                    }

                    console.log("Song preview: " + data.tracks.items[0].album.external_urls.spotify)

                    if (data.tracks.items[0].album.album_type === "single"){ //freaky is a single
                        console.log("Album name: N/A - this is a single!")
                    } else if (data.tracks.items[0].album.album_type === "album"){
                        console.log("Album name: " + data.tracks.items[0].album.name)
                    }
                }
                )
        })
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