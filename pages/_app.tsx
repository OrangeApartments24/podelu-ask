import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'moment/locale/ru';
import { Provider } from 'react-redux';
import { store } from '../store';

export const firebaseApp = initializeApp({
    apiKey: 'AIzaSyDln11HXwFB7pIYD_ySyIl_j1RWnurxJ34',
    authDomain: 'podelu-309ea.firebaseapp.com',
    projectId: 'podelu-309ea',
    storageBucket: 'podelu-309ea.appspot.com',
    messagingSenderId: '444086589170',
    appId: '1:444086589170:web:04bd8a745bf313cd68226b',
    measurementId: 'G-VZ52GHSV6T',
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <ChakraProvider resetCSS>
                <Component {...pageProps} />
            </ChakraProvider>
        </Provider>
    );
}
