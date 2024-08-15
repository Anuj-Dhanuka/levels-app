import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";

//context
import { ThemeProvider } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";

//redux
import store from "./src/store/reducers/store";

//navigations
import Navigation from "./src/navigation/navigation";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaProvider style={styles.container}>
        <AuthProvider>
          <ThemeProvider>
            <Provider store={store}>
              <Navigation />
            </Provider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
