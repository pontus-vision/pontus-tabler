import React, { useState, useEffect } from 'react';

export type AlertProps = {
  type: 'success' | 'error' | 'info' | undefined;
  message: string | undefined;
};

const Alert = ({ type, message }: AlertProps) => {
  const [visible, setVisible] = useState(false);
  const [messageDisplay, setMessageDisplay] = useState<string>();

  useEffect(() => {
    if (message) {
      setMessageDisplay(message);
    }
    if (message && type) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message, type]);

  const alertStyle = {
    success: { backgroundColor: '#4CAF50', color: 'white' },
    error: { backgroundColor: '#f44336', color: 'white' },
    info: { backgroundColor: '#2196F3', color: 'white' },
  }[type || 'error'];

  useEffect(() => {
    console.log({ visible });
  }, [visible]);

  return (
    <div
      className={`alert ${visible ? 'alert-enter' : 'alert-leave'}`}
      style={alertStyle}
    >
      {messageDisplay}
    </div>
  );
};

export default Alert;
