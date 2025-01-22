
import React, { useState } from "react";

import Animated, {
    interpolateColor,
    measure,
    useAnimatedRef,
    useAnimatedStyle,
    useSharedValue,
    withDecay,
    withTiming,
    withSequence,
    withSpring
  } from 'react-native-reanimated';
import { StyleSheet } from "react-native";
  
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SimultaneousGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/gestureComposition";

interface DraggableCardProps {
    children: React.ReactNode;
    initialPostion?: {x: number; y: number};
    onDragEnd?: (position: {x: number; y: number}) => void;
    style?: any;
    zIndex?: number;
    onPress?: () => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
    children,
    initialPostion = {x:0, y:0},
    style,
    zIndex = 1
  
}) => {
    const scale = useSharedValue(1)
    const offset = useSharedValue(initialPostion)
    const start = useSharedValue(initialPostion)
    const isDragging = useSharedValue(false)
    const isPressed = useSharedValue(false)
    const beenPressed = useSharedValue(false)
    const zIndexValue = useSharedValue(zIndex)
    const lastTap = useSharedValue(0);
  
    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: offset.value.x },
                { translateY: offset.value.y },
                {scale: scale.value}
            ],
            zIndex: (isDragging.value || isPressed.value)? 1000 + zIndexValue.value: zIndexValue.value
        };
    });

    const dragGesture = Gesture.Pan()
        .onStart(() => {              
        isDragging.value = true;  
    })
        .onUpdate((e) => {
            offset.value = {
                x: e.translationX + start.value.x,
                y: e.translationY + start.value.y
            };
        })
        .onEnd(() => {
            start.value = {
                x: offset.value.x,
                y: offset.value.y,
            };
            isDragging.value = false;
        });
    
  
    const longPressGesture = Gesture.LongPress()
    .onStart(()=>{
        isPressed.value = true
    })
    .onEnd((e, success) => {
            isPressed.value = false;
            // beenPressed.value = true;

          });
    const singleTapGesture = Gesture.Tap()
    .onStart(() => {
        zIndexValue.value = zIndex - 1
    });

// 
const doubleTap = Gesture.Tap()
.numberOfTaps(2)
.onStart(() => {
    zIndexValue.value = zIndex + 1
});
   
        //   const composedGesture = Gesture.Race(
        //     dragGesture,
        //     longPressGesture
        //   )
  
    const composedGesture = Gesture.Race(
        dragGesture,
        Gesture.Exclusive(longPressGesture, doubleTap, singleTapGesture)
    );
    return (
        <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.container, style, animatedStyles]}>
                {children}
            </Animated.View>
        </GestureDetector>
    )
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute'
    },
});

const doubleTap = Gesture.Tap()
//           .maxDuration(250)
//           .numberOfTaps(2)
//           .onStart(() => {
//               try {
//                   'worklet';
//                   const now = Date.now();
//                   if (now - lastTap.value < 300) {
//                       // Double tap detected
//                       scale.value = withSequence(
//                           withTiming(1.1, { duration: 100 }),
//                           withTiming(1, { duration: 100 })
//                       );
//                       zIndexValue.value = withTiming(zIndexValue.value + 100, {
//                           duration: 100
//                       });
//                   }
//                   lastTap.value = now;
//               } catch (error) {
//                   console.log('Tap gesture error:', error);
//               }
//           });