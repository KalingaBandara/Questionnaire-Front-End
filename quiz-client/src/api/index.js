import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/';

export const ENDPOINTS = {
    getQuestions: 'question/getQuestions',
    calculateScore: 'question/calculateScore',
    updateAttemptStatus: 'api/updateAttemptStatus'
};

const API_KEY = 'NjVkNDIyMjNmMjc3NmU3OTI5MWJmZGI0OjY1ZDQyMjIzZjI3NzZlNzkyOTFiZmRhYQ';


export const createAPIEndpoint = endpoint => {
    let url = BASE_URL + endpoint ;

    const instance = axios.create({
        baseURL: url
    });

    instance.defaults.headers.common['API-Key'] = API_KEY;


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
