firebase.auth().onAuthStateChanged(async user => {
  if (!user) return window.location.href = "/";
  const snap = await firebase.database().ref(`roles/admins/${user.uid}`).once("value");
  if (!snap.exists()) {
    alert("Access denied: admins only");
    return window.location.href = "/";
  }
});
