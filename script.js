document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.database();
  const auth = firebase.auth();
  const chatRef = db.ref("messages");

  const signInButton = document.getElementById("google-signin-btn");
  const chatArea = document.getElementById("chat-area");
  const userInfo = document.getElementById("user-info");
  const welcomeMsg = document.getElementById("welcome-message");
  const ADMIN_EMAILS = ["kpthewarrior@gmail.com"];

  signInButton.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        initializeChat(user);
      })
      .catch(error => {
        console.error("Login failed:", error);
        alert("Login failed. Try again.");
      });
  });
  
  auth.onAuthStateChanged(user => {
    if (user) {
      initializeChat(user);
    }
  });

  function initializeChat(user) {
  // Show "Clear Chat" only if user is an admin
    if (ADMIN_EMAILS.includes(user.email)) {
      document.getElementById("clearChatBtn").style.display = "block";
      document.getElementById("clearChatBtn").addEventListener("click", () => {
        const confirmClear = confirm("⚠️ Are you sure you want to clear the entire chat history?");
    if (confirmClear) {
      chatRef.remove()
  .then(() => {
    document.getElementById("messages").innerHTML = ""; // Clear UI too
    alert("✅ Chat cleared");
  })
  .catch(err => alert("❌ Failed to clear chat: " + err));
    }
  });
}

    signInButton.style.display = "none";
    chatArea.style.display = "block";
    userInfo.style.display = "block";
    welcomeMsg.textContent = `👋 Welcome, ${user.displayName}`;

    document.getElementById("sendBtn").addEventListener("click", () => {
      const message = document.getElementById("message").value.trim();
      if (!message) return;

      chatRef.push({
        name: user.displayName,
        email: user.email,
        message: message,
        timestamp: new Date().toISOString()
      });

      document.getElementById("message").value = "";
    });

    chatRef.on("child_added", (snapshot) => {
      
      const isSender = msg.email === user.email;
      const msgElement = document.createElement("div");
      msgElement.classList.add("bubble", isSender ? "sent" : "received");
      msgElement.innerHTML = `<strong>${msg.name}</strong><br>${msg.message}`;
      messagesDiv.appendChild(msgElement);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
  }
});
const themeBtn = document.getElementById("themeToggle");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("chat-theme", theme);
});

// Persist theme on reload
const savedTheme = localStorage.getItem("chat-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}
