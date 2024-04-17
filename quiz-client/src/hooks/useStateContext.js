import React, { createContext, useContext, useState, useEffect } from 'react'

// Create a context for state management
export const stateContext = createContext();

// Function to get a fresh context
// If the context is not stored in localStorage, create a new context
const getFreshContext = () => {
    if (localStorage.getItem('context') === null)
        localStorage.setItem('context', JSON.stringify({
            participantId: 0,
            timeTaken: 0,
            selectedOptions: []
        }))
    return JSON.parse(localStorage.getItem('context'))
}

// Custom hook for accessing and updating the context
export default function useStateContext() {
    const { context, setContext } = useContext(stateContext)
    return {
        context,
        setContext: obj => { 
            // Merge the provided object with the current context
            setContext({ ...context, ...obj }) },
        resetContext: ()=>{
            localStorage.removeItem('context')
            setContext(getFreshContext())
        }
    };
}

// Context provider component to wrap around the application
export function ContextProvider({ children }) {
    // State variable for the context
    const [context, setContext] = useState(getFreshContext())

    // Effect to update the localStorage whenever the context changes
    useEffect(() => {
        localStorage.setItem('context', JSON.stringify(context))
    }, [context])

    return (
        // Provide the context and setContext function to child components
        <stateContext.Provider value={{ context, setContext }}>
            {children}
        </stateContext.Provider>
    )
}
