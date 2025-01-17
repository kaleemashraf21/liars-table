import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import { DiscardPile } from './DiscardCard';

export const DeckArea: React.FC = () => {


    return (
        //view draw card pile
        //view discard pile
        <View>
            <DiscardPile/>
        </View>
    )
}