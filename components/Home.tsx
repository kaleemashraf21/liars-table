import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { UserContext } from "../Contexts/UserContexts"; // Import UserContext
import { auth } from "@/firebaseConfig";
import { router } from "expo-router";


const HomeScreen = ({ navigation }: { navigation: any }) => {
  const userContext = useContext(UserContext); // Access user from context
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext; // Destructure user from context
  const handleLogOut = async () => {
    await auth.signOut(); // Firebase sign-out
    setUser(null); // Clear user context
    router.push("/signin"); // Navigate to SignIn screen
  };
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome{user ? `, ${user.username}` : ""}!
      </Text>
      <Text>You're now logged in to Liar's Table.</Text>
      <Button title="Log Out" onPress={handleLogOut} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
export default HomeScreen;