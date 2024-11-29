import React, { useState } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';
import { Message } from '../../types';

interface SearchMessagesProps {
  messages: Message[];
  onMessageSelect: (messageId: string) => void;
}

export default function SearchMessages({ messages, onMessageSelect }: SearchMessagesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMessages = messages.filter(message =>
    message.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <IoSearch size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans les messages..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <IoClose size={20} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {searchTerm && filteredMessages.map(message => (
              <button
                key={message.id}
                onClick={() => {
                  onMessageSelect(message.id);
                  setIsOpen(false);
                }}
                className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors mb-2"
              >
                <div className="text-sm font-medium text-gray-600">
                  {message.userEmail}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {message.text}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(message.timestamp?.toDate()).toLocaleString()}
                </div>
              </button>
            ))}

            {searchTerm && filteredMessages.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                Aucun message trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 