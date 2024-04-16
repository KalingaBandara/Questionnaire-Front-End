import React, { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../api';
import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { green, yellow, red } from '@mui/material/colors';


export default function Result() {
  
  const [score, setScore] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.getScore, jwtToken)
    .fetch()
    .then(response => {
      if (response.status === 200) {
        setScore(response.data);
      } else {
        throw new Error('Failed to get score');
      }
    })
    .catch(error => {
      console.error('Error getting score:', error);
      setShowAlert(true);
    });
}, [setShowAlert]);



let scoreColor;
  if (score >= 7) {
    scoreColor = green[500];
  } else if (score >= 4 && score <= 6) {
    scoreColor = yellow[500];
  } else {
    scoreColor = red[500];
  }

  return (
    <div>
      <Card sx={{ mt: 5, display: 'flex', width: '100%', maxWidth: 640, mx: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent>
            <Typography variant="h4">
              Congratulations! 
            </Typography>

            <Typography variant="h6">
              YOUR SCORE
            </Typography>

            <Typography variant="h3" sx={{ fontWeight: 600 }}>
            <Typography variant="span" style={{ color: scoreColor }}>

                {score}
              </Typography>/10
            </Typography>

            
            <Typography variant="body2" color="text.secondary">
            You have completed the quiz.
            </Typography>

            <Button variant="contained" color="primary" sx={{
                                    mt: 2,  
                                    bgcolor: 'green',
                                    '&:hover': {
                                        bgcolor: '#1b5e20', // Darker green when hovered
                                    },
                                 }}>
              Continue
            </Button>

          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 220 }}
          image="./result.png"
        />
      </Card>
    </div>
  );
}