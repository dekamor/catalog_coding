// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  
});

document.addEventListener('loaded', function() {

    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  
});

const setUpSelect = () => {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
}


const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");

// function to set up base site UI (show correct buttons when applicable)
const setupUI = (user) => {
    if (user){
        // toggle UI elements 
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
        accountDetails.innerHTML = `<h5 class="centre-align"> ${user.email} </h5>`
    } else {
        // toggle UI elements 
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
        accountDetails.innerHTML = ``
    }
}


//setup catalog
//  Checkes firestore snapshot for information and if 
//  available populates screen with info. If not available
//  notifies user to log in
const catalogList = document.querySelector('.catalog');
const setupCatalog = (querySnapshot) =>{
    if(querySnapshot) {
        // create empty HTML item to append all new items to
        let html = "";
        querySnapshot.forEach(doc => {
            const catalogItem = doc.data();
            var date = catalogItem.dateAdded.toDate();
            var colour = "grey";
            switch(catalogItem.category){
                case "books":
                    colour = "blue";
                    break;
                case "video_games":
                    colour = "green";
                    break;
                case "movies":
                    colour = "red";
                    break;
            }
            const li = `
                <li>
                    <div class="collapsible-header ${colour} lighten-4">${catalogItem.name}</div>
                    <div class="collapsible-body white">
                        <div class="row">
                            <p> Your rating: ${catalogItem.rating} </p>
                            <p> Date Added: ${date.toLocaleDateString('en-US')} </p>
                        </div>
                    </div>
                </li>
            `;
            html += li;
        })
        catalogList.innerHTML += html;
        
           
    }
    else {
        catalogList.innerHTML = '';
    }
    
    
}

const dummyAdd = (id) => {
    console.log("Button Clicked: ", id);
    console.log("name of thing: ", stored_search_results[id].name)
    var rating  = "rating" + id;
    const currentRating = document.getElementById(rating);


    console.log("current rating ", currentRating.value);

    // functionality for actual implementation
    addToCatalog(id, currentRating.value);
}



// Search funcionality
var searchBar = document.getElementById("search-bar");
var searchType = document.getElementById("search-type");
var searchButton = document.getElementById("search-button");

// Execute a function when the user releases a key on the keyboard
searchBar.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search-button").click();
  }
});

searchButton.addEventListener("click", (e) =>{
    // replace console.log with call to search function
    console.log("search title: ", searchBar.value, " search type: ", searchType.value);
    api_search(searchType.value, searchBar.value);
})

const search = document.querySelector(".search");
const screen = document.getElementById("get-catalog");

const toggleCatalogSearch = () => {
    if (catalogList.style.display == "none") {
        catalogList.style.display = "block";
        search.style.display = "none";
        screen.innerHTML = "View Search";
    } else {
        catalogList.style.display = "none";
        search.style.display = "block";
        screen.innerHTML = "View Catalog";
    }
  }