import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/';

export const ENDPOINTS = {
    getQuestions: 'question/getQuestions',
    calculateScore: 'question/calculateScore',
    getScore: 'question/getScore',
    updateAttemptStatus: 'api/updateAttemptStatus'
};

//const JWT_Token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvdmVyc2lnaHRfZzE1IiwiaWF0IjoxNzEzMTcxNzI5LCJleHAiOjE3MTMyMDc3Mjl9.5_3Fn7UGjjH1O64RTiIFQI-_V26XU34kok8woIffPvbq0vI0Lkol0k4-Revx7JtSRR_XH0ojeZFk1Y-5VdGgng';

export const createAPIEndpoint = (endpoint,JWT_Token) => {
    let url = BASE_URL + endpoint ;

    const instance = axios.create({
        baseURL: url
    });

    instance.defaults.headers.common['JWT-Token'] = JWT_Token;


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
