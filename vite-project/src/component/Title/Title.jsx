import './Title.css'
import React from 'react';

const Title = ({ title }) => {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '20vh',
      backgroundColor: '#fdf9fa', // background color
    },
    title: {
      fontSize: '3.5rem', 
      color: '#fc4e59',
      fontFamily: 'Poppins, sans-serif', // use Poppins font or fallback to sans-serif
      animation: 'fadeIn 1s ease-in-out', // fade-in animation
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{title}</h1>
    </div>
  );
};

export default Title;

