// listen for aut status changes
auth.onAuthStateChanged(user => {
    // if a user is signed in
    if(user){
        console.log('user logged in', user);
        setupUI(user);
        catalogList.style.display = "none";
        search.style.display = "block";
        screen.innerHTML = "View Catalog";
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


const addToCatalog = (itemIndex, itemRating) => {
    console.log(itemRating);
    //get item details from stored_search_results
    db.collection("userdata").doc(auth.currentUser.uid).collection(stored_search_results[itemIndex].category.toString()).doc(stored_search_results[itemIndex].name.toString()).set({
        category: stored_search_results[itemIndex].category.toString(), 
        dateAdded: new Date(),
        name: stored_search_results[itemIndex].name.toString(),
        rating: itemRating,
        uniqueApiId: stored_search_results[itemIndex].uniqueApiId.toString()
    }).then(() => {
        console.log("Document successfully written!");
        // updates the screen with users movie catalog
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });

}

//function to get catalog
const getCatalog = document.querySelector('#get-catalog');
getCatalog.addEventListener('click', (e) =>{
    toggleCatalogSearch();
    if(catalogList.style.display == "block"){
        initateCatalog(auth.currentUser.uid);
    }
    setUpSelect();
})

// iterate through all of the catergories to get the cataloged items
const initateCatalog = (uid) => {
    catalogList.innerHTML = "";
    var categories = ["movies", "anime", "video_games", "tv_shows", "books"];
    categories.forEach(category => {
        db.collection("userdata").doc(uid).collection(category).get().then((querySnapshot) => {
            setupCatalog(querySnapshot);
            if(category == "books") { setUpSelect();}     
        });
        
    });
}