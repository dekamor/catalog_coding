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

//testing and adding extra comments


// const axios = require('axios').default;

const searchResults = document.querySelector('.search-results');

var stored_search_results = [];

define(function (require){
    var axios = require('axios').default;
});

function api_search(media_search, search_parameters){
    console.log("Stored search results is ",stored_search_results);
    stored_search_results = [];
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
       
       let html = "";
       searchResults.innerHTML = "";      
               
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
                search_Results.titles[i].year = filmDetails.data.year;
                search_Results.titles[i].lengthFilm = filmDetails.data.length;
                search_Results.titles[i].details = filmDetails.data.plot;
                
                var element = {
                    category: "movies",
                    dateAdded: new Date(), 
                    name: response.data.titles[i].title,
                    rating: 0, 
                    uniqueApiId: response.data.titles[i].id        
                }

                //stored_search_results[i].id = response.data.titles[i].id;
                //stored_search_results[i].name = response.data.titles[i].title;
                
                //stored_search_results[i].year = filmDetails.data.year;
                //stored_search_results[i].filmLength = filmDetails.data.length;
                //stored_search_results[i].details = filmDetails.data.plot;

              
                console.log(response.data.titles)
               // this segment checks if any plot detail exists, if it doesn't then it isn't a movie
               // if plot detail exists then it gets displayed as a results
                if (filmDetails.data.plot == '')
                {
                    // we don't want to do anything here we just want to pass the loop
                } else {
                    stored_search_results[i] = element;
                    const li = `
                    <li>
                        <div class="collapsible-header grey lighten-4">${response.data.titles[i].title}</div>
                        <div class="collapsible-body white">
                            <div class="row">
                                <div class="col s10" >
                                    Year released: ${filmDetails.data.year}<br>
                                    Length of Film: ${filmDetails.data.length}<br>
                                    Plot Details: ${filmDetails.data.plot}
                                </div>
                                <div class="col s2" >
                                    Enter your rating:
                                    <p class="range-field">
                                        <input type="range" value="1" min="1" max="10" oninput="this.nextElementSibling.value = this.value" id="rating${i}">
                                        <output>1</output>
                                    </p>
                                    <a class="waves-effect waves-light btn-small" id="${i}" onClick="dummyAdd(this.id)">add item</a>
                                </div> 
                            </div>
                        </div>
                    </li>
                    `;
                    searchResults.innerHTML +=  li;
                    console.log(search_Results.titles[i]) 
                    movie_print_check = movie_print_check+1;
                                       
                }
                if (i == search_length -1){

                    if (movie_print_check ==0){
                        const li = `
                        <li>
                            <div class="collapsible-header grey lighten-4">No movies founds sorry!</div>
                            
                        </li>
                        `;
                        searchResults.innerHTML +=  li;
                        console.log("Sorry no movies found") // if no movie turned up in the search results then will tell user that their search result had no movie
                    }
                }
                
               
             }).catch(function (error) {
                 console.log(error);
            });
            
            }
       
        }).catch(function (error) {
	        console.log(error);
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
        //console.log(search_length_games);
        let html = "";
        searchResults.innerHTML = "";
        for (let i = 0; i < search_length_games; i++) {

            var genre_length = Object.keys(resp.data.results[i].genres).length;
            
            var element = {
                category: "video_games",
                dateAdded: new Date(), 
                name: resp.data.results[i].name,
                rating: 0, 
                uniqueApiId: resp.data.results[i].id.toString()      
            }

            if (resp.data.results[i].metacritic == null) {

            } else {
                stored_search_results[i] = element;    
                //console.log(resp.data.results[i])
                var genre_string = 'Genre: ';
                var genre = [];
                var platforms_string = 'Platforms: ';
                var platforms = [];
                for (let j = 0; j < genre_length; j++) {
                    genre[j] = resp.data.results[i].genres[j].name;
                    platforms[j] = resp.data.results[i].parent_platforms[j].platform.name;
                    if (j == genre_length-1){
                        genre_string = genre_string + genre[j]
                        platforms_string = platforms_string + platforms[j]
                    } else {
                        genre_string = genre_string+ genre[j] + ', '
                        platforms_string = platforms_string + platforms[j] + ', '
                    }
                }
                //console.log("This is the genre string : ", genre_string)


                const li = `
                <li>
                    <div class="collapsible-header grey lighten-4">${resp.data.results[i].name}</div>
                    <div class="collapsible-body white">
                        <div class="row">
                            <div class="col s10">
                                <p> Year released: ${resp.data.results[i].released} </p>
                                <p> Metacritic Score: ${resp.data.results[i].metacritic} </p>
                                <p> ${genre_string} </p>
                                <p> ${platforms_string} </p>                               
                            </div>
                            <div class="col s2" >
                                Enter your rating:
                                <p class="range-field">
                                    <input type="range" value="1" min="1" max="10" oninput="this.nextElementSibling.value = this.value" id="rating${i}">
                                    <output>1</output>
                                </p>
                                <a class="waves-effect waves-light btn-small" id="${i}" onClick="dummyAdd(this.id)">add item</a>
                            </div>
                        </div>
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
            //console.log(response.data);
            var search_length_anime = Object.keys(response.data.results).length; 
            let html = "";
            searchResults.innerHTML = "";   
            for (let i = 0; i<search_length_anime;i++){

                var element = {
                    category: "anime",
                    dateAdded: new Date(), 
                    name: response.data.results[i].title,
                    rating: 0, 
                    uniqueApiId: response.data.results[i].mal_id     
                }

                stored_search_results[i] = element;
                const li = `
                <li>
                    <div class="collapsible-header grey lighten-4">${response.data.results[i].title}</div>
                    <div class="collapsible-body white">
                        <div class="row">
                            <div class="col s10" >
                                Type: ${response.data.results[i].type} <br>
                                Episodes: ${response.data.results[i].episodes} <br>
                                Start Date: ${response.data.results[i].start_date} <br>
                                End Date: ${response.data.results[i].end_date} <br>
                                Age Rating: ${response.data.results[i].rated} <br>
                                Synopsis: ${response.data.results[i].synopsis}
                            </div>
                            <div class="col s2" >
                                Enter your rating:
                                <p class="range-field">
                                    <input type="range" value="1" min="1" max="10" oninput="this.nextElementSibling.value = this.value" id="rating${i}">
                                    <output>1</output>
                                </p>
                                <a class="waves-effect waves-light btn-small" id="${i}" onClick="dummyAdd(this.id)">add item</a>
                            </div> 
                        </div>
                    </div>
                </li>
                `;
                searchResults.innerHTML +=  li;       

            }   



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
                //console.log(resp.data.items)
                var search_length_book = Object.keys(resp.data.items).length; 
                let html = "";
                searchResults.innerHTML = "";   
                for (let i = 0; i<search_length_book;i++){
    
                    var element = {
                        category: "books",
                        dateAdded: new Date(), 
                        name: resp.data.items[i].volumeInfo.title,
                        rating: 0, 
                        uniqueApiId: resp.data.items[i].id     
                    }

                    stored_search_results[i] = element;
                const li = `
                <li>
                    <div class="collapsible-header grey lighten-4">${resp.data.items[i].volumeInfo.title}</div>
                    <div class="collapsible-body white">
                        <div class="row">
                            <div class="col s10">
                                Author(s): ${resp.data.items[i].volumeInfo.authors} <br>
                                Publisher: ${resp.data.items[i].volumeInfo.publisher} <br>
                                Date Published: ${resp.data.items[i].volumeInfo.publishedDate} <br>
                                Description: ${resp.data.items[i].volumeInfo.description} <br>
                            </div>
                            <div class="col s2" >
                                Enter your rating:
                                <p class="range-field">
                                    <input type="range" value="1" min="1" max="10" oninput="this.nextElementSibling.value = this.value" id="rating${i}">
                                    <output>1</output>
                                </p>
                                <a class="waves-effect waves-light btn-small" id="${i}" onClick="dummyAdd(this.id)">add item</a>
                            </div>
                        </div> 
                    </div>
                </li>
                `;
                searchResults.innerHTML +=  li;   

                }

                               
    }
    catch(err) {
        console.log(err);
    }
}

