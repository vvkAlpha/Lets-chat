// 🔥 Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDg_ROsrfNwN8gjOq0Vw3ANrrFJwjRaYxE",
    authDomain: "picklish-chat-test.firebaseapp.com",
    databaseURL: "https://picklish-chat-test-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "picklish-chat-test",
    storageBucket: "picklish-chat-test.firebasestorage.app",
    messagingSenderId: "933865604199",
    appId: "1:933865604199:web:e304363a81ff01116bc0c2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let nickname = "";
let currentRoom = "general";

function joinChat() {
  nickname = document.getElementById("nicknameInput").value.trim();
  if (!nickname) return alert("Please enter a nickname!");

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("chat-screen").style.display = "block";

  listenToRoom(currentRoom);
}

function sendMessage() {
  const rawRoom = document.getElementById("roomInput").value.trim();
  const text = document.getElementById("msgInput").value.trim();
  if (!text) return;

  let room = currentRoom;
  if (rawRoom.startsWith("/w ")) {
    const toUser = rawRoom.slice(3).trim();
    room = [nickname, toUser].sort().join("_private_");
    document.getElementById("roomHeader").textContent = `Private Chat with ${toUser}`;
    currentRoom = room;
    listenToRoom(room);
  } else if (rawRoom && rawRoom !== currentRoom) {
    room = rawRoom;
    document.getElementById("roomHeader").textContent = `Chat Room: ${room}`;
    currentRoom = room;
    listenToRoom(room);
  }

  db.ref("messages/" + room).push({
    from: nickname,
    text: text,
    time: Date.now()
  });

  document.getElementById("msgInput").value = "";
}

function listenToRoom(room) {
  document.getElementById("messages").innerHTML = "";

  db.ref("messages/" + room).off(); // stop previous
  db.ref("messages/" + room).on("child_added", snap => {
    const msg = snap.val();
    const div = document.createElement("div");
    const time = new Date(msg.time).toLocaleTimeString();
    div.textContent = `[${time}] ${msg.from}: ${msg.text}`;
    document.getElementById("messages").appendChild(div);
    document.getElementById("messages").scrollTop = 9999;
  });
}
