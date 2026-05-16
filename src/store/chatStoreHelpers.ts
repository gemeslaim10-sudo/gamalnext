import { doc, getDoc, collection, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';
import type { Message } from '@/components/chat/types';

export async function fetchUserContextData(user: User | null | undefined) {
    let userName = "Guest";
    let userGender = "Unknown";
    let userPhone = "";
    let userEmail = "";
    
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            userName = userData.name || user.displayName || "User";
            userGender = userData.gender || "Unknown";
            userPhone = userData.phone || "";
            userEmail = userData.email || user.email || "";
        } else {
            userName = user.displayName || "User";
            userEmail = user.email || "";
        }
    }

    return { name: userName, gender: userGender, uid: user?.uid, phone: userPhone, email: userEmail };
}

export async function fetchChatMessages(sid: string): Promise<Message[]> {
    const msgsRef = collection(db, "chat_sessions", sid, "messages");
    const q = query(msgsRef, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    
    const loadedMessages: Message[] = [];
    snapshot.forEach(d => {
        const data = d.data();
        if (data.text && data.role) {
            loadedMessages.push({ role: data.role as 'user'|'model', text: data.text });
        }
    });
    return loadedMessages;
}

export function buildWelcomeMessage(userName: string): string {
    let welcomeText = "أهلاً بك في منصة جمال 👋 سعيد جداً بوجودك هنا!\nأنا المساعد الذكي الخاص بجمال، ومهمتي هي مساعدتك في التعرف على خدماتنا المتميزة: بناء المواقع، المتاجر الإلكترونية (Next.js & Shopify)، وبرمجة أنظمة الواتساب الذكية. 🚀\n\nبإيه أقدر أساعدك النهاردة؟ 😊";

    if (userName !== "Guest") {
        welcomeText = welcomeText.replace(/ممكن أتشرف باسمك.*؟/g, '');
        welcomeText = welcomeText.replace(/ممكن أعرف اسم حضرتك.*؟/g, '');
        welcomeText = welcomeText.replace(/ممكن أعرف اسمك.*؟/g, '');
        
        if (welcomeText.includes("{name}")) {
            welcomeText = welcomeText.replace(/{name}/g, userName);
        } else {
            welcomeText = `أهلاً يا ${userName} 👋،\n${welcomeText}`;
        }
    } else {
        welcomeText = welcomeText.replace(/{name}/g, "");
        if (!welcomeText.includes("اسم")) {
            welcomeText += "\n\nممكن أعرف اسم حضرتك عشان أقدر أساعدك بشكل أفضل؟ 😊";
        }
    }
    
    return welcomeText.trim();
}

export async function deleteChatMessages(sid: string) {
    const msgsRef = collection(db, "chat_sessions", sid, "messages");
    const snapshot = await getDocs(msgsRef);
    const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
}
