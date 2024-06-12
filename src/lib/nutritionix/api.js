import axios from "axios";
import { apiKey, applicationId } from "./config";

const axiosInstance = axios.create({
    headers: {
        'x-app-id': applicationId,
        'x-app-key': apiKey,
        'Content-Type': 'application/json'
    }
});

export const fetchNutritionData = async (query) => {
    try {
        const response = await axiosInstance.post(
            'https://trackapi.nutritionix.com/v2/natural/nutrients',
            { query }
        );

        if (response.data.foods.length > 0) {
            const calories = response.data.foods[0].nf_calories;
            if (calories)
                return calories;
            else
                return 0;
        } else {
            throw new Error('No food data found');
        }
    } catch (error) {
        console.log('Error fetching nutrition data:', error.response ? error.response.data : error.message);
        return null;
    }
};


export const fetchUPCData = async (upc) => {
    try {
        const response = await axiosInstance.get(
            `https://trackapi.nutritionix.com/v2/search/item?upc=${upc}`
        );
        return response.data;
    } catch (error) {
        console.log('Error fetching UPC data:', error.response ? error.response.data : error.message);
        return null;
    }
};

export const analyzeRecipe = async (ingredients) => {
    try {
        const response = await axiosInstance.post(
            'https://trackapi.nutritionix.com/v2/natural/nutrients',
            { query: ingredients.join(', ') }
        );
        return response.data;
    } catch (error) {
        console.log('Error analyzing recipe:', error.response ? error.response.data : error.message);
        return null;
    }
};