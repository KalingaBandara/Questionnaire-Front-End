import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/';

// Endpoints for various API requests
export const ENDPOINTS = {
    getQuestions: 'question/getQuestions',
    calculateScore: 'question/calculateScore',
    getScore: 'question/getScore',
    updateAttemptStatus: 'api/updateAttemptStatus'
};

// Function to create an API endpoint instance with specified JWT token
export const createAPIEndpoint = (endpoint,JWT_Token) => {
    let url = BASE_URL + endpoint ;

    // Create a new Axios instance for the specified URL
    const instance = axios.create({
        baseURL: url
    });

    // Set the JWT token as a default header for all requests made by this instance
    instance.defaults.headers.common['JWT-Token'] = JWT_Token;

    // Return an object with methods for different HTTP request types
    return {
        fetch: () => instance.get(),
        fetchById: id => instance.get(id),
        post: newRecord => instance.post('', newRecord, {
            headers: {
                'Content-Type': 'application/json' // Set Content-Type header to application/json for POST requests
            }
        }),
        put: (id, updatedRecord) => instance.put(id, updatedRecord),
        delete: id => instance.delete(id)
    };
};
