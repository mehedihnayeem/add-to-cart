import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import { getDatabase, onValue, push as pushRef, ref, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://add-to-cart-95318-default-rtdb.asia-southeast1.firebasedatabase.app/",
    apiKey: "AIzaSyBztv4u7BKg8tReyNaZu5EgPZnPVQlEK98",
    authDomain: "add-to-cart-95318.firebaseapp.com",
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const viewLoggedIn = document.getElementById("view-logged-in")
const viewLoggedOut = document.getElementById("view-logged-out")
const continueWithGooglePopUpEL = document.getElementById("google-btn")
const logOutBtn = document.getElementById("log-out-btn")

addButtonEl.addEventListener("click", function() {
    const inputValue = inputFieldEl.value
    const userShoppingListInDB = ref(database, `users/${auth.currentUser.uid}/shoppingList`)

    pushRef(userShoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

continueWithGooglePopUpEL.addEventListener("click", ()=>{
    signInWithPopup(auth, provider)
        .then((result)=>{
            console.log("Sign in With Google", result)
        })
        .then((error)=>{
            console.log(error.code)
        })
})

logOutBtn.addEventListener("click", ()=>{
    signOut(auth)
})



onAuthStateChanged(auth, function(user){
    if(user){
        viewLoggedIn.style.display = "block"
        viewLoggedOut.style.display = "none"
        fetchFromDB()
    }else{
        viewLoggedIn.style.display = "none"
        viewLoggedOut.style.display = "block"
    }
})


const fetchFromDB = () => {
    const userShoppingListInDB = ref(database, `users/${auth.currentUser.uid}/shoppingList`)

    onValue(userShoppingListInDB, function(snapshot) {
    
        if(snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())
        
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }
        } else{
            shoppingListEl.textContent = 'No items here... yet'
        }
    })
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemId = item[0]
    let itemValue = item[1]

    let newEL = document.createElement("li")

    newEL.textContent = itemValue

    shoppingListEl.append(newEL)

    newEL.addEventListener("click", ()=>{
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`)

        remove(exactLocationOfItemInDB)
    })
}