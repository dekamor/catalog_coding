//Javascript baybee
// This is the overall API search function for the program. It will ping through each media outlet API to search based on the user input
// The user will need to choose the media they are searching for and then enter their search results
// The search will then call the right search function based on the media



// This is just a dummy test to see if the various inputs make a difference
// There is no error handling in terms of the media since the user will have to select one based on the drop down
// const prompt = require('prompt-sync')();

// const media_search = prompt('What Media are you searching for? ');
//console.log(`Searching for ${media_search}`);

// const search_parameters = prompt(`What ${media_search} are you looking for? `)
// console.log(`Search for ${search_parameters}`);

//  api_search(media_search,search_parameters); //main media search function call 


//Overall search function
//Takes a media in put and the search parameter input
// based on the media search it will go case by case to pick the right searching function



// const axios = require('axios').default;

const searchResults = document.querySelector('.search-results');

define(function (require){
    var axios = require('axios').default;
});

function api_search(media_search, search_parameters){
    switch(media_search){
        case "movie":
            let movie_print_check = 0; // to account if the movie of the search item exists
            getMovieRequest(search_parameters,movie_print_check);
            break;
        case "video_game":
            getGameRequest(search_parameters);
            break;
        case "book":
            getBookRequest(search_parameters);
            break;
        case "anime":
            getAnimeRequest(search_parameters);
            break;
    }

}

// movie searching function 


function getMovieRequest(movie_name,movie_print_check) {   

    //movie search parameter is entered here from movie name and updates the url for the get command to check
    // results are populated when the axios.request(options) is run   
    var options = {
    method: 'GET',
    url: 'https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/' + movie_name,
    headers: {
        'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com',
        'x-rapidapi-key': '3786daeb32mshbc6d1e772e4bd57p1abb9ajsn82380529f73e'
    }
    };
    
       
    // var axios = require("axios").default;
    //console.log(options)
    axios.request(options).then(function (response) {
      
       // for loop runs through all of the search results and grabs the length of the sesarch
       // the loop then iterates through each of the ids and calls another get function request to get the id's details

       var search_length = Object.keys(response.data.titles).length
       search_Results = response.data;
               
        for(let i = 0; i<search_length; i++ ) {

            movie_id = search_Results.titles[i].id // this is the imdb id of the movie in the loop
            
            //get request to get the film details of the movie in the search results
            var filmData = {
                method: 'GET',
                url: 'https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/'+movie_id,
                headers: {
                'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com',
                'x-rapidapi-key': '3786daeb32mshbc6d1e772e4bd57p1abb9ajsn82380529f73e'
                }
             };
          
            axios.request(filmData).then(function (filmDetails) {

                //updates the outputs to include more details for the film user is searching for
                search_Results.titles[i].year = filmDetails.data.year
                search_Results.titles[i].lengthFilm = filmDetails.data.length
                search_Results.titles[i].details = filmDetails.data.plot;
               
               // this segment checks if any plot detail exists, if it doesn't then it isn't a movie
               // if plot detail exists then it gets displayed as a results
                if (filmDetails.data.plot == '')
                {
                    // we don't want to do anything here we just want to pass the loop
                } else {
                    console.log(search_Results.titles[i]) 
                    movie_print_check = movie_print_check+1;
                                       
                }
                if (i == search_length -1){
                    if (movie_print_check ==0){
                        console.log("Sorry no movies found") // if no movie turned up in the search results then will tell user that their search result had no movie
                    }
                }
                
               
             }).catch(function (error) {
                 console.error(error);
            });
            }
       
        }).catch(function (error) {
	        console.error(error);
        });
    
}


// Video game search

//Receives the search parameter and searches for the games by updating the get command url 
//API key is where key= value is. Need this otherwise the database won't acknowledge our request
async function getGameRequest(game_search) {
    // var axios = require("axios").default;
    try {
        const resp = await axios.get("https://api.rawg.io/api/games?key=a47d6d3774ad440880578ef20d42fdf0&search=" + game_search)
        

        //filters games based on if they have a metacritic score or not
        var search_length_games = Object.keys(resp.data.results).length
        console.log(search_length_games);
        let html = "";
        searchResults.innerHTML = "";
        for (let i = 0; i < search_length_games; i++) {
            if (resp.data.results[i].metacritic == null) {

            } else {

                console.log(resp.data.results[i])

                const li = `
                <li>
                    <div class="collapsible-header grey lighten-4">${resp.data.results[i].name}</div>
                    <div class="collapsible-body white">
                        ${resp.data.results[i].released}
                    </div>
                </li>
                `;
                searchResults.innerHTML +=  li;
            }
        }

    }
    catch (err) {
        console.log(err);
    }
}

//Anime search

//Receives the search parameter and searches for the games by updating the get command url 
//search parameter is updated in the parameters section of the options variable
// this parameter is updated based on the input from the user
function getAnimeRequest(anime_search) 
{   
    console.log("anime search triggered");
    
        //var axios = require("axios").default;

        var options = {
        method: 'GET',
        url: 'https://jikan1.p.rapidapi.com/search/anime',
        params: {q: anime_search},
        headers: {
            'x-rapidapi-host': 'jikan1.p.rapidapi.com',
            'x-rapidapi-key': '3786daeb32mshbc6d1e772e4bd57p1abb9ajsn82380529f73e'
        }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    
}

// book search

//Receives the search parameter and searches for the games by updating the get command url 
//This search function checks for the key words in the title as well as general keywords but it will order based on keyword relevance in title 
async function getBookRequest(book_search) {
    // var axios = require("axios").default;
    try {
        const resp = await axios.get("https://www.googleapis.com/books/v1/volumes?q="+book_search+"+intitle:"+book_search+"&key=AIzaSyDI3nIN4E-fMptBiG01xkTRHybXOcODjEk")
                console.log(resp.data.items)
                               
    }
    catch(err) {
        console.log(err);
    }
}

