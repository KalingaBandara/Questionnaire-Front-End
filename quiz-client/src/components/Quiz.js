import React, { useEffect, useState } from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import useStateContext from '../hooks/useStateContext'
import { Card, CardContent, CardHeader, List, ListItemButton, Typography, Box, LinearProgress, Button } from '@mui/material'
import { getFormatedTime } from '../helper'
import { useNavigate } from 'react-router'
import  TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

export default function Quiz() {

    const [qns, setQns] = useState([])
    const [qnIndex, setQnIndex] = useState(0)
    const [timeTaken, setTimeTaken] = useState(0)
    const [generalFeedback, setGeneralFeedback] = useState(""); // Declare state variable for general feedback
    const [selectedFeedback, setSelectedFeedback] = useState(""); // Declare state variable for selected feedback
    const { context, setContext } = useStateContext()
    const navigate = useNavigate()
    const [showFeedback, setShowFeedback] = useState(false); // <-- Define showFeedback state
    const [showAlert, setShowAlert] = useState(false); // <-- Define showAlert state
    
    let selectedQuestion;

    let timer;

    const startTimer = () => {
        timer = setInterval(() => {
            setTimeTaken(prev => prev + 1)
        }, [1000])
    }

    useEffect(() => {
        setContext({
            timeTaken: 0,
            selectedOptions: []
        })
        createAPIEndpoint(ENDPOINTS.get)
            .fetch() 
            .then(res => {
                const updatedData = res.data.map(item => ({ ...item, selectedOption: "" }));

                setQns(updatedData);
                startTimer()
            })
            .catch(err => { console.log(err); })

        return () => { clearInterval(timer) }
    }, [])

    const updateAnswer = (qnId, optionIdx, optionText) => {
        selectedQuestion = optionIdx;
        qns[qnIndex].selectedOption = optionIdx;
        const temp = [...context.selectedOptions]
        temp.push({
            qnId,
            selected: optionIdx,
            text: optionText
        })
        if (qnIndex < 9) {
            setContext({ selectedOptions: [...temp] })
            setSelectedFeedback(null)
            updateFeedback(qnId, optionIdx)
        }
        else {
            setContext({ selectedOptions: [...temp], timeTaken })
            navigate("/result")
        }
        console.log(qns);

    }

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

    const handleNextClick = () => {
        if (context.selectedOptions[qnIndex]?.selected === undefined) {
            setShowAlert(true); // Show alert
            setTimeout(() => {
                setShowAlert(false); // Hide alert
            }, 2000);
            return
        }
        setShowFeedback(true); 
        setTimeout(() => {
            setShowFeedback(false); // Hide feedback
            setQnIndex(prevIndex => prevIndex + 1); // Move to the next question
        }, 2000);     
        
    }

    return (
        qns.length != 0
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
                    <LinearProgress variant="determinate" value={(qnIndex + 1) * 100 / 10} />
                </Box>
                <CardContent>
                    <Typography variant="h6">
                        {qns[qnIndex].questionTitle}
                    </Typography>
                    <List>
                        {Object.keys(qns[qnIndex]).filter(key => key.startsWith('option')).map((key, idx) => (
                            <ListItemButton disableRipple key={idx} onClick={() => updateAnswer(qns[qnIndex].questionId, idx, "")} selected={context.selectedOptions[qnIndex]?.selected === idx}>
                                <div>
                                    <b>{String.fromCharCode(65 + idx) + " . "}</b>{qns[qnIndex][key]}
                                </div>
                            </ListItemButton>
                        ))}
                    </List>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="outlined" size="large" sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }} onClick={handleNextClick}>Next</Button>
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
                    <CardHeader title= {selectedFeedback} />
                    <CardContent>
                        <Typography variant="body1">
                        <TipsAndUpdatesIcon/> {generalFeedback || "Fetching general feedback..."}
                        </Typography>
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
                    <CardHeader title= "Warning" />
                    <CardContent>
                        <Typography variant="body1">
                        <TipsAndUpdatesIcon/> "Please select an option before moving to the next question."
                        </Typography>
                    </CardContent>
                </Card>
            }   


                    
            </>
            : null
    )
}
