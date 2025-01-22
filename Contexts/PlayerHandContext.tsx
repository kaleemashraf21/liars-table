import { createContext, useState, useContext } from "react";
import * as React from "react";
import { PlayerHandContextType, Card, Cards, Hand } from "../@types/playerHand";
import { UserContext } from "./UserContexts";

export const HandContext = React.createContext<PlayerHandContextType>({
  user_id: "",
  pile_id: 0,
  cards: [],
  hand: { user_id: "", cards: [] },
  addCard: () => {},
  returnToCard: () => null,
});

export const HandProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string>("");
  const [pileId] = useState<number>(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [hand, setHand] = useState<Hand>({ user_id: "", cards: [] });
  const userContext = useContext(UserContext); // Access user from context
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext; // Destructure user from context

  const addCard = (newCard: Cards) => {
    if (user) {
      console.log(user["_id"], "<--from hand context");
      const userID = user["_id"];
      setUserId(userID);
      const updatedCards = [...cards, ...newCard];
      setCards(updatedCards);
      setHand({
        user_id: userID,
        cards: updatedCards,
      });
    }
  };

  const returnToCard = () => {};
  const value = {
    user_id: userId,
    pile_id: pileId,
    cards,
    hand,
    addCard,
    returnToCard,
  };
  return <HandContext.Provider value={value}>{children}</HandContext.Provider>;
};
