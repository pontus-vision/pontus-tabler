import { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const Notification = ({ type, title, description, leaving }) => {
  const [entered, setEntered] = useState(false);
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaTimesCircle />;
      case 'info':
        return <FaInfoCircle />;
      default:
        return null;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setEntered(true);
    }, 1);
  }, []);

  useEffect(() => {
    if (leaving) {
      setEntered(false);
    }
  }, [leaving]);

  return (
    <div className={`notification ${type} ${entered ? 'enter' : 'leave'}`}>
      {getIcon(type)}
      <div className="notification-content">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Notification;
