const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin with credentials from environment variable
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
    });
}

const db = admin.firestore();

async function dumpDB() {
    const collections = ['site_content', 'projects', 'skills', 'tools'];
    const dump = {};

    for (const col of collections) {
        const snapshot = await db.collection(col).get();
        dump[col] = {};
        snapshot.forEach(doc => {
            dump[col][doc.id] = doc.data();
        });
    }

    fs.writeFileSync('db_dump.json', JSON.stringify(dump, null, 2));
    console.log('Database dumped to db_dump.json');
}

dumpDB().catch(console.error);
