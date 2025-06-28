"use client"
import React from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@stackframe/stack'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function History() {
  const user = useUser();
  const router = useRouter();
  const conversations = useQuery(
    api.DiscussionRoom.GetUserConversations,
    user?.id ? { userId: user.id } : undefined
  );
  const deleteConversation = useMutation(api.DiscussionRoom.DeleteConversation);
  const deleteAllConversations = useMutation(api.DiscussionRoom.DeleteAllConversations);

  if (!user?.id) {
    // User not loaded yet
    return <div>Loading...</div>;
  }

  const handleDelete = async (id) => {
    await deleteConversation({ id });
    router.refresh();
  };

  const handleDeleteAll = async () => {
    await deleteAllConversations({ userId: user.id });
    router.refresh();
  };

  return (
    <div className="flex justify-center w-full px-2">
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-xl w-full border border-gray-100">
        <div className="font-bold text-xl text-gray-800 mb-4 text-center tracking-tight">
          Your Previous Conversations
        </div>
        {(!conversations || conversations.length === 0) ? (
          <h2 className='text-gray-400 text-center'>You don't have any previous conversations</h2>
        ) : (
          <>
          <ul className='mt-4 space-y-3'>
            {conversations.map(conv => (
              <li key={conv._id} className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className='font-semibold text-gray-900'>{conv.title || conv.topic || 'Conversation'}</span>
                  <span className='ml-2 text-xs text-gray-400'>
                    {conv.createdAt ? new Date(conv.createdAt).toLocaleString() : ''}
                  </span>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    className="px-3 py-1 bg-blue-400 text-white rounded-lg hover:bg-blue-600 text-xs font-medium shadow"
                    onClick={() => router.push(`/discussion-room/${conv._id}`)}
                  >
                    Open
                  </button>
                  <button
                    className="px-3 py-1 bg-red-400 text-white rounded-lg hover:bg-red-600 text-xs font-medium shadow"
                    onClick={() => handleDelete(conv._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-8">
            <button
              className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-700 text-sm font-semibold shadow transition w-full sm:w-auto"
              onClick={handleDeleteAll}
            >
              Delete All
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  )
}

export default History
