document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.database();
  const chatRef = db.ref("messages");

  let username = localStorage.getItem("username");

  if (!username) {
    username = prompt("Welcome to Picklish Chat! Please enter your name to start:");
    if (!username || username.trim() === "") {
      alert("Name is required to start chatting.");
      location.reload(); // force restart if blank
      return;
    }
    username = username.trim();
    localStorage.setItem("username", username);
  }

  // Hide the username input if it exists
  const usernameInput = document.getElementById("username");
  if (usernameInput) {
    usernameInput.value = username;
    usernameInput.style.display = "none";
  }

  function sendMessage() {
    const message = document.getElementById("message").value.trim();
    if (!message) return;

    chatRef.push({
      name: username,
      message: message,
      timestamp: new Date().toISOString()
    });

    document.getElementById("message").value = "";
  }

  document.getElementById("sendBtn").addEventListener("click", sendMessage);

  chatRef.on("child_added", (snapshot) => {
    const msg = snapshot.val();
    const msgElement = document.createElement("p");
    msgElement.textContent = `${msg.name}: ${msg.message}`;
    const messagesDiv = document.getElementById("messages");
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
});
