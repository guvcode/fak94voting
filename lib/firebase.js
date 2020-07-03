import firebase from "firebase/app";
import "firebase/firestore";

export function loadDB() {
  try {
    var config = {
      apiKey: "AIzaSyD0f2Z8HYbpXaZDliuxivGRDi9tphvtwTU",
      authDomain: "fak94-alumni.firebaseapp.com",
      databaseURL: "https://fak94-alumni.firebaseio.com",
      projectId: "fak94-alumni",
      storageBucket: "fak94-alumni.appspot.com",
      messagingSenderId: "841660946255",
      appId: "1:841660946255:web:8d4cf78b74a72b2254973a",
    };
    firebase.initializeApp(config);
  } catch (err) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    if (!/already exists/.test(err.message)) {
      console.error("Firebase initialization error", err.stack);
    }
  }

  return firebase;
}
