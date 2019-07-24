
import firebase from '../plugins/firebase';

export default function ({ redirect, req, store }) {

  if (process.server) {
    // SERVER SIDE AUTH LOGIC (when user reload page) for protecting Route.
    if (!req.signedCookies.authToken) {
      redirect('/');
      return;
    } 
    console.log("Current Authenticated UserID:", req.signedCookies.authToken.uid)
    store.commit('setUser', req.signedCookies.authToken.uid);
  } else {
    // CLIENT SIDE AUTH LOGIC

    // [Pattern 1] Not Reflesh Token. (but faster way)
    // const user = firebase.auth().currentUser;
    // if (!user ) {
    //   redirect('/');
    //   return;
    // };
    // console.log("Current Authenticated UserID:", user.uid);
    

    // [Pattern 2] Auto Reflesh Token. (but slower way) 
    // everytime user move to another protected page, Reflesh idToken and cookie. (1 hour from that time) 
    const user = firebase.auth().currentUser;
    if (user) {
      return user.getIdToken(true) 
      .then( async idToken => {
        console.log("Current Authenticated UserID", user.uid);
        await store.dispatch('login', user.uid) // TODO: Errorhandling
      })
      .catch( async err => {
        console.log("Reflesh Error", err);
        await store.dispatch('logout'); // TODO: Errorhandling
        redirect('/');
      });
    } else {
      redirect('/');
    }
  }
};
