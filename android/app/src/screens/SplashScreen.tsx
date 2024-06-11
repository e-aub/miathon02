// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    // Simulate a loading process
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Navigate to Home screen after 2 seconds
    }, 2000);
    return () => clearTimeout(timer); // Clear the timeout if the component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image
        source={require('../assets/images/splash.png')} // Replace with your image path
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default SplashScreen;
