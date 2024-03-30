import React, { useEffect, useState } from 'react'
import { Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Center from './Center'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import useStateContext from '../hooks/useStateContext'
import { useNavigate } from 'react-router'


export default function Start() {

    const { context, setContext, resetContext } = useStateContext();
    const navigate = useNavigate()


    useEffect(() => {
        resetContext()
    }, [])

    const start = () => {

        const endpoint = createAPIEndpoint(ENDPOINTS.get);
        endpoint.fetch()
                .then(res => {
                    setContext({ id: res.data.id })
                    navigate('/quiz')
                })
                .catch(err => console.log(err))
        
    }

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
                                sx={{ width: '90%' }}
                                onClick={start}
                                >
                                    Start
                                </Button>
                    </Box>
                </CardContent>
            </Card>
        </Center>


    )
}