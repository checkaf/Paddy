import axios from 'axios';

export async function fetchAiPriceSuggestion({ name, category, quantity }) {
    // Mock API: returns a random fair price around a baseline derived from quantity
    const baseline = (quantity || 1) * 10;
    const noise = Math.round((Math.random() - 0.5) * baseline * 0.3);
    const suggested = Math.max(1, baseline + noise);
    return { price: suggested, currency: 'LKR' };
}

export const api = axios.create({ baseURL: '/' });


