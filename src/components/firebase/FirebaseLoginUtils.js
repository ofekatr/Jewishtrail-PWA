import * as firebase from 'firebase'
import { myFirebase, myDatabase } from './firebase'

export async function signInWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  await firebase.auth().signInWithPopup(provider)
  // add createNewAccout
  var user = myFirebase.auth().currentUser;
  if(await isUserExists(user.uid)){
    return user.uid
  }
  var displayName = user.displayName;
  await CreateNewAccount(user.uid, displayName);
  return user.uid
}

async function isUserExists(uid){
  const user = await myDatabase.collection('accounts').doc(uid).get()
  if(user.exists){
    return true;
  }
  return false;
}

export function login(e, email, password) {
    e.preventDefault();
    myFirebase.auth().signInWithEmailAndPassword(email, password).then((u)=>{
      console.log("logged in" + myFirebase.auth().currentUser)
    }).catch((error) => {
        console.log(error);
      });
}

export async function signup(e, email, password, user_name){
  e.preventDefault();
  myFirebase.auth().createUserWithEmailAndPassword(email, password).then((u)=>{
    CreateNewAccount(u.user.uid, user_name)
  }).then((u)=>{console.log(u)})
  .catch((error) => {
      console.log(error);
  })
}

async function CreateNewAccount(uid, UserName){
  console.log(uid)
  await myDatabase.collection("accounts").doc(uid).set({
      user_name: UserName,
      favorites: []
  })
}