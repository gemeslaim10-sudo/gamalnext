import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    projectId: "gamal-selim",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkLeads() {
    console.log("Checking leads collection...");
    try {
        const snap = await getDocs(collection(db, "leads"));
        console.log(`Found ${snap.size} leads.`);
        snap.forEach(doc => {
            console.log(doc.id, doc.data());
        });
    } catch (e) {
        console.error("Error:", e);
    }
}
checkLeads();
