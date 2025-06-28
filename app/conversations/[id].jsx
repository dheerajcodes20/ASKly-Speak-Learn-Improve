import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ChatBox from '../(main)/discussion-room/[roomid]/_components/ChatBox';
import React from 'react';

export default function ConversationDetail() {
  const params = useParams();
  const id = params?.id;
  const conversationData = useQuery(api.DiscussionRoom.GetDiscussionRoom, id ? { id } : undefined);

  if (!conversationData) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{conversationData.title || 'Conversation'}</h2>
      <ChatBox conversation={conversationData.conversation || []} aiName={conversationData.expertName} userName="You" />
    </div>
  );
}
