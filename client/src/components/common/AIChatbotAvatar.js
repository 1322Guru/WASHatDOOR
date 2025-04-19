import React from 'react';
import { Box } from '@mui/material';

function AIChatbotAvatar({ size = 40 }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: 'rgba(46, 125, 50, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::after': {
          content: '"AI"',
          color: 'white',
          fontSize: `${size * 0.4}px`,
          fontWeight: 'bold',
        },
      }}
    />
  );
}

export default AIChatbotAvatar; 