const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// For DELETE
code = code.replace(
  `      const adminDoc = await adminDb.collection("users").doc(adminUid).get();
      if (!adminDoc.exists || adminDoc.data()?.role !== "Admin") {
        return res.status(403).json({ error: "Forbidden" });
      }`,
  `      const adminDoc = await adminDb.collection("users").doc(adminUid).get();
      const adminData = adminDoc.data();
      if (!adminDoc.exists || !(adminData?.roles || []).includes("Admin")) {
        return res.status(403).json({ error: "Forbidden" });
      }`
);

// For PATCH password
code = code.replace(
  `      const adminDoc = await adminDb.collection("users").doc(adminUid).get();
      if (!adminDoc.exists || adminDoc.data()?.role !== "Admin") {
        return res.status(403).json({ error: "Forbidden" });
      }`,
  `      const adminDoc = await adminDb.collection("users").doc(adminUid).get();
      const adminData = adminDoc.data();
      if (!adminDoc.exists || !(adminData?.roles || []).includes("Admin")) {
        return res.status(403).json({ error: "Forbidden" });
      }`
);

fs.writeFileSync('server.ts', code);
