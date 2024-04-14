import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/';

export const ENDPOINTS = {
    getQuestions: 'question/getQuestions',
    calculateScore: 'question/calculateScore',
    getScore: 'question/getScore',
    updateAttemptStatus: 'api/updateAttemptStatus'
};

const JWT_Token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvdmVyc2lnaHRfZzE1IiwiaWF0IjoxNzEzMDgwNjM5LCJleHAiOjE3MTMxMTY2Mzl9.6mbsfFCybJBp1TssAPynmiARQHmeQ5Vxa5H8EUN1ThhP01G_1D0EU1Kc8YDq6zBjAQDkVC1ShguNWaNAEzEubw';


export const createAPIEndpoint = endpoint => {
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
