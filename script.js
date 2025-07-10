document.addEventListener("DOMContentLoaded", () => {
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
