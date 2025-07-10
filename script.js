const db = firebase.database();
const chatRef = db.ref("messages");

function sendMessage() {
  const username = document.getElementById("username").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!username || !message) return;

  chatRef.push({
    name: username,
    message: message,
    timestamp: new Date().toISOString()
  });

  document.getElementById("message").value = "";
}

chatRef.on("child_added", (snapshot) => {
  const msg = snapshot.val();
  const msgElement = document.createElement("p");
  msgElement.textContent = `${msg.name}: ${msg.message}`;
  document.getElementById("messages").appendChild(msgElement);
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
});
