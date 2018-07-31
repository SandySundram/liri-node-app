require("dotenv").config();
var appKeys = require("./keys.js");
var request = require("request");
var Spotify = require('node-spotify-api');
var fs = require("fs");

var spotify = new Spotify(appKeys.spotify);
// var client = new Twitter(appKeys.twitter);
var app = process.argv[2];
var songName;
var movieName;

// console.log(spotify);


if ((app != 'my-tweets') && (app != 'spotify-this-song') && (app != 'movie-this') && (app != 'do-what-it-says')){
    console.log("command not found: Please enter a valid command");
}else if(app == 'my-tweets'){

}else if(app == 'spotify-this-song'){

spotifyAPI(process.argv[3]);

}else if (app == 'movie-this'){

    omdbAPI(process.argv[3]);
    
}else if (app == 'do-what-it-says'){
    fs.readFile("random.txt","utf8",function(err,data){
        if (err) {
            return console.log(err);
        }
        // console.log(data);
        app = (data.split(','));
        if(app[0] == 'spotify-this-song'){
            spotifyAPI(app[1]);
        }else if(app[0] == 'movie-this'){
            omdbAPI(app[1]);
        }
    });
}

function spotifyAPI(song){
    songName = song;
    if(songName == null){
        console.log("\n"+"Since you did not enter a song name, we selected one for you...");
        songName = "The Sign (US Album) [Remastered]";
    }
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log(data.tracks);
        console.log('\n');
        console.log('Artist(s): '+data.tracks.items[0].album.artists[0].name); 
        console.log('Song Name: '+data.tracks.items[0].name); 
        console.log('Preview Link: '+data.tracks.items[0].external_urls.spotify); 
        console.log('Album: '+data.tracks.items[0].album.name); 
    });
}

function omdbAPI(movie){
    movieName = movie;
    if(movieName == null){
        console.log("\n"+" Since you did not enter a movie name, we selected one for you..."+"\n");
        movieName = 'Mr. Nobody.';
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl,function(error,response,body){
        if(!error && response.statusCode === 200){
            console.log('\n'+" Movie Title: "+JSON.parse(body).Title+'\n',
                        "Year: "+JSON.parse(body).Year+'\n',
                        "Rating: "+JSON.parse(body).Rated+'\n',
                        "Rotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value+'\n',
                        "Country Produced: "+JSON.parse(body).Country+'\n',
                        "Language: "+JSON.parse(body).Language+'\n',
                        "Plot: "+JSON.parse(body).Plot+'\n',
                        "Actors: "+JSON.parse(body).Actors+'\n');
        }else{
            Console.log("Something didn't go quite right. Please try again...")
        }
    })
}