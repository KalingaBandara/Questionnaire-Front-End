import React, { useEffect, useState } from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import useStateContext from '../hooks/useStateContext'
import { Card, CardContent, CardHeader, List, ListItemButton, Typography, Box, LinearProgress, Button } from '@mui/material'
import { getFormatedTime } from '../helper'
import { useNavigate } from 'react-router'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Alert from '@mui/material/Alert';


export default function Quiz() {
   
    // Define states for quiz data, question index, time taken, feedback, alert, and other flags
    const [qns, setQns] = useState([])
    const [qnIndex, setQnIndex] = useState(0)
    const [timeTaken, setTimeTaken] = useState(0)
    const [generalFeedback, setGeneralFeedback] = useState("")
    const [selectedFeedback, setSelectedFeedback] = useState("")
    const { context, setContext } = useStateContext()
    const navigate = useNavigate()
    const [showFeedback, setShowFeedback] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [optionsDisabled, setOptionsDisabled] = useState(false);
    const [showUnavailableAlert,setShowUnavailableAlert] = useState(false)
    const [showCheckButton, setShowCheckButton] = useState(true);

    // Retrieve JWT token from local storage
    const jwtToken = localStorage.getItem('jwtToken');

    // Declare a timer variable
    let timer;

    // Function to start the timer for tracking time taken during the quiz
    const startTimer = () => {
        timer = setInterval(() => {
            setTimeTaken(prev => prev + 1)
        }, [1000])
    }

    // useEffect hook to fetch quiz questions when the component mounts
    useEffect(() => {
        // Initialize context
        setContext({
            timeTaken: 0,
            selectedOptions: []
        });

        // Fetch questions from the API endpoint        
        createAPIEndpoint(ENDPOINTS.getQuestions,jwtToken)
            .fetch() 
            .then(res => {
                // Add selectedOption field to each question
                const updatedData = res.data.map(item => ({ ...item, selectedOption: "" }));
                setQns(updatedData);
                startTimer() // Start the timer
            })
            .catch(err => { 
                console.log(err); 
                setShowUnavailableAlert(true);
                setTimeout(() => {
                    setShowUnavailableAlert(false);
                    navigate('/result');
                }, 1500);
            });
        // Clear the timer when the component unmounts
        return () => { clearInterval(timer) }
    }, []);

    // Function to update the answer selected by the user
    const updateAnswer = (qnId, optionIdx) => {

        // Create a copy of the selectedOptions array
        const temp = context.selectedOptions.map(item => ({ ...item }));
    
        // Update the selected option for the current question
        temp[qnIndex] = {
            qnId,
            selected: optionIdx,
        };
    
        // Update the context with the new selectedOptions array
        setContext({ selectedOptions: temp });
    
        // Update feedback and navigate if necessary
        if (qnIndex < 9) {
            setSelectedFeedback(null);
            updateFeedback(qnId, optionIdx);
            setShowCheckButton(true)
        } 
        else {
            setContext({ selectedOptions: temp, timeTaken });
            
            }
    };

    // Function to update feedback for the selected option
    const updateFeedback = (qnId, optionIdx) => {
        const selectedQuestion = qns.find(question => question.questionId === qnId);
        if (selectedQuestion) {
            let selectedOptionKey = `feedback${optionIdx + 1}`;
            let generalFeedback = selectedQuestion.generalFeedback || "General feedback not available";
            let selectedFeedback = selectedQuestion[selectedOptionKey] || "Selected feedback not available";
            setGeneralFeedback(generalFeedback);
            setSelectedFeedback(selectedFeedback);
        } else {
            setGeneralFeedback("Question not found");
            setSelectedFeedback("");
        }
    }

    // Handle the feedback button click
    const handleFeedbackClick = () => {
        // Check if an option is selected
        if (context.selectedOptions[qnIndex]?.selected === undefined || context.selectedOptions[qnIndex]?.selected === null) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);
            return;
        }
    
        // Show feedback and disable options
        setShowFeedback(true);
        setOptionsDisabled(true);
        setShowCheckButton(false);
    };
    
    // Handle the next button click
    const handleNextClick = () => {
        // Hide feedback and enable options after a delay
        setTimeout(() => {
            setShowFeedback(false);
            setOptionsDisabled(false);
            setShowCheckButton(true);
    
            // Move to the next question
            if (qnIndex < 9) {
                setQnIndex(prevIndex => prevIndex + 1);
            } else if (qnIndex === 9) {
                // If it's the last question, navigate to the result
                //console.log("Navigated to /result");
                //console.log("Selected options array:", context.selectedOptions);
                // Update attempt status and calculate score
                createAPIEndpoint(ENDPOINTS.updateAttemptStatus, jwtToken)
                    .fetch()
                    .then(response => {
                        if (response.status === 200) {
                            const requestBody = JSON.stringify(context.selectedOptions.map(item => ({ response: item.selected })));
                            return createAPIEndpoint(ENDPOINTS.calculateScore, jwtToken).post(requestBody);
                        } else {
                            throw new Error('Failed to update attempt status');
                        }
                    })
                    .then(response => {
                        if (response.status === 200) {
                            return response.data;
                        } else {
                            throw new Error('Failed to calculate score');
                        }
                    })
                    .then(data => {
                        navigate("/result");
                    })
                    .catch(error => {
                        console.error('Error updating attempt status or calculating score:', error);
                        setShowAlert(true);
                    });
            }
        }, 500);
    };
    
    

    return (
        qns.length !== 0 
            ? <>
                <Card
                    sx={{
                        maxWidth: 640, mx: 'auto', mt: 5,
                        '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' }
                    }}>
                    <CardHeader
                        title={'Question ' + (qnIndex + 1) + ' of 10'}
                        action={<Typography>{getFormatedTime(timeTaken)}</Typography>} />
                    <Box>
                        <LinearProgress 
                        variant="determinate"
                        color="success"
                        value={(qnIndex + 1) * 100 / 10}
                         />
                    </Box>
                    <CardContent>
                        <Typography variant="h6">
                            {qns[qnIndex].questionTitle}
                        </Typography>
                        <List>
                            {Object.keys(qns[qnIndex]).filter(key => key.startsWith('option')).map((key, idx) => (
                                <ListItemButton 
                                    disableRipple 
                                    key={idx} 
                                    onClick={() => updateAnswer(qns[qnIndex].questionId, idx, "")} 
                                    selected={context.selectedOptions[qnIndex]?.selected === idx}
                                    disabled={optionsDisabled} // Disable options if optionsDisabled is true
                                >
                                    <div>
                                        <b>{String.fromCharCode(65 + idx) + " . "}</b>{qns[qnIndex][key]}
                                    </div>
                                </ListItemButton>
                            ))}
                        </List>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {showCheckButton && (
                                <Button variant="outlined" color="success" size="large" sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }} onClick={handleFeedbackClick}>
                                    Check
                                </Button>
                            )}
                        </div>
                        
                    </CardContent>
                </Card>

                {showFeedback &&
                    <Card
                        sx={{
                            maxWidth: 640, mx: 'auto', mt: 5,
                            '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' }
                        }}
                    >
                        <CardHeader title= {selectedFeedback}
                        sx={{ color: '#D4A017' }} />
                        <CardContent>
                            <Typography variant="body1">
                                <TipsAndUpdatesIcon/> {generalFeedback || "Fetching general feedback..."}
                            </Typography>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {!showCheckButton && (
                                <Button variant="outlined" color="success" size="large" sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }} onClick={handleNextClick}>
                                    Next
                                </Button>
                            )}
                        </div>
                        </CardContent>
                    </Card>
                }

                {showAlert &&
                    <Card
                        sx={{
                            maxWidth: 640, mx: 'auto', mt: 5,
                            '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' }
                        }}
                    >
                        <CardContent>
                            <Typography variant="body1">
                                <Alert severity="info">Please select an option to continue.</Alert> 
                            </Typography>
                        </CardContent>
                    </Card>
                }

                
            </>
            : 
            (
                showUnavailableAlert &&
                <Card
                sx={{
                    maxWidth: 640, mx: 'auto', mt: 5,
                    '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' }
                }}
            >
                <CardContent>
                    <Typography variant="body1">
                    <Alert severity="error" sx={{ mt: 2 }}>
                    You have already attempted the quiz. 
                </Alert>
                    </Typography>

                    </CardContent>
            </Card>     
            )
    );
}
