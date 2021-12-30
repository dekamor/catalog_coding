
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const setupUI = (user) => {
    if (user){
        // toggle UI elements 
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        // toggle UI elements 
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}


const catalogList = document.querySelector('.catalog');
//setup catalog
const setupCatalog = (querySnapshot) =>{
    if(querySnapshot) {
        let html = "";
        querySnapshot.forEach(doc => {
            const catalogItem = doc.data();
            console.log("TESTING:", catalogItem);
            var date = catalogItem.dateAdded.toDate();
            const li = `
                <li>
                    <div class="collapsible-header grey lighten-4">${catalogItem.name}</div>
                    <div class="collapsible-body white">
                        ${catalogItem.rating} 
                        ${catalogItem.category}
                        ${catalogItem.uniqueApiId}
                        ${date}
                    </div>
                </li>
            `;
            html += li;
        })
        catalogList.innerHTML = html;
    }
    else {
        catalogList.innerHTML = '<h5 class="centre-align"> Login to view Catalog </h5>';
        console.log("test");
    }

}

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  
});

// Get the input field
var searchBar = document.getElementById("search-bar");

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
var searchType = document.getElementById("search-type");

var searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", (e) =>{
    console.log("search triggered!");
    console.log(searchBar.value, searchType.value);
})

