import { createContext, useState } from "react";
import * as React from 'react'
import { PlayerHandContextType, Card, Cards} from "../@types/playerHand";


export const HandContext = React.createContext<PlayerHandContextType>({
    user_id: "",
    pile_id: 0,
    cards: [],
    hand: [],
    addCard: () => {}, 
    returnToCard: () => null 
  });
  



export const HandProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [userId] = useState<string>("");
    const [pileId] = useState<number>(0);
    const [cards, setCards] = useState<Card[]>([]);
    const [hand, setHand] = useState<Card[]>([]);

    const addCard = (newCard: Cards) => {
 
        setHand([...hand, ...newCard])
       
    }
    
    const returnToCard = () => {

    }
    const value = {
        user_id: userId,
        pile_id: pileId,
        cards,
        hand,
        addCard,
        returnToCard
    }
    return <HandContext.Provider value={value}>{children}</HandContext.Provider>
}