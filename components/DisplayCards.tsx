
import React from "react";

import {Image, View, Text, Pressable, TouchableOpacity, StyleSheet} from "react-native"
import { useContext, useEffect} from "react";
import { HandContext } from "../Contexts/PlayerHandContext";

import { DraggableCard } from "../utils/Draggable";



export const DisplayCards: React.FC = () => {
  const { hand } = useContext(HandContext)

  const cards = hand.cards
  useEffect(() => {
    console.log('Hand value changed:', hand)
  }, [hand])
 
  return (

    <View>

    {cards.map((element, index) => (
     
      <DraggableCard 
        key={index}
        initialPostion={{ x: -190 + (index * 15), y: -100}}
        
        >

        <Pressable 

        key={index}>

            <Image 
                
                source={{ uri: element.image }}
                style={styles.cardImage} 
              
            />
        </Pressable>
      </DraggableCard>
    ))}
    </View>

  )

};


const styles = StyleSheet.create(
  {
  container: {
      position: 'relative',
      height: 400,
      width: '100%',
  },
  cardImage: {
      width: 100,
      height: 150,
  }
});