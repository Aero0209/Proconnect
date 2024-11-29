import React, { useState } from 'react';
import { MessageReaction } from '../../types';
import { addReactionToMessage, removeReactionFromMessage } from '../../firebase/config';

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface MessageReactionsProps {
  projectId: string;
  messageId: string;
  reactions: MessageReaction[];
  currentUserId: string;
  currentUserEmail: string;
}

export default function MessageReactions({
  projectId,
  messageId,
  reactions,
  currentUserId,
  currentUserEmail
}: MessageReactionsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleReaction = async (emoji: string) => {
    const existingReaction = reactions.find(
      r => r.userId === currentUserId && r.emoji === emoji
    );

    if (existingReaction) {
      await removeReactionFromMessage(projectId, messageId, existingReaction);
    } else {
      await addReactionToMessage(
        projectId,
        messageId,
        emoji,
        currentUserId,
        currentUserEmail
      );
    }
    setShowEmojiPicker(false);
  };

  const groupedReactions = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || []).concat(reaction);
    return acc;
  }, {} as Record<string, MessageReaction[]>);

  return (
    <div className="relative">
      <div className="flex gap-1 mt-1">
        {Object.entries(groupedReactions).map(([emoji, reactions]) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className={`
              px-2 py-1 rounded-full text-xs
              ${reactions.some(r => r.userId === currentUserId)
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-100 hover:bg-gray-200'}
            `}
            title={reactions.map(r => r.userEmail).join('\n')}
          >
            {emoji} {reactions.length}
          </button>
        ))}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="px-2 py-1 rounded-full text-xs bg-gray-100 hover:bg-gray-200"
        >
          +
        </button>
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 bg-white rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1">
          {EMOJI_LIST.map(emoji => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 