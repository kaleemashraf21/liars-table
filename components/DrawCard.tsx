import { drawCard, getNewDeck } from "./api";
import React, { useEffect } from "react";
import { useState } from "react";
import { Image, Button, View } from "react-native";
import { useContext } from "react";
import { DisplayCards } from "./DisplayCards";
import { Card, Cards } from "../@types/playerHand";
import { UserContext } from "../Contexts/UserContexts";
import { User } from "../Contexts/UserContexts";

export const DrawButton: React.FC = () => {
  const [inProgress, setInProgress] = useState(false)
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext;

  useEffect(() => {
    console.log("Updated user:", user);
  }, [user]);

  const handlePress = () => {
    setInProgress(true)
    const player: Card[][] = [[], [], [], []];
    getNewDeck().then((data) => {
        drawCard(data.deck_id, 52)
        .then((deck) => {
          deck.map((card: Card, index: number) => {
            player[index % 4].push(card);
          });
        })
        .then(() => {
            setUser((prevUser: User) => {
              return {
                ...prevUser,
                hand: [...prevUser.hand, ...player[0]],
              };
            });
          })
        .catch((err) => {
          console.error("Error:", err);
        });
    });
  };

  const handleEndGame = () => {
    setInProgress(false)
    setUser((prevUser: User) => {
        return {
          ...prevUser,
          hand: [],
        };
      });
  }

          /*
            when user joins room - their user context gets updated with a playernumber field
            if userContext.playernumber is 0
            then we can push player[0] to their user context?
            */
  return (
    <View>
        {inProgress === false ? <Button title="Start" onPress={handlePress} /> : null}
        {inProgress === true ? <Button title="Reset Game" onPress={handleEndGame} /> : null}    
      <DisplayCards/>
    </View>
  );
};
