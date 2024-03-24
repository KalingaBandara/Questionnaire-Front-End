import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/question/';

export const ENDPOINTS = {
    get: 'get',
    allQuestions: 'allQuestions',
    calculateScore: 'calculateScore'
};

export const createAPIEndpoint = endpoint => {
    let url = BASE_URL + endpoint ;

    const instance = axios.create({
        baseURL: url
    });

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
