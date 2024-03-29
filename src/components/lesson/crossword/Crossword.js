import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
} from "react-native";
import * as Animatable from "react-native-animatable";

import Clues from "./Clues";
import Grid from "./Grid";

import Button from "@components/ui/Button";
import Text from "@components/ui/Text";

import BottomContainer from "@components/lesson/BottomContainer";
import * as Colors from "@constants/Colors";
import { selectCompleteCount } from "@store/selectors/crossword";
import {
  clearActiveAnswer,
  startCrossword,
  updateAnswer,
  markAnswerCorrect,
  insertAnswer,
} from "@store/actions/crossword";
import {
  arrayToObjectByKey,
  playSound,
  FEEDBACK_NEGATIVE,
  FEEDBACK_POSITIVE,
} from "@utils";

const Crossword = (props) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const answerInputRef = useRef(null);
  const animationRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [inputLength, setInputLength] = useState(0);
  const cellDimension = props.config.width >= 10 ? 30 : 35;

  let gridOffsetY = 0;

  const [crossword, completedCount] = useSelector((state) => [
    state.crossword,
    selectCompleteCount(state.crossword),
  ]);

  const { activeAnswerText, answers, grid, initialized } = crossword;
  const activeAnswer = answers[activeAnswerText];
  const wordsById = arrayToObjectByKey(props.words);
  const wordsByText = arrayToObjectByKey(props.words, "name");

  useEffect(() => {
    dispatch(startCrossword(props.config));
    if (props.responses) {
      Object.keys(props.responses).forEach((wordId) => {
        const response = props.responses[wordId];
        if (response.correct) {
          dispatch(insertAnswer(wordsById[wordId].name));
        }
      });
    }
  }, [0]);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", scrollToAnswer);
    Keyboard.addListener("keyboardDidHide", handleTouchAway);
  });

  const scrollToAnswer = () => {
    if (activeAnswer) {
      const index = Math.floor(activeAnswer.cells.length / 2);
      const cellOffsetY = activeAnswer.cells[index].y * cellDimension;

      scrollViewRef.current.scrollTo({
        x: 0,
        y: gridOffsetY + 30 + cellOffsetY,
        animated: true,
      });
      answerInputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (activeAnswer) {
      scrollToAnswer();
      const emptyCells = activeAnswer.cells.filter(
        ({ x, y }) => !grid[y - 1][x - 1].locked
      );
      setInputLength(emptyCells.length);
    } else {
      setInputValue("");
    }
  }, [activeAnswer]);

  const handleContinue = () => {
    props.onComplete();
  };

  const handleTouchAway = () => {
    Keyboard.dismiss();
    setInputValue("");
    dispatch(clearActiveAnswer());
  };

  const handleChange = (e) => {
    let value = e.nativeEvent.text.toLowerCase();
    if (!/^[a-zA-ZÁÉÍÑÓÚÜáéíñóúü]*$/.test(value)) {
      return;
    }

    setInputValue(value);
    dispatch(updateAnswer(value));
  };

  const handleConfirm = () => {
    const isCorrect = activeAnswer.currentGuess === activeAnswerText;
    if (isCorrect) {
      playSound(FEEDBACK_POSITIVE);
      dispatch(markAnswerCorrect(activeAnswerText));
    } else {
      animationRef.current?.shake();
      playSound(FEEDBACK_NEGATIVE);
    }
    props.onSubmitAnswer(
      wordsByText[activeAnswerText].id,
      inputValue,
      isCorrect
    );
  };

  const handlePressHint = () => {
    playSound({ uri: wordsByText[activeAnswerText].soundUrl });
  };

  return initialized ? (
    <View>
      <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback onPress={handleTouchAway}>
          <View style={styles.container}>
            <Clues words={props.words} />
            <Animatable.View
              ref={animationRef}
              onLayout={(event) => {
                gridOffsetY = event.nativeEvent.layout.y;
              }}
            >
              <Grid grid={grid} cellDimension={cellDimension} />
            </Animatable.View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      {activeAnswer ? (
        <BottomContainer
          items={[
            <>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
                blurOnSubmit={false}
                onChange={handleChange}
                ref={answerInputRef}
                style={styles.answerInput}
                maxLength={inputLength}
                value={inputValue}
                onSubmitEditing={handleConfirm}
              />
              <Button
                variant="small"
                onPress={handlePressHint}
                style={{
                  button: styles.hintButton,
                }}
              >
                Hint
              </Button>
            </>,
            <Text style={styles.clue}>
              {wordsByText[activeAnswerText].translation}
            </Text>,
            <Button variant="small" onPress={handleConfirm}>
              Submit
            </Button>,
          ]}
        />
      ) : (
        <BottomContainer
          items={[
            <></>,
            <Text>
              {`Completed: ${completedCount} / ${props.words.length}`}
            </Text>,
            <View>
              {completedCount === props.words.length && (
                <Button variant="small" onPress={handleContinue}>
                  Continue
                </Button>
              )}
            </View>,
          ]}
        />
      )}
    </View>
  ) : (
    <Text>Loading</Text>
  );
};

const styles = StyleSheet.create({
  answerInput: {
    display: "none",
  },
  hintButton: {
    backgroundColor: Colors.accent,
    width: "auto",
  },
  hintOption: {
    color: Colors.primary,
    fontSize: 18,
    marginVertical: 8,
  },
  clue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
    marginBottom: 50,
    paddingBottom: 20,
  },
});

export default Crossword;
