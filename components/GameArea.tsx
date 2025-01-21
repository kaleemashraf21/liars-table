import { GestureHandlerRootView } from "react-native-gesture-handler"
import { View, StyleSheet } from "react-native"
import { HandProvider } from "@/Contexts/PlayerHandContext"
import PlayingTable from "./PlayingTable"
import { SafeAreaView } from "react-native-safe-area-context"



const GameArea = () => {
return(
<GestureHandlerRootView  style={styles.container}>
<View >
<HandProvider>
<SafeAreaView style={styles.tableContainer}>
  <PlayingTable  />
  {/* <DrawButton /> */}

  
</SafeAreaView>
</HandProvider>
</View>
</GestureHandlerRootView>
)
}

const styles = StyleSheet.create({
    container: {
      // backgroundColor:"#fff",
      flex: 1
  
    },
    tableContainer:{
        marginTop: 50,
        flex: 1
        //justifyContent: 'center',
        // alignItems: 'center'
        
      }
})

export default GameArea