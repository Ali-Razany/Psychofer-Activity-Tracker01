const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

// Initialize admin if needed, wait, we don't have serviceAccountKey.json probably, because this is client side DB.
