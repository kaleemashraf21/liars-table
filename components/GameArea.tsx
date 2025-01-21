import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, StyleSheet, ImageBackground } from "react-native";
import { HandProvider } from "@/Contexts/PlayerHandContext";
import PlayingTable from "./PlayingTable";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";

const dimensions = Dimensions.get('window');   
const imageWidth = dimensions.width;
const imageHeight = dimensions.height;

const GameArea = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
      <ImageBackground source={require("../assets/images/table.jpg")} imageStyle={styles.image} resizeMode="stretch">
        <HandProvider>
          <SafeAreaView style={styles.tableContainer}>
            
              <PlayingTable />

          </SafeAreaView>
        </HandProvider>
        </ImageBackground>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor:"#fff",
    flex: 1,
  },
  image: {
    // backgroundColor:"#fff",
    height: imageHeight,
    width: imageWidth
  },
  tableContainer: {
    marginTop: 50,
    flex: 1,
    //justifyContent: 'center',
    // alignItems: 'center'
  },
});

export default GameArea;
