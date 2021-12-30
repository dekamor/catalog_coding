// listen for aut status changes
auth.onAuthStateChanged(user => {
    if(user){
        console.log('user logged in', user);
        db.collection('guides').get().then(snapshot =>{
            db.collection("userdata").doc(auth.currentUser.uid).collection("movies").get().then((querySnapshot) => {
                setupCatalog(querySnapshot);
            });
            setupUI(user);
        })  
    } 
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
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })

})

// function to add item to catalog (currently hard coded proof of concept)
const addItem = document.querySelector('#add-item');
addItem.addEventListener('click', (e) =>{
    console.log(auth.currentUser.uid);
    db.collection("userdata").doc(auth.currentUser.uid).collection("movies").doc("Resident Evil").set({
        category: "vg",
        dateAdded: new Date(),
        name: "Resident Evil",
        rating: 4,
        uniqueApiId: "test6789"
    }).then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
})


//function to get catalog
const getCatalog = document.querySelector('#get-catalog');
getCatalog.addEventListener('click', (e) =>{
    db.collection("userdata").doc(auth.currentUser.uid).collection("movies").get().then((querySnapshot) => {
        setupCatalog(querySnapshot);
    });
})
