/* ═══ Firebase partagé — Hub Elfort ═══ */
var firebaseConfig = {
  apiKey: "AIzaSyD9iHg4X5rFUy4Y0dlcmBKFvpGEGQm1q54",
  authDomain: "tableau-de-bord-3f985.firebaseapp.com",
  projectId: "tableau-de-bord-3f985",
  storageBucket: "tableau-de-bord-3f985.firebasestorage.app",
  messagingSenderId: "689959508783",
  appId: "1:689959508783:web:added91c52c78263a15fda"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
var fbAuth = firebase.auth();
var fbDb = firebase.firestore();

function fbEnsureAuth() {
  if (fbAuth.currentUser) return Promise.resolve(fbAuth.currentUser);
  return fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function(r) { return r.user; });
}

function saveToCloud(data, docName) {
  return fbEnsureAuth().then(function(user) {
    return fbDb.collection('users').doc(user.uid).collection('saves').doc(docName).set({
      json: JSON.stringify(data),
      date: new Date().toISOString(),
      app: docName
    });
  });
}

function loadFromCloud(docName) {
  return fbEnsureAuth().then(function(user) {
    return fbDb.collection('users').doc(user.uid).collection('saves').doc(docName).get().then(function(doc) {
      if (doc.exists) return JSON.parse(doc.data().json);
      throw new Error('Aucune sauvegarde trouvée en ligne');
    });
  });
}
