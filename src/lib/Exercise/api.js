import axios from 'axios';
import { API_KEY } from './config';

const ExerciseAPI = axios.create({
    baseURL: 'https://api.api-ninjas.com/v1/',
    headers: {
        'X-API-Key': API_KEY
    }
});

export const searchExercisesByType = async (type) => {
    try {
        const response = await ExerciseAPI.get(`/exercises?type=${type}`);
        return response.data;
    } catch (error) {
        console.error('Error searching exercises by type:', error);
        return [];
    }
};

export const searchExercisesByMuscle = async (muscle) => {
    try {
        const response = await ExerciseAPI.get(`/exercises?muscle=${muscle}`);
        return response.data;
    } catch (error) {
        console.error('Error searching exercises by muscle:', error); // Updated error message
        return [];
    }
};

export const searchExercisesByDifficulty = async (difficulty) => {
    try {
        const response = await ExerciseAPI.get(`/exercises?difficulty=${difficulty}`);
        return response.data;
    } catch (error) {
        console.error('Error searching exercises by difficulty:', error); // Updated error message
        return [];
    }
};
