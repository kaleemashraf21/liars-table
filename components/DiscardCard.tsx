// import { addToPile } from "./api";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  Image,
  Button,
  View,
  Dimensions,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { HandContext } from "../Contexts/PlayerHandContext";
import { useContext } from "react";
import { Card, Cards} from "../@types/playerHand";

import DragDropDemo from "./DragDrop";

export const DiscardPile: React.FC = () => {
  const { addCard } = useContext(HandContext);
  const discard = "discard";
  const [cardsToDiscard, setCardsToDiscard] = useState<string[]>([]);

  // addToPile(discard, cardsToDiscard)

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <DragDropDemo />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropZone: {
    position: "absolute",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#4CAF50",
    borderRadius: 12,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
