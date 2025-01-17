import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import createSocket from '../utils/socket';
import {Players} from '../@types/players';
import {DrawButton} from './DrawCard';
import { DeckArea } from './DeckArea';
import { PlayerHand } from './PlayerHand';
const {width, height} = Dimensions.get('window');
type Position = 'top' | 'left' | 'right' | 'bottom';

const PlayerSlot: React.FC<{position: Position; name: string}> = ({
  position,
  name,
}) => {
  return (
    // <View style={[styles.playerSlot, styles[position]]}>
    <View style={styles.playerSlot}>
      <Text style={styles.playerName}>{name}</Text>
      <View>
        <Text>Cards</Text>
      </View>
    </View>
  );
};

const PlayingTable: React.FC = () => {
  const [players, setPlayers] = useState<Players>({
    top: 'Top...',
    left: 'Left.....',
    right: 'Right....',
    bottom: 'Bottom...',
  });

  useEffect(() => {
    const socket = createSocket();

    socket.on('updatePlayers', (updatedPlayers: Players) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <PlayerSlot position="top" name={players.top} />
      </View>
      <View style={styles.left}>
        <PlayerSlot position="left" name={players.left} />
      </View>
      <View style={styles.deck}>
        <DrawButton />
        <DeckArea />
      </View>
      <View style={styles.right}>
        <PlayerSlot position="right" name={players.right} />
      </View>
      <View style={styles.bottom}>
        <PlayerSlot position="bottom" name={players.bottom} />
      </View>
      <View>
        <PlayerHand/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 50,
    //alignItems: 'center',
    // justifyContent: 'center'
  },
  playerSlot: {
    position: 'absolute',
    backgroundColor: '#4B5563',
    padding: 16,
    borderRadius: 8,
    width: 100,
    height: 100,
    alignItems: 'center',
  },
  playerName: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },

  deck: {
    position: 'absolute',
    backgroundColor: 'purple',
    width: 100,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: height * 0.35,
    left: width * 0.5 - 50,
   

  },

  top: {
    top: height * 0.0,
    left: width * 0.5 - 50,
  },
  left: {
    top: height * 0.35,
    left: width * 0.05,
  },
  right: {
    top: height * 0.35,
    left: width * 0.70,
  },
  bottom: {
    top: height * 0.7,
    left: width * 0.5 - 50,
    
  },
//   tableContainer: {
//     flex: 1,
//     position: 'relative',  // Important for absolute positioning of children
//     height: height,        // Full height
// },
});

export default PlayingTable;
