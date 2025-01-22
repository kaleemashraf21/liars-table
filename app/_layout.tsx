import { Stack } from "expo-router";
import { UserProvider } from "@/Contexts/UserContexts";
import { MenuProvider } from "react-native-popup-menu";

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen
          name="creategame"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="joingame"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Game"
          options={{
            headerShown: false,
          }}
        />
          <Stack.Screen
            name="home"
            options={{
              headerShown: false,
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
      </Stack>
    </UserProvider>
  );
}
