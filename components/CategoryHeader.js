import React from "react";
import { StyleSheet, View } from "react-native";

import UIProgressDonut from "./UI/UIProgressDonut";
import CategoryImageWithTitle from "./CategoryImageWithTitle";

const CategoryHeader = (props) => {
  return (
    <View>
      <View style={styles.progressContainer}>
        <UIProgressDonut progress={props.progress} />
      </View>
      <View style={styles.imageContainer}>
        <CategoryImageWithTitle category={props.category} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 200,
    width: "100%",
  },
  progressContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 20,
  },
});

export default CategoryHeader;
