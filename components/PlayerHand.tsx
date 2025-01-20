import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");
import { DisplayCards } from "./DisplayCards";
export const PlayerHand: React.FC<{}> = () => {
  return (
    <View style={styles.container}>
      <DisplayCards />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: height - 300,
    left: 0,
    right: 0,
    height: 150, // 20% of screen height
    justifyContent: "center",
    backgroundColor: "purple",
    alignItems: "center",
    zIndex: 10,
  },
  hand: {
    color: "blue",
    fontWeight: "bold",
    marginBottom: 8,
    zIndex: 100,
  },
});
