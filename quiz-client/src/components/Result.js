import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createAPIEndpoint, ENDPOINTS } from '../api';
import { Alert, Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { getFormatedTime } from '../helper';
import { green, yellow, red } from '@mui/material/colors';
import useStateContext from '../hooks/useStateContext';

export default function Result() {
  const { context } = useStateContext();
  const [score, setScore] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    calculateScore(context.selectedOptions);
  }, []);

  const calculateScore = (qna) => {
    const requestBody = JSON.stringify(qna.map(item => ({ response: item.selected })));
    console.log(requestBody); // Check the requestBody to ensure it's correctly formatted
    

    createAPIEndpoint(ENDPOINTS.calculateScore)
    .post(requestBody)
    .then(response => {
      if (response.status === 200) {
        return response.data; // Assuming the response contains the calculated score
      } else {
        throw new Error('Failed to calculate score');
      }
    })
      .then(data => {
        setScore(data); // Set the calculated score
      })
      .catch(error => {
        console.error('Failed to calculate score:', error);
        setShowAlert(true); // Show alert for error
      });
};

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

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
            <Typography variant="span" style={{ color: scoreColor }}>

                {score}
              </Typography>/10
            </Typography>

            <Typography variant="h6">
              You got {getFormatedTime(context.timeTaken) + ' mins'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            You have completed the quiz.
            </Typography>
          </CardContent>
          <Button variant="contained" onClick={() => navigate('/')} >Finish</Button>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 220 }}
          image="./result.png"
        />
      </Card>
      {showAlert && <Alert severity="error">Failed to calculate score</Alert>}
    </div>
  );
}
