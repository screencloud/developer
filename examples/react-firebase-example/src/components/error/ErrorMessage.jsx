import React from 'react';

const errorStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  padding: '0 2rem',
  textAlign: 'center',
  fontFamily: 'sans-serif',
  fontSize: '1.5rem',
  color: '#3b454e',
};

const ErrorMessage = ({ message }) => {
  return (
    <div className={'error-message'} style={errorStyles}>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
