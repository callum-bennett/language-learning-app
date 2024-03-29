import React, { memo, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Card from "@components/ui/Card";
import Text from "@components/ui/Text";

import * as Colors from "@constants/Colors";

function MultipleChoiceOption(props) {
  const [selected, setSelected] = useState(false);
  const { image, isCorrect, locked, onChoose, value } = props;
  const handlePress = () => {
    if (!locked) {
      setSelected(true);
      onChoose(isCorrect, value);
    }
  };

  const containerStyle = [styles.container];
  if (selected) {
    containerStyle.push({
      backgroundColor: isCorrect ? Colors.correctBg : Colors.wrongBg,
    });
  }

  const TouchableComponent = props.locked
    ? TouchableWithoutFeedback
    : TouchableNativeFeedback;

  return (
    <Card style={containerStyle}>
      <TouchableComponent onPress={handlePress}>
        <View style={styles.content}>
          <Image style={styles.image} source={{ uri: image }} />
          <Text style={{ fontSize: 20 }}>{value}</Text>
        </View>
      </TouchableComponent>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  image: {
    display: "flex",
    borderRadius: 4,
    marginBottom: 10,
    height: "100%",
    flex: 1,
    width: "100%",
  },
});

export default memo((props) => <MultipleChoiceOption {...props} />);
