import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js"
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js"
import { iti } from "./country_codes.js"

const firebaseConfig = {
    apiKey: "AIzaSyD4zvn2Hs0MUd2TLc24t1U1FAmwYHAt60o",
    authDomain: "portfolio-contacts-me.firebaseapp.com",
    databaseURL: "https://portfolio-contacts-me-default-rtdb.firebaseio.com",
    projectId: "portfolio-contacts-me",
    storageBucket: "portfolio-contacts-me.appspot.com",
    messagingSenderId: "588925392948",
    appId: "1:588925392948:web:44ae4db2cdab5b49f69261",
    measurementId: "G-4K1YSVTK0M"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export let sendValues = function (e) {
    let fullName = document.getElementById("firstName").value + " " + document.getElementById("lastName").value
    let currentDate = new Date()

    set(ref(db, '/data ' + fullName),{
        time: currentDate.toLocaleString(),
        email : document.getElementById("email").value,
        phone : iti.getNumber(),
        message : document.getElementById("textarea").value
    });

    alert("Your personal information has been received")
};