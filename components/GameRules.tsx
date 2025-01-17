import { View, Text, StyleSheet, ScrollView } from "react-native";
const GameRules = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Liar's Table - Official Rules</Text>
      <Text style={styles.sectionTitle}>Objective:</Text>
      <Text style={styles.text}>
        The goal of BS is to be the first player to get rid of all your cards by
        either playing them honestly or bluffing.
      </Text>
      <Text style={styles.sectionTitle}>Start Point:</Text>
      <Text style={styles.text}>
        Deck will be shuffled and cards will be dealt to each player evenly. The
        player holding the Ace of Spades goes first.
      </Text>
      <Text style={styles.sectionTitle}>Gameplay:</Text>
      <View style={styles.bulletPoints}>
        <Text style={styles.bulletPoint}>
          • Players take turns placing a card face down in the center and
          claiming it’s a specific rank (e.g., “One Ace”).
        </Text>
        <Text style={styles.bulletPoint}>
          • If a player does not have the claimed card, they must bluff by
          playing a different card.
        </Text>
        <Text style={styles.bulletPoint}>
          • After each claim, other players have the option to call “BS” if they
          believe the claim is a bluff.
        </Text>
        <Text style={styles.bulletPoint}>
          • If the claim is indeed a bluff, the player who made the false claim
          must take all the cards in the center.
        </Text>
        <Text style={styles.bulletPoint}>
          • If the claim is truthful and not a bluff, the player who called “BS”
          must take all the cards in the center.
        </Text>
      </View>
      <Text style={styles.sectionTitle}>Winning:</Text>
      <Text style={styles.text}>
        The first player to get rid of all their cards wins the game.
      </Text>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "justify",
  },
  bulletPoints: {
    marginLeft: 20, // Indent bullet points
  },
  bulletPoint: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "left",
  },
});

export default GameRules;
