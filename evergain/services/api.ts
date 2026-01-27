import { Platform } from 'react-native';

// API URL Configuration - Must match authService.ts
// IMPORTANT: Update LOCAL_IP if your computer's IP changes
const LOCAL_IP = '10.218.19.73';

const getBaseUrl = () => {
    if (Platform.OS === 'web') {
        return 'http://localhost:8080/api/workouts';
    } else if (Platform.OS === 'android') {
        return `http://${LOCAL_IP}:8080/api/workouts`;
    } else if (Platform.OS === 'ios') {
        return 'http://localhost:8080/api/workouts';
    }
    return `http://${LOCAL_IP}:8080/api/workouts`;
};

const BASE_URL = getBaseUrl();

console.log('🏋️ Workout API URL:', BASE_URL, '| Platform:', Platform.OS);

export interface WorkoutInput {
    weight: number;
    reps: number;
    sets: number;
    feeling: string;
}

export interface WorkoutResponse {
    id: number;
    weight: number;
    reps: number;
    sets: number;
    feeling: string;
    progress_state: string;
    advice: string;
    color: string;
    created_at: string;
}

export const WorkoutAPI = {
    submitWorkout: async (workout: WorkoutInput): Promise<WorkoutResponse> => {
        try {
            const response = await fetch(BASE_URL + '/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workout),
            });

            if (!response.ok) {
                throw new Error('Failed to submit workout');
            }

            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    getHistory: async (): Promise<WorkoutResponse[]> => {
        try {
            const response = await fetch(BASE_URL + '/');
            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
};
