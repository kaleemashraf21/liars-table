import React, { useState, useContext, useEffect } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { UserContext } from "@/Contexts/UserContexts";
import { Socket } from "./socketConfig";
import { useLocalSearchParams } from "expo-router";
import { Card } from "@/@types/playerHand";
import { User } from "../Contexts/UserContexts";
import { all } from "axios";
const { width, height } = Dimensions.get("window");

export const DisplayCards: React.FC = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext;
  const [cards, setCards] = useState<Card[]>(user?.hand || []);
  const [selectedCards, setSelectedCards] = useState<number[]>([]); // Track selected card indexes
  const params = useLocalSearchParams();
  const [cardsToDiscard, setCardsToDiscard] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([])
  const roomName = params.roomName as string;

  // useEffect(() => {
  //   console.log("cards to discard:", cardsToDiscard);
  // }, [cardsToDiscard]);

  useEffect(() => {
    console.log("discard pile:", discardPile);
  }, [discardPile]);

  const handleCardPress = (index: number) => {
    // Limit selection to 4 cards
    if (selectedCards.length >= 4 && !selectedCards.includes(index)) {
      return; // Prevent selecting more than 4 cards
    }

    // Toggle card selection
    setSelectedCards((prev) => {
      if (prev.includes(index)) {

        return prev.filter((id) => id !== index); // Deselect card
      } else {

        return [...prev, index]; // Select card
      }
    });
  };

  const handleSubmit = (selectedCards: number[]) => {
    let allCardsToDiscard = []
    for(let i = cards.length - 1; i>=0; i--){
      if(selectedCards.includes(i)){
       allCardsToDiscard.push(cards[i])
      }
    }
    
    setCardsToDiscard(allCardsToDiscard)
    const newHand = cards.filter(element=> !allCardsToDiscard.includes(element))
    setCards(newHand)
    setSelectedCards([])
    setUser((prevUser: User) => {
      return {
        ...prevUser,
        hand: newHand,
      };
    });
    setDiscardPile((prevPile: any) => [...prevPile, ...allCardsToDiscard]);
  }
  useEffect(() => {
    
    // Socket.emit("endTurn", roomName)

    // Socket.emit("discardPile", cardsToDiscard)

  }, [cardsToDiscard]);

  useEffect(()=>{
    setCards(user?.hand)
  }, [user?.hand])

  return (
    <View style={styles.bigContainer} >
      <View style={styles.bigContainer}>
      <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit(selectedCards)}>
        <Text>Submit</Text>
      </TouchableOpacity>

      </View>
    <View style={styles.container}>
    {cards.map((element, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.card,
          {
            // Dynamically calculate the left offset to center the cards
            left: (index - Math.floor(cards.length / 2)) * 25, // Ensure centering
            // Move the card upwards slightly when selected
            transform: selectedCards.includes(index)
              ? [{ translateY: -10 }] // Move upwards by 10 units
              : [{ translateY: 0 }],
            // Apply a green background highlight when selected
            // border-width: 5px,
            borderColor: selectedCards.includes(index)
              ? 'rgba(0, 255, 0, 0.3)' // Light green color with some transparency
              : 'white', // Default white color
          },
        ]}
        onPress={() => handleCardPress(index)}
      >
        <Text style={styles.cardText}>Card {index + 1}</Text>
        <Image source={{ uri: element.image }} style={styles.cardImage} />
      </TouchableOpacity>
    ))}
  </View>
    </View>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    position: "absolute",
    top: -height/8,
    left: -width/100, 
    height: 50,
    width: 100,
    backgroundColor: "white",
    justifyContent: "center"
  },
  bigContainer : {
    flex: 1
  },
  container: {
    position: "relative",
    justifyContent: "center", // Center the cards horizontally
    alignItems: "center", // Center the cards vertically (optional)
    height: 200,
    width: "100%",
    flexDirection: "row", // Align cards horizontally
    left: 50
  },
  card: {
    position: "absolute", // Stack cards on top of each other
    scale: 0.8,
    width: 100,
    height: 150,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 10,
    borderBlockColor: "black",
    overflow: "hidden",
    zIndex: 1, // Ensure cards are on top of each other by default
    justifyContent: "center",
    alignItems: "center",
    // Highlight color when selected
    // backgroundColor: "white", // default color
  },
  cardText: {
    position: "absolute",
    top: 10,
    left: 10,
    color: "black",
    fontSize: 12,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Adjust image to fill the card
  },
});
