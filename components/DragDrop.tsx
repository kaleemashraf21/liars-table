import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { DraggableCard } from '../utils/Draggable';
const {width, height} = Dimensions.get('window'); // retrieves the screen width and height of the device.

type Position = {x: number; y: number}; // Declares a Position type to manage x and y coordinates of an object.

const DragDropDemo: React.FC = () => {
  const initialPosition: Position = {x: 50, y: 50}; // The initial position of the draggable object when it first renders.

  const dropZone: Position = {
    // Defining the location of the drop zone (where the object can be dropped)
    x: width - 150, // 150 pixels from the right edge of the screen
    y: 50, // 50 pixels from the top
  };

  const dropZoneSize = {width: 100, height: 100}; // Defines the size of the drop zone.

  const [position, setPosition] = useState(initialPosition); // `position` state holds the current position of the draggable object, initially set to the initialPosition.
  const pan = useRef(new Animated.ValueXY()).current; // Creates an Animated value for handling movement (X and Y).

  const panResponder = useRef(
    PanResponder.create({
      // PanResponder helps us track touch gestures and apply updates to the position of the object.

      onStartShouldSetPanResponder: () => true, // This makes sure we want to handle the touch as a draggable gesture (returning true allows panResponder to be activated).

      onPanResponderMove: (_, gestureState) => {
        const newPosition: Position = {
          x: gestureState.moveX, // `moveX` gives the horizontal movement of the drag.
          y: gestureState.moveY, // `moveY` gives the vertical movement of the drag.
        };
        setPosition(newPosition); // Updates the position state as the user drags the object.
      },

      onPanResponderRelease: () => {
        // When the user releases the draggable object, check if it's inside the drop zone.

        if (
          position.x >= dropZone.x && // Checks if the draggable object's x position is within the drop zone's x range.
          position.x <= dropZone.x + dropZoneSize.width && // Checks if the draggable object's x position is within the drop zone's right boundary.
          position.y >= dropZone.y && // Checks if the draggable object's y position is within the drop zone's y range.
          position.y <= dropZone.y + dropZoneSize.height // Checks if the draggable object's y position is within the drop zone's bottom boundary.
        ) {
          // If the object is inside the drop zone, animate it to the center of the drop zone.

          Animated.spring(pan, {
            toValue: {
              x: dropZone.x + dropZoneSize.width / 2 - 25, // The center of the drop zone in the X direction (subtract 25 to center the object).
              y: dropZone.y + dropZoneSize.height / 2 - 25, // The center of the drop zone in the Y direction (subtract 25 to center the object).
            },
            useNativeDriver: false, // `useNativeDriver` set to false because we are animating non-native properties (position) using the JS thread.
            friction: 5, // Sets the friction (controls the "bounciness" of the spring).
          }).start(); // Starts the animation.
        } else {
          // If the object is not inside the drop zone, snap it back to its initial position.

          Animated.spring(pan, {
            toValue: initialPosition, // Animates back to the initial position.
            useNativeDriver: false, // Using JS thread for this animation.
            friction: 5, // Sets the friction for the spring.
          }).start(); // Starts the animation back to the initial position.
        }
      },
    }),
  ).current;

  return (
    // This is where the main UI structure is defined.
    <View style={styles.container}>
      {/* The Drop Zone */}
      <View
        style={[
          styles.dropZone, // The styling of the drop zone.
          {
            left: dropZone.x, // Positioning the drop zone on the screen.
            top: dropZone.y, // Positioning the drop zone on the screen.
            width: dropZoneSize.width, // Width of the drop zone.
            height: dropZoneSize.height, // Height of the drop zone.
          },
        ]}
      />

      {/* The Draggable Object */}
      <Animated.View
        style={[
          styles.draggable, // Styling for the draggable object.
          {
            transform: [{translateX: pan.x}, {translateY: pan.y}], // Bind the X and Y animated values to the draggable object.
          },
        ]}
        {...panResponder.panHandlers} // Attach the panResponder handlers to make the object draggable.
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  dropZone: {
    position: 'absolute', // Positions the drop zone in an absolute location relative to the screen.
    borderWidth: 2,
    borderColor: '#2196F3', // Color of the border around the drop zone.
    borderStyle: 'dashed', // Dashed border style.
    borderRadius: 10,
    backgroundColor: 'rgba(33, 150, 243, 0.1)', // Light blue color with some transparency.
    zIndex: 100,
  },
  draggable: {
    width: 50, // The width of the draggable object.
    height: 50, // The height of the draggable object.
    backgroundColor: '#2196F3', // Color of the draggable object.
    borderRadius: 8, // Rounded corners for the draggable object.
    position: 'absolute', // The draggable object is positioned absolutely on the screen.
    left: 50, // Starting position from the left.
    top: 50, // Starting position from the top.
  },
});

export default DragDropDemo;