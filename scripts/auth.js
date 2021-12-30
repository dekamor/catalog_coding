// listen for aut status changes
auth.onAuthStateChanged(user => {
    // if a user is signed in
    if(user){
        console.log('user logged in', user);
        //initateCatalog(auth.currentUser.uid);
        setupUI(user);
    } 
    // if a user is signed out
    else {
        console.log('user logged out');
        setupUI();
        setupCatalog();
    }
})

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    // sign up the user
    // add exception handling for
    //      already used email
    //      invalid input for email or pw
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred.user);
        // create document for newly added user
        db.collection("userdata").doc(cred.user.uid).set({});
        modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    })
})

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) =>{
    e.preventDefault();
    auth.signOut().then(() => {
        // post sth to user about sign out
    })
})

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // close login modal and clear form
        // add exception handling for incorrect input
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})

// function to add item to catalog (currently hard coded proof of concept) using add item button at top of page
const addItem = document.querySelector('#add-item');
addItem.addEventListener('click', (e) =>{
    //console.log(auth.currentUser.uid);
    // Writes to the collection for the specified item collection should come from category and doc from name
    db.collection("userdata").doc(auth.currentUser.uid).collection("movies").doc("The Dark Knight Rises").set({
        category: "movie",
        dateAdded: new Date(),
        name: "The Dark Knight Rises",
        rating: 5,
        uniqueApiId: "test101112"
    }).then(() => {
        console.log("Document successfully written!");
        // updates the screen with users movie catalog
        // should be expanded to show all four catalogs as appropriate
        db.collection("userdata").doc(auth.currentUser.uid).collection("movies").get().then((querySnapshot) => {
            setupCatalog(querySnapshot);
        });
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
})


//function to get catalog
const getCatalog = document.querySelector('#get-catalog');
getCatalog.addEventListener('click', (e) =>{
    toggleCatalogSearch();
    console.log(catalogList.style.display);
    if(catalogList.style.display == "block"){
        initateCatalog(auth.currentUser.uid);
    }
})

// iterate through all of the catergories to get the cataloged items
const initateCatalog = (uid) => {
    catalogList.innerHTML = "";
    var categories = ["movies", "anime", "video_games", "tv_shows", "books"];
    categories.forEach(category => {
        db.collection("userdata").doc(uid).collection(category).get().then((querySnapshot) => {
            setupCatalog(querySnapshot);
        });
    });
}