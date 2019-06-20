require("dotenv").config();
var axios = require("axios");
var moment = require("moment")
var inquirer = require("inquirer");
var fs = require("fs");


var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Variable declarations
var movie = ""
var song = ""
var artist = ""
var date = ""
var formattedDate = ""

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
        //In case user leaves input blank
        if (inquirerResponse.movie === ""){
            console.log("You didn't input anything! Here's a movie rec: ")
            movie = "Mr. Nobody"
        } else {
            movie = inquirerResponse.movie
        }

        axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
            function(response){
                if (response.data.Title === undefined){
                    console.log("Seems like this isn't a movie...")
                } else {
                    console.log("Title: " + response.data.Title)
                    console.log("Year: " + response.data.Year)
                    console.log("IMDB Rating: " + response.data.imdbRating)
                    console.log("Rotten Tomatoes Rating : " + response.data.Ratings[1].Value)
                    console.log("Country produced : " + response.data.Country)
                    console.log("Language : " + response.data.Language)
                    console.log("Plot : " + response.data.Plot)
                    console.log("Actor(s) : " + response.data.Actors)
                }
            })
            .catch(function(error){
                if (error) {
                    return console.log(error, error.message);
                  }
            }) 
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

        axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&date=upcoming").then(
            function(response){
        
                if (response.data.length === 0){
                    console.log("NO UPCOMING EVENTS!")
                } else {
                    if (response.data[0].venue === undefined){
                        console.log("THIS IS NOT AN ARTIST!")
                    } else {
                        console.log("Venue name: " + response.data[0].venue.name)
                        console.log("Venue location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + " " + response.data[0].venue.country)
                        
                        // format date with moment
                        date = response.data[0].datetime.slice(0,10)
                        formattedDate = moment(date, "YYYY-MM-DD").format("MM/DD/YYYY")
                        console.log("Event date: " + formattedDate)
                    }
                }; 
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
         //In case user leaves input blank
         if (inquirerResponse.song === ""){
            console.log("You didn't input anything! Here's a song rec: ")
            song = "Freaky"
        } else {
            song = inquirerResponse.song
        }

        spotify.search({ type: 'track', query: song},
            function(err, data){

                if (err){
                    return console.log("Error occured: " + err)
                }
        
                console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name)

                //Check if the song is part of an album
                if (data.tracks.items[0].album.album_type === "album"){ //ex: freaky is a single
                    console.log("Song name: " + song)
                } else {
                    console.log("Song name: " + data.tracks.items[0].album.name)
                }
                
                console.log("Song preview: " + data.tracks.items[0].album.external_urls.spotify)

                //Check if the song is a single
                if (data.tracks.items[0].album.album_type === "single"){ //ex: formation is from an album
                    console.log("Album name: N/A - this is a single!")
                } else if (data.tracks.items[0].album.album_type === "album"){
                    console.log("Album name: " + data.tracks.items[0].album.name)
                }
            }
            )
    })
}

function doIt(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console. "\n" will split in a new line
        if (error) {
          return console.log(error);
        }
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        
        command =  dataArr[0],
        song =  dataArr[1]

        if (command === "concert-this"){
            axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&date=upcoming").then(
                function(response){
            
                    if (response.data.length === 0){
                        console.log("NO UPCOMING EVENTS!")
                    } else {
                        if (response.data[0].venue === undefined){
                            console.log("THIS IS NOT AN ARTIST!")
                        } else {
                            console.log("Venue name: " + response.data[0].venue.name)
                            console.log("Venue location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + " " + response.data[0].venue.country)
                            
                            // format date with moment
                            date = response.data[0].datetime.slice(0,10)
                            formattedDate = moment(date, "YYYY-MM-DD").format("MM/DD/YYYY")
                            console.log("Event date: " + formattedDate)
                        }
                    }; 
                }
            )
  
        } else if (command === "spotify-this-song") {
            spotify.search({ type: 'track', query: song},
            function(err, data){

                if (err){
                    return console.log("Error occured: " + err)
                }
        
                console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name)

                //Check if the song is part of an album
                if (data.tracks.items[0].album.album_type === "album"){ //ex: freaky is a single
                    console.log("Song name: " + song)
                } else {
                    console.log("Song name: " + data.tracks.items[0].album.name)
                }
                
                console.log("Song preview: " + data.tracks.items[0].album.external_urls.spotify)

                //Check if the song is a single
                if (data.tracks.items[0].album.album_type === "single"){ //ex: formation is from an album
                    console.log("Album name: N/A - this is a single!")
                } else if (data.tracks.items[0].album.album_type === "album"){
                    console.log("Album name: " + data.tracks.items[0].album.name)
                }
            }
            )
        } else if (command === "movie-this") {
            axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
                function(response){
                    if (response.data.Title === undefined){
                        console.log("Seems like this isn't a movie...")
                    } else {
                        console.log("Title: " + response.data.Title)
                        console.log("Year: " + response.data.Year)
                        console.log("IMDB Rating: " + response.data.imdbRating)
                        console.log("Rotten Tomatoes Rating : " + response.data.Ratings[1].Value)
                        console.log("Country produced : " + response.data.Country)
                        console.log("Language : " + response.data.Language)
                        console.log("Plot : " + response.data.Plot)
                        console.log("Actor(s) : " + response.data.Actors)
                    }
                })
                .catch(function(error){
                    if (error) {
                        return console.log(error, error.message);
                      }
                }) 
        }
        
      })
};


// Create a "Prompt" with question
inquirer
  .prompt([
    // Give the user a list to choose from
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
          doIt();
      }

  });