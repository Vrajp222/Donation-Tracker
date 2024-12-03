import React, { useState, useEffect } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DonationProvider } from './src/components/DonationContext'; 
import DashboardScreen from './src/screens/DashboardScreen';
import DonationHistoryScreen from './src/screens/DonationHistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DiscoveryStack from './src/navigation/DiscoveryStack';
import { auth } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Discovery':
            iconName = focused ? 'search' : 'search-outline';
            break;
          case 'History':
            iconName = focused ? 'time' : 'time-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
        }

        return <Ionicons name={iconName} size={size || 24} color={color} />;
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
      tabBarLabelStyle: {
        fontSize: 14,
      },
    })}
  >
    
    <Tab.Screen name='Dashboard' component={DashboardScreen} />
    <Tab.Screen name='Discovery' component={DiscoveryStack} />
    <Tab.Screen name='History' component={DonationHistoryScreen} />
    <Tab.Screen name='Profile' component={ProfileScreen} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <DonationProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          {isAuthenticated ? <MainTabNavigator /> : <AuthStack />}
        </View>
      </DonationProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
