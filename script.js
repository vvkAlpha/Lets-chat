const ADMIN_EMAILS = ["kpthewarrior@gmail.com"]; // Replace with real admin email(s) separated by commas
document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.database();
  const auth = firebase.auth();
  const chatRef = db.ref("messages");

  const signInButton = document.getElementById("google-signin-btn");
  const chatArea = document.getElementById("chat-area");
  const userInfo = document.getElementById("user-info");
  const welcomeMsg = document.getElementById("welcome-message");

  const themeBtn = document.getElementById("themeToggle");
  const clearChatBtn = document.getElementById("clearChatBtn");
  const sendBtn = document.getElementById("sendBtn");
  const messageInput = document.getElementById("message");

  signInButton.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(result => initializeChat(result.user))
      .catch(error => alert("Login failed. Try again."));
  });

  auth.onAuthStateChanged(user => {
    if (user) initializeChat(user);
  });

  function initializeChat(user) {
    signInButton.style.display = "none";
    chatArea.style.display = "block";
    userInfo.style.display = "block";
    welcomeMsg.textContent = `👋 Welcome, ${user.displayName}`;

    if (ADMIN_EMAILS.includes(user.email)) {
      clearChatBtn.style.display = "block";
      clearChatBtn.addEventListener("click", () => {
        const confirmClear = confirm("⚠️ Are you sure you want to clear the chat?");
        if (confirmClear) {
          chatRef.remove().then(() => {
            document.getElementById("messages").innerHTML = "";
            alert("✅ Chat cleared");
          });
        }
      });
    }

    sendBtn.addEventListener("click", () => sendMessage(user));
    messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(user);
      }
    });

    chatRef.on("child_added", (snapshot) => {
      const msg = snapshot.val();
      const isSender = msg.email === user.email;
      const msgElement = document.createElement("div");
      msgElement.classList.add("bubble", isSender ? "sent" : "received");
      msgElement.innerHTML = `<strong>${msg.name}</strong><br>${msg.message}`;
      const messagesDiv = document.getElementById("messages");
      messagesDiv.appendChild(msgElement);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    const savedTheme = localStorage.getItem("chat-theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    }

    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const theme = document.body.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("chat-theme", theme);
    });
  }

  function sendMessage(user) {
    const message = messageInput.value.trim();
    if (!message) return;

    chatRef.push({
      name: user.displayName,
      email: user.email,
      message: message,
      timestamp: new Date().toISOString()
    });

    messageInput.value = "";
  }
});
