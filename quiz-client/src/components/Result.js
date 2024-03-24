import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createAPIEndpoint, ENDPOINTS } from '../api';
import { Alert, Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { getFormatedTime } from '../helper';
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

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: 400 }}>
          <CardMedia
            component="img"
            height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Your Score: {score}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Other details can be displayed here
            </Typography>
          </CardContent>
          <Button variant="contained" onClick={() => navigate('/')} >Finish</Button>
        </Card>
      </Box>
      {showAlert && <Alert severity="error">Failed to calculate score</Alert>}
    </div>
  );
}
