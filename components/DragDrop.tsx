// import React, { useState, useRef } from "react";
// import {
//   View,
//   StyleSheet,
//   PanResponder,
//   Animated,
//   Dimensions,
// } from "react-native";
// const { width, height } = Dimensions.get("window");

// type Position = { x: number; y: number };

// const DragDropDemo: React.FC = () => {
//   const initialPosition: Position = { x: 50, y: 50 };

//   const dropZone: Position = {
//     x: width - 150,
//     y: 50,
//   };

//   const dropZoneSize = { width: 100, height: 100 };

//   const [position, setPosition] = useState(initialPosition);
//   const pan = useRef(new Animated.ValueXY()).current;

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,

//       onPanResponderMove: (_, gestureState) => {
//         const newPosition: Position = {
//           x: gestureState.moveX,
//           y: gestureState.moveY,
//         };
//         setPosition(newPosition);
//       },

//       onPanResponderRelease: () => {
//         if (
//           position.x >= dropZone.x &&
//           position.x <= dropZone.x + dropZoneSize.width &&
//           position.y >= dropZone.y &&
//           position.y <= dropZone.y + dropZoneSize.height
//         ) {
//           Animated.spring(pan, {
//             toValue: {
//               x: dropZone.x + dropZoneSize.width / 2 - 25,
//               y: dropZone.y + dropZoneSize.height / 2 - 25,
//             },
//             useNativeDriver: false,
//             friction: 5,
//           }).start();
//         } else {
//           Animated.spring(pan, {
//             toValue: initialPosition,
//             useNativeDriver: false,
//             friction: 5,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   return (
//     // This is where the main UI structure is defined.
//     <View style={styles.container}>
//       {/* The Drop Zone */}
//       <View
//         style={[
//           styles.dropZone,
//           {
//             left: dropZone.x,
//             top: dropZone.y,
//             width: dropZoneSize.width,
//             height: dropZoneSize.height,
//           },
//         ]}
//       />

//       {/* The Draggable Object */}
//       <Animated.View
//         style={[
//           styles.draggable,
//           {
//             transform: [{ translateX: pan.x }, { translateY: pan.y }],
//           },
//         ]}
//         {...panResponder.panHandlers}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "flex-start",
//   },
//   dropZone: {
//     position: "absolute",
//     borderWidth: 2,
//     borderColor: "#2196F3",
//     borderStyle: "dashed",
//     borderRadius: 10,
//     backgroundColor: "rgba(33, 150, 243, 0.1)",
//     zIndex: 100,
//   },
//   draggable: {
//     width: 50,
//     height: 50,
//     backgroundColor: "#2196F3",
//     borderRadius: 8,
//     position: "absolute",
//     left: 50,
//     top: 50,
//   },
// });

// export default DragDropDemo;
