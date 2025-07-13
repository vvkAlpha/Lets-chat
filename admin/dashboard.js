document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.database();
  const pendingRef = db.ref("pendingUsers");
  const approvedRef = db.ref("approvedUsers");
  const auditRef = db.ref("audit/logs");
  const uid = firebase.auth().currentUser.uid;

  pendingRef.on("child_added", snap => {
    const { name, email } = snap.val();
    const li = document.createElement("li");
    li.textContent = `${name} (${email}) `;
    const approve = document.createElement("button");
    approve.textContent = "Approve";
    approve.onclick = () => {
      approvedRef.child(snap.key).set(true);
      auditRef.push({
        action: "approve_user",
        by: uid,
        target: snap.key,
        timestamp: new Date().toISOString()
      });
      pendingRef.child(snap.key).remove();
      li.remove();
    };
    const reject = document.createElement("button");
    reject.textContent = "Reject";
    reject.onclick = () => { pendingRef.child(snap.key).remove(); li.remove(); };
    li.append(approve, reject);
    document.getElementById("pending-users").appendChild(li);
  });

  auditRef.limitToLast(100).on("child_added", snap => {
    const { action, by, target, timestamp } = snap.val();
    const li = document.createElement("li");
    li.textContent = `[${new Date(timestamp).toLocaleString()}] ${action} by ${by}${target ? " → " + target : ""}`;
    document.getElementById("audit-logs").prepend(li);
  });
});
