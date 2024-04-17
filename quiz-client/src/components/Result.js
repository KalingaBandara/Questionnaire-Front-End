import React, { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../api';
import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { green, yellow, red } from '@mui/material/colors';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function Result() {

  // State to store the score from the API response
  const [score, setScore] = useState(0);

  // State to control whether to show an alert in case of error
  const [showAlert, setShowAlert] = useState(false);
  
  // Get JWT token from local storag
  const jwtToken = localStorage.getItem('jwtToken');

  // Fetches the score from the API endpoint
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


// Determine the color of the score based on its value
let scoreColor;
  if (score >= 7) {
    scoreColor = green[500];
  } else if (score >= 4 && score <= 6) {
    scoreColor = yellow[500];
  } else {
    scoreColor = red[500];
  }

  // Calculate the number of lawn mowers as the reward
  const lawnMowers = Math.floor(score / 2);

  return (
    <div>
      <Card sx={{ mt: 5, display: 'flex', width: '100%', maxWidth: 640, mx: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h3">
                Congratulations
            </Typography>
            <AutoAwesomeIcon sx={{ ml: 1, fontSize: 'h3.fontSize' }} />
          </Box>

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

            

          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 220 }}
          image="./result.png"
        />
      </Card>

      <Card sx={{ mt: 3, display: 'flex', width: '100%', maxWidth: 640, mx: 'auto' }}>
                <CardMedia
                    component="img"
                    sx={{ width: 150 }}
                    image="./LawnMower.webp"
                    alt="Lawn Mower"
                />
                <CardContent>
                <Typography variant="h5">
                    You are rewarded with
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    <Typography variant="span" style={{ color: scoreColor }}>
                        {lawnMowers}
                    </Typography>{" "}
                    Lawn Mowers
                </Typography>

                <Button variant="contained" color="primary" sx={{
                                    mt: 2,  
                                    bgcolor: 'green',
                                    '&:hover': {
                                        bgcolor: '#1b5e20', 
                                    },
                                 }}
                                 //onClick={() => window.location.href = 'http://localhost:64866/'} 
                                 >
              Continue
            </Button>
                    
                    
                </CardContent>
            </Card>
    </div>
  );
}