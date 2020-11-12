import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { AntDesign as Icon } from "@expo/vector-icons";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";

import AppText from "../AppText";
import * as Colors from "../../constants/Colors";

const WordCard = (props) => {
  const AnimationRef = useRef(null);
  const [listened, setListened] = useState(false);

  const { word } = props;

  const handleAudioPress = () => {
    //@ todo textToSpeech
    //@ todo make sure volume is turned up
    if (AnimationRef) {
      AnimationRef.current.pulse();
    }
    props.onComplete(word.id);
    setListened(true);
  };

  const handleSwipe = (dir) => {
    if (!listened && dir === swipeDirections.SWIPE_LEFT) {
      if (AnimationRef) {
        AnimationRef.current.bounce();
      }
    }
  };

  return (
    <GestureRecognizer
      onSwipe={(direction, state) => handleSwipe(direction, state)}
      style={styles.card}
    >
      <View>
        <Image source={{ uri: word.imageUrl }} style={styles.image} />
      </View>

      <AppText style={styles.word}>{word.name}</AppText>
      <AppText style={styles.translation}>({word.translation})</AppText>
      <Animatable.View ref={AnimationRef} direction="alternate">
        <TouchableWithoutFeedback
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          onPress={handleAudioPress}
        >
          <View>
            <Icon style={styles.audio} name="sound" size={24} />
          </View>
        </TouchableWithoutFeedback>
      </Animatable.View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 200,
    marginBottom: 20,
  },
  card: {
    height: "100%",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  word: {
    fontSize: 24,
  },
  translation: {
    fontStyle: "italic",
  },
  audio: {
    color: Colors.primary,
    marginTop: 15,
  },
});

export default WordCard;
