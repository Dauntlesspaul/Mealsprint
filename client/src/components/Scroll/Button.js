import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      sx={{
        position: 'fixed',
        bottom: 16,
        zIndex: 888,
        minWidth: 0,
        right: 10,
        display: showButton ? 'flex' : 'none',
        backgroundColor: 'white',
        color: 'white',
        width:' 43px',
        height: '32px',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
          backgroundColor: 'white',
        },
      }}
    >
        <KeyboardArrowUpRoundedIcon sx={{color: 'orange', fontSize: '30px'}}/>
    </Button>
  );
}

export default ScrollToTop;
