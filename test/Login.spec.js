import { createLocalVue, mount } from '@vue/test-utils'
import Login from '@/pages/login.vue'
import Vuex from "vuex"
require('dotenv').config();

describe('store', () => {

    const localVue = createLocalVue();
    localVue.use(Vuex);
    let NuxtStore;
    let store;

    beforeAll(async () => {
        const storePath = `${process.env.buildDir}/store.js`;
        NuxtStore = await import(storePath);
    })
    beforeEach(async () => {
        store = await NuxtStore.createStore();
    })
})

describe('Twitch auth URL', () => {
    const finalURL = process.env.NUXT_ENV_API_BASE_URL + 'client_id=' +process.env.NUXT_ENV_API_CLIENT_ID + '&redirect_uri=' + encodeURIComponent(process.env.NUXT_ENV_API_REDIRECT_URL) + '&response_type=token&scope=';
    const wrapper = mount(Login);
    test('twitch auth url', () => {
        expect(wrapper.vm.getAuthUrl).toEqual(finalURL);
    });
})

