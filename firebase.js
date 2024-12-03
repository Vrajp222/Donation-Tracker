import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCuU0gmdHKs7nuvtEn-7Byy_EN2hN1nivA",
  authDomain: "react-native-project-30907.firebaseapp.com",
  projectId: "react-native-project-30907",
  storageBucket: "react-native-project-30907.appspot.com",
  messagingSenderId: "456740620804",
  appId: "1:456740620804:web:dbd1b78f98e81ceaa54351"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

LogBox.ignoreLogs(['heartbeats']);

export { auth };
