import React from 'react';
import { IoClose } from 'react-icons/io5';

interface ReplyMessageProps {
  replyTo: {
    id: string;
    text: string;
    userEmail: string;
  };
  onCancelReply: () => void;
}

export default function ReplyMessage({ replyTo, onCancelReply }: ReplyMessageProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-t border-gray-200">
      <div className="flex-1">
        <div className="text-xs text-primary font-medium">
          Réponse à {replyTo.userEmail}
        </div>
        <div className="text-sm text-gray-600 truncate">
          {replyTo.text}
        </div>
      </div>
      <button
        onClick={onCancelReply}
        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
      >
        <IoClose size={16} />
      </button>
    </div>
  );
} 