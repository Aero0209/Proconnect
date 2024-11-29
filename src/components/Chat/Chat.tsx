import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { IoMdSend } from 'react-icons/io';
import { IoArrowBack } from 'react-icons/io5';
import SearchMessages from './SearchMessages';
import ReplyMessage from './ReplyMessage';
import { Message as MessageType, MessageReaction } from '../../types';
import Message from './Message';

interface Project {
  name: string;
  description?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const { projectId } = useParams<{ projectId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const [replyTo, setReplyTo] = useState<MessageType['replyTo'] | null>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement>>({});

  useEffect(() => {
    if (!projectId) return;

    // Charger les détails du projet
    const fetchProject = async () => {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        setProject(projectDoc.data() as Project);
      }
    };
    fetchProject();

    const q = query(
      collection(db, `projects/${projectId}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MessageType[];
      setMessages(messagesData);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [projectId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessageSelect = (messageId: string) => {
    const element = messageRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight');
      setTimeout(() => {
        element.classList.remove('highlight');
      }, 2000);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !projectId) return;

    try {
      await addDoc(collection(db, `projects/${projectId}/messages`), {
        text: newMessage,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        timestamp: serverTimestamp(),
        readBy: [currentUser.uid],
        reactions: [],
        replyTo
      });
      setNewMessage('');
      setReplyTo(null);
    } catch (error) {
      console.error("Erreur d'envoi du message:", error);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-primary px-4 py-3 flex items-center gap-4 text-white shadow-md">
        <button 
          onClick={() => navigate('/')}
          className="hover:bg-primary-dark p-2 rounded-full transition-colors"
        >
          <IoArrowBack size={20} />
        </button>
        <div>
          <h2 className="font-semibold">
            {project?.name || 'Conversation'}
          </h2>
          {project?.description && (
            <p className="text-sm opacity-90">
              {project.description}
            </p>
          )}
        </div>
        <div className="ml-auto">
          <SearchMessages
            messages={messages}
            onMessageSelect={handleMessageSelect}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#E5DDD5]">
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={el => {
              if (el) messageRefs.current[message.id] = el;
            }}
            className="message-container transition-all duration-300"
          >
            <Message
              message={message}
              isCurrentUser={message.userId === currentUser?.uid}
              showEmail={index === 0 || messages[index - 1].userId !== message.userId}
              projectId={projectId!}
              currentUser={currentUser}
              formatTime={formatTime}
              onReply={() => setReplyTo({
                id: message.id,
                text: message.text,
                userEmail: message.userEmail
              })}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {replyTo && (
        <ReplyMessage
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      )}

      {/* Input */}
      <form 
        onSubmit={sendMessage} 
        className="bg-white p-3 flex items-center gap-2 shadow-lg"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Votre message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`
            p-2 rounded-full transition-colors
            ${newMessage.trim() 
              ? 'bg-primary text-white hover:bg-primary-dark' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          <IoMdSend size={24} />
        </button>
      </form>
    </div>
  );
} 