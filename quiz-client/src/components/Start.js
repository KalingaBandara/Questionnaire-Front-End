import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Box, Alert } from '@mui/material';
import Center from './Center';
import { createAPIEndpoint, ENDPOINTS } from '../api';
import useStateContext from '../hooks/useStateContext';
import { useNavigate } from 'react-router';

export default function Start() {
    const { setContext, resetContext } = useStateContext();
    const navigate = useNavigate();
    const [showUnauthorizedAlert, setShowUnauthorizedAlert] = useState(false);

    useEffect(() => {
        resetContext();
    }, []);

    const start = () => {
        const endpoint = createAPIEndpoint(ENDPOINTS.getQuestions);
        endpoint.fetch()
            .then(res => {
                setContext({ id: res.data.id });
                navigate('/quiz');
            })
            .catch(err => {
                console.log(err);
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
            <Card sx={{ width: 400 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ my: 3 }}>
                        Quiz App
                    </Typography>
                    <Box sx={{
                        '& .MuiTextField-root': {
                            m: 1,
                            width: '90%'
                        }
                    }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                width: '90%',
                                bgcolor: 'green',
                                '&:hover': {
                                    bgcolor: '#1b5e20', // Darker green when hovered
                                },
                            }}
                            onClick={start}
                        >
                            Start
                        </Button>
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
