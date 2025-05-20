import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import RootStack from './navigation/RootStack';

const App = () => (
  <ThemeProvider>
    <RootStack />
  </ThemeProvider>
);

export default App;