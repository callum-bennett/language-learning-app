import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator } from "react-native-paper";

import { VocabularyList, UIText } from "@components/";
import { CategoryContext } from "@navigation/RootNavigation";
import { fetchUserVocabulary } from "@store/actions/words";
import { selectUserVocabularyByCategoryId } from "@store/selectors/userVocabulary";

const CategoryWordsScreen = () => {
  const dispatch = useDispatch();
  const [dataLoaded, setDataLoaded] = useState(false);

  const { categoryId } = useContext(CategoryContext);

  const [vocabulary] = useSelector((state) => [
    selectUserVocabularyByCategoryId(state, categoryId),
  ]);

  const vocabArray = Object.values(vocabulary).filter((v) => v);

  useEffect(() => {
    (async () => {
      await dispatch(fetchUserVocabulary(categoryId));
      setDataLoaded(true);
    })();
  }, []);

  return (
    <View style={styles.screen}>
      {dataLoaded ? (
        vocabArray.length > 0 ? (
          <VocabularyList vocabulary={vocabArray} />
        ) : (
          <UIText>You haven't learned any words yet!</UIText>
        )
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CategoryWordsScreen;
