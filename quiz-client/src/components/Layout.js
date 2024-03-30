import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router'

export default function Layout() {

    return (
        <>
            <AppBar position="sticky" sx={{ bgcolor: '#1b5e20' }}>
                <Toolbar sx={{ width: 640, m: 'auto' }}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ flexGrow: 1, fontFamily: 'Arial', fontWeight: 'bold', color: 'black' }}>

                        EcoDefenders: Quiz
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </>
    );
}
