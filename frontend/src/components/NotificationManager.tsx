import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Notification from './Notification';

interface Message {
  id: number;
  type: 'success' | 'error' | 'info'
  title: string;
  description: string;
  leaving: boolean;
}

export interface MessageRefs {
  [key: number]: HTMLDivElement | null;
  addMessage: (type: 'success' | 'error' | 'info', title: string, description: string) => void;
}

const NotificationManager = forwardRef((props, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useImperativeHandle(ref, () => ({
    addMessage: (type: 'success' | 'error' | 'info', title: string, description: string) => {
      const id: number = Date.now();
      setMessages([
        ...messages,
        { id, type, title, description, leaving: false },
      ]);

      setTimeout(() => {
        removeMessage(id);
      }, 5000);
    },
  }));

  const removeMessage = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id ? { ...message, leaving: true } : message,
      ),
    );

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== id),
      );
    }, 500);
  };

  return (
    <div className="notification-manager">
      {messages.map((message) => (
        <Notification
          leaving={message.leaving}
          key={message.id}
          type={message.type}
          title={message.title}
          description={message.description}
        />
      ))}
    </div>
  );
});

export default NotificationManager;
