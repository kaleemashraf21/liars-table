import { drawCard} from "./api";
import React, { useEffect } from "react";
import {useState} from "react"
import {Image, Button, View} from "react-native"
import { HandContext } from "../Contexts/PlayerHandContext";
import { useContext } from "react";
import { DisplayCards } from "./DisplayCards";
import { Card, Cards} from "../@types/playerHand";

export const DrawButton: React.FC = () => {
    
    const { addCard } = useContext(HandContext);
  
    const handlePress =() => {

        let number = 2
            drawCard(number).then((data)=>{
                    addCard(data)
                    
            })

    }

   
    return (
    <View>
        
        <Button title="draw 2 cards" onPress={handlePress}/>
        {/* <DisplayCards/> */}

    </View>
)
        
  
   
}