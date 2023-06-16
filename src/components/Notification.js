import React from 'react';
const Notification = ({ message }) => {
  if (message === null) return null;

  return <h1 className='message'>{message}</h1>;
};

export default Notification;
