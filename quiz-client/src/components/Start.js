import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Box, Alert } from '@mui/material';
import Center from './Center';
import { createAPIEndpoint, ENDPOINTS } from '../api';
import useStateContext from '../hooks/useStateContext';
import { useNavigate } from 'react-router';

export default function Start() {
    // State and context hooks
    const { setContext, resetContext } = useStateContext();
    const navigate = useNavigate();
    const [showUnauthorizedAlert, setShowUnauthorizedAlert] = useState(false);

    // Use local storage to get the JWT token
    const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken'));


    useEffect(() => {
        // Extract the token from the URL query string
        const params = new URLSearchParams(window.location.search);
        const jwtTokenFromUrl = params.get('token');

        // If the token is found, save it in local storage
        if (jwtTokenFromUrl) {
            localStorage.setItem('jwtToken', jwtTokenFromUrl);
            setJwtToken(jwtTokenFromUrl);
        }

        // Reset the context when the component is mounted
        resetContext();
    }, [resetContext]);

    // Function to start the quiz
    const start = () => {
        // Create an API endpoint for fetching quiz questions
        const endpoint = createAPIEndpoint(ENDPOINTS.getQuestions,jwtToken);
        endpoint.fetch()
            .then(res => {
                // Set context with quiz ID and navigate to the quiz component
                setContext({ id: res.data.id });
                navigate('/quiz');
            })
            .catch(err => {
                console.log(err);

                // Handle unauthorized access when the user has already attempted the quiz
                if (err.response && err.response.status === 401) {
                    setShowUnauthorizedAlert(true);
                    setTimeout(() => {
                        setShowUnauthorizedAlert(false);
                        navigate('/result');
                    }, 1500); 
                }
            });
    };

    return (
        <Center>
    <Card sx={{ width: 600, backgroundImage: 'url(/greenBackground.jpg)', backgroundSize: 'cover', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <CardContent sx={{ textAlign: 'center' }}>
            <Typography
                variant="h3"
                sx={{
                    my: 3,
                    fontFamily: 'Robot',
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: 'lightgreen',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                    textAlign: 'center',
                }}
            >
                EcoDefenders: Quiz
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 3,
                    '& .MuiTextField-root': {
                        m: 1,
                        width: '90%',
                    },
                }}
            >
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                        width: '40%',
                        animation: 'burningEffect 1s infinite alternate',
                        bgcolor: 'green',
                        '&:hover': {
                            bgcolor: '#1b5e20',
                            
                        },
                        fontSize: '1.3rem', 
                        fontWeight: 'bold',
                    }}
                    onClick={start}
                >
                    Start
                </Button>
            </Box>

            {/* Instructions and Plant image side by side */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3,
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                {/* Instructions */}
                <Typography
                    variant="body1"
                    sx={{ textAlign: 'left', listStyleType: 'square', fontFamily: 'Roboto', fontSize: '1.2rem', color: 'white', fontWeight: 'bold' }}
                    component="ul"
                >
                    <Typography component="li">You have only one quiz attempt.</Typography>
                    <Typography component="li">Carefully read the questions and select the correct answer.</Typography>
                    <Typography component="li">Click the 'check' button to submit the answer</Typography>
                    <Typography component="li">Click the 'next' button to go to the next question</Typography>
                    <Typography component="li">This is a sequential quiz; you cannot go back to the previous question.</Typography>
                </Typography>

                {/* Plant image */}
                <div style={{ width: '50%', textAlign: 'center' }}>
                    <img src="/plant.png" alt="Plant" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            </Box>

            {showUnauthorizedAlert && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    You have already attempted the quiz.
                </Alert>
            )}
        </CardContent>
    </Card>
</Center>

    );
}
