'use client';

import dynamic from "next/dynamic";

const AiChatWidget = dynamic(() => import("./AiChatWidget"), { ssr: false });

export default function ChatWrapper() {
    return <AiChatWidget />;
}
