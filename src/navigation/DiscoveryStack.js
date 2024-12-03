import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DonationProvider } from '../components/DonationContext'; 
import CharityDiscoveryScreen from '../screens/CharityDiscoveryScreen'; 
import CharityDetailScreen from '../screens/CharityDetailScreen'; 
const Stack = createStackNavigator();

export default function App() {
    return (
        <DonationProvider>
           
                <Stack.Navigator>
                    <Stack.Screen name="CharityDiscoveryScreen" component={CharityDiscoveryScreen} />
                    <Stack.Screen name="CharityDetailScreen" component={CharityDetailScreen} />
                </Stack.Navigator>
            
        </DonationProvider>
    );
}
