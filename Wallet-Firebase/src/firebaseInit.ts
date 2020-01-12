import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
    apiKey: "AIzaSyDdlgWpHPzu1-9O8KQSex9tut2CndYHnT4",
    authDomain: "budget-keeper-8f45b.firebaseapp.com",
    projectId: "budget-keeper-8f45b"
};

firebase.initializeApp(config);
firebase.firestore().enablePersistence()
    .then(() => {
        console.log("Persistence initialized");
    })
    .catch((err) => {
        if (err.code === "failed-precondition") {
            console.log(err, "Multiple tabs open, persistence can only be enabled in one tab at a a time.");
        } else if (err.code === "unimplemented") {
            console.log(err, "The current browser does not support all of the features required to enable persistence");
        }
    });
