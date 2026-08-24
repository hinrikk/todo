import { Redirect } from "expo-router";
import { StyleSheet } from 'react-native';



export default function HomeScreen() {
  return (
    <Redirect href="/login" />
  );
}

const styles = StyleSheet.create({
  
});
