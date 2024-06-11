// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './android/app/src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
