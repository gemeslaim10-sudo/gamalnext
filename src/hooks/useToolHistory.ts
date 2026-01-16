import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export const useToolHistory = () => {
    const { user } = useAuth();

    const addToHistory = async (toolId: string, toolName: string, description: string, fileUrl?: string, fileType?: string) => {
        if (!user) return; // Only save for logged-in users

        try {
            await addDoc(collection(db, 'user_history'), {
                userId: user.uid,
                toolId,
                toolName,
                description,
                fileUrl: fileUrl || null,
                fileType: fileType || 'action',
                createdAt: serverTimestamp()
            });
            // Optional: toast.success('Saved to history');
        } catch (error) {
            console.error("Error saving history:", error);
            // Silent fail is better than annoying user for non-critical feature
        }
    };

    return { addToHistory };
};
