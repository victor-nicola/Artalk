import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthStack from './routes/AuthStack';

export default function App() {
  return (
    <View style={styles.container}>
      <AuthStack />
      <StatusBar barStyle = {"light-content"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
