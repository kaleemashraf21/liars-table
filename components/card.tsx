import { getNewDeck } from "./api";
import React, { useEffect } from "react";
import {useState} from "react"
import {Image, View, Text} from "react-native"

export const GetDeck: any = () => {
    const [deck, setDeckId] = useState <any[]>([])

    useEffect(()=>{
        getNewDeck().then((data)=>{
            setDeckId(data.deck_id)
            console.log(deck)
        })
    },[])

}
