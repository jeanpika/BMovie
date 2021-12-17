
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import { getFirestore, addDoc, getDocs, collection, serverTimestamp, deleteDoc, updateDoc, onSnapshot, doc, where, setDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyBKYDMVmEMMS5QryjWfvInlEqcUfVTRafA",
   authDomain: "final-project-22e47.firebaseapp.com",
   projectId: "final-project-22e47",
   storageBucket: "final-project-22e47.appspot.com",
   messagingSenderId: "877760383926",
   appId: "1:877760383926:web:304cc3d5713a96e5c5cf17",
   measurementId: "G-LHWJDGXXPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
window.auth = getAuth();
const db = getFirestore(app);
//////////////////////////////////////////////////////
//expose functionality for auth

// Create revie collection for the user
// const reviewCol = collection(db, "reviews");

window.islogin = function () {
   return auth.currentUser !== null;
}

window.login = function (email, password) {
   return signInWithEmailAndPassword(auth, email, password);
}

window.signup = function (email, password) {
   return createUserWithEmailAndPassword(auth, email, password);
}

window.logout = function () {
   auth.signOut();
}

window.onLogin = function (f) {
   onAuthStateChanged(auth, user => {
      f(user);
   });
}
//////////////////////////////////////////////////
// expose functionality for database

window.addComment = function (comment) {
   return addDoc(collection(db, "comments"),
      { comment, TimeStamp: serverTimestamp(), email: auth.currentUser.email });
}

window.forEachComment = async function( f ){
   var docs = await getDocs( collection(db, "comments") );
   // console.log(docs);
   docs.forEach( doc =>f(doc.data(), doc.id));
}

window.deleteComment = function (id) {

   deleteDoc(doc(db, "comments", id));
}

window.updateComment = function (id, comment) {
   
   updateDoc(doc(db, "comments", id), {
      comment
   });
}