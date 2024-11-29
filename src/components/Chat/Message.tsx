import React from 'react';
import { Message as MessageType } from '../../types';
import MessageReactions from './MessageReactions';
import { IoCheckmarkDone } from 'react-icons/io5';
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';
import { toggleMessagePin } from '../../firebase/config';

interface MessageProps {
  message: MessageType;
  isCurrentUser: boolean;
  showEmail: boolean;
  projectId: string;
  currentUser: any;
  formatTime: (timestamp: any) => string;
  onReply: () => void;
}

export default function Message({
  message,
  isCurrentUser,
  showEmail,
  projectId,
  currentUser,
  formatTime,
  onReply
}: MessageProps) {
  const handleTogglePin = async () => {
    await toggleMessagePin(projectId, message.id, !message.isPinned);
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[75%] rounded-lg p-3 shadow-sm relative group
          ${isCurrentUser 
            ? 'bg-[#DCF8C6] rounded-tr-none' 
            : 'bg-white rounded-tl-none'}
          ${message.isPinned ? 'border-2 border-primary' : ''}
        `}
      >
        {showEmail && (
          <div className={`text-xs mb-1 ${
            isCurrentUser ? 'text-emerald-700' : 'text-primary'
          }`}>
            {message.userEmail}
          </div>
        )}
        
        <div className="text-gray-800 break-words">
          {message.text}
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </div>
          
          <div className="flex items-center gap-1">
            {isCurrentUser && (
              <IoCheckmarkDone 
                className={message.readBy?.length > 1 
                  ? 'text-blue-500' 
                  : 'text-gray-400'
                } 
                size={16} 
              />
            )}
          </div>
        </div>

        <button
          onClick={handleTogglePin}
          className={`
            absolute -left-6 top-2 opacity-0 group-hover:opacity-100
            transition-opacity p-1 rounded-full hover:bg-gray-100
            ${message.isPinned ? 'opacity-100 text-primary' : ''}
          `}
        >
          {message.isPinned ? <BsPinAngleFill size={16} /> : <BsPinAngle size={16} />}
        </button>

        <button
          onClick={onReply}
          className="absolute -right-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4 text-gray-500 hover:text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        <MessageReactions
          projectId={projectId}
          messageId={message.id}
          reactions={message.reactions || []}
          currentUserId={currentUser?.uid}
          currentUserEmail={currentUser?.email}
        />
      </div>
    </div>
  );
} 