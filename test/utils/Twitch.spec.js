import axios from 'axios'
import { getUserFollows as U_getUserFollows } from '@/utils/twitch.js'
require('dotenv').config();

const user_access_token = ''; 
const user_id = '53380606';

describe('Twitch get user follow', () => {
    test('User follows', async () => {
        return U_getUserFollows({
            channelId: user_id, 
            authToken: user_access_token, 
            clientId: process.env.NUXT_ENV_API_CLIENT_ID, 
            $axios: {
                $get: axios.get
            }
        }).then((response) => {
            expect(Array.isArray(response)).toBe(true);
            expect(response.length).toBeGreaterThanOrEqual(0);
        }).catch((err) => {
            console.log(err);
        });
    }, 10000);
})