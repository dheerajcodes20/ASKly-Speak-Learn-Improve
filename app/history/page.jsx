"use client"
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@stackframe/stack";
import Link from "next/link";

export default function HistoryPage() {
  const user = useUser();
  const conversations = useQuery(
    api.DiscussionRoom.GetUserConversations,
    user?.id ? { userId: user.id } : undefined
  );

  if (!user?.id) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 ">
      <h2 className="text-2xl font-bold mb-6">Your Previous Conversations</h2>
      {(!conversations || conversations.length === 0) ? (
        <div className="text-gray-400">You don't have any previous conversations.</div>
      ) : (
        <ul className="space-y-3 ">
          {conversations.map(conv => (
            <li key={conv._id}>
              <Link href={`/discussion-room/${conv._id}`} className="text-blue-600 hover:underline text-lg">
                {conv.title || conv.topic || 'Conversation'}
                <span className="ml-2 text-xs text-gray-400">
                  {conv.createdAt ? new Date(conv.createdAt).toLocaleString() : ''}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
