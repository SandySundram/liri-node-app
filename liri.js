require("dotenv").config();
var appKeys = require("./keys.js");
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs");

var spotify = new Spotify(appKeys.spotify);
var client = new Twitter(appKeys.twitter);
var app = process.argv[2];
var songName;
var movieName;
var output;
var input;
var loopFlag = 0;


var dt = new Date();
var utcDate = dt.toUTCString();

input = 'User input at command: '+process.argv.join(" ");
writeToLog('-------------------------------------------NEW CALL-------------------------------------------'+'\n'+input);

if ((app != 'my-tweets') && (app != 'spotify-this-song') && (app != 'movie-this') && (app != 'do-what-it-says')){
    console.log("command not found: Please enter a valid command");
    writeToLog('\n'+"command not found: Please enter a valid command");

}else if(app == 'my-tweets'){

    twitterAPI();

}else if(app == 'spotify-this-song'){

    spotifyAPI(process.argv[3]);

}else if (app == 'movie-this'){

    omdbAPI(process.argv[3]);
    
}else if (app == 'do-what-it-says'){
    fs.readFile("random.txt","utf8",function(err,data){
        if (err) {
            writeToLog('\n'+'Error occurred: ' + err);
            return console.log('Error occurred: ' + err);
        }
        app = data.split(",");
        if(app[0] == 'spotify-this-song'){
            input = 'Read from random.txt: '+app[0]+' '+app[1];
            writeToLog('\n'+input);
            spotifyAPI(app[1]); 
        }else if(app[0] == 'movie-this'){
            input = 'Read from random.txt: '+app[0]+' '+app[1];
            writeToLog('\n'+input);
            if(app[1] != null){
                omdbAPI(app[1].trim()); 
            }else{
                omdbAPI(app[1]);
            }   
        }else if (app[0] == 'my-tweets'){
            twitterAPI(); 
        }
    });
}

function twitterAPI(){
    var params = {screen_name: 'nodejs'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log("Last 20 tweets --");
            writeToLog('\n'+"Output:"+'\n'+"Last 20 tweets --");
            for (var i = 0; i<20; i++){
                loopFlag++;
                console.log('"'+tweets[i].text+"'"+'... created @ '+tweets[i].created_at);
                console.log("---------------");
                writeToLog('"'+tweets[i].text+"'"+'... created @ '+tweets[i].created_at+'\n'+"---------------");
            }  
        }
    });
    loopFlag = 0;
}

function spotifyAPI(song){
    songName = song;
    if(songName == null){
        loopFlag++;
        console.log("\n"+"Since you did not enter a song name, we selected one for you...");
        writeToLog('\n'+'Since you did not enter a song name, we selected one for you...');
        songName = "The Sign (US Album) [Remastered]";
    }
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            writeToLog('\n'+'Error occurred: ' + err);
            loopFlag = 0;
            return console.log('Error occurred: ' + err);
        }
        output = '\n'+'Artist(s): '+data.tracks.items[0].album.artists[0].name+'\n'+
                'Song Name: '+data.tracks.items[0].name+'\n'+
                'Preview Link: '+data.tracks.items[0].external_urls.spotify+'\n'+
                'Album: '+data.tracks.items[0].album.name;
        console.log(output);
        writeToLog('\n'+'Ouput: '+output);
    });
    loopFlag = 0;
}

function omdbAPI(movie){
    movieName = movie;
    if(movieName == null){
        console.log("\n"+"Since you did not enter a movie name, we selected one for you..."+"\n");
        movieName = 'Mr. Nobody.';
        writeToLog('\n'+"Since you did not enter a movie name, we selected one for you...");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);
    request(queryUrl,function(error,response,body){
        if(!error && response.statusCode === 200){
            output = '\n'+"Movie Title: "+JSON.parse(body).Title+'\n'+
            "Year: "+JSON.parse(body).Year+'\n'+
            "Rating: "+JSON.parse(body).Rated+'\n'+
            "Rotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value+'\n'+
            "Country Produced: "+JSON.parse(body).Country+'\n'+
            "Language: "+JSON.parse(body).Language+'\n'+
            "Plot: "+JSON.parse(body).Plot+'\n'+
            "Actors: "+JSON.parse(body).Actors+'\n';

            console.log(output);
            writeToLog('\n'+'Output: '+output);
        }else{
            console.log("Something didn't go quite right. Please try again...");
            writeToLog('\n'+"Something didn't go quite right. Please try again...");
        }
    });
}

function writeToLog(logs){
    if(loopFlag > 0){
        addToFile = logs+'\n';
    }else{
        addToFile = dt.toUTCString()+logs+'\n';
    }
    fs.appendFile("./log.txt",addToFile,function(){

    })
}