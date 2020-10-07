import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import Cell from "./Cell";

const Grid = (props) => {
  const activeCell = useSelector(({ crossword }) => crossword.activeCell);
  const gridWidth = props.grid[0].length * props.cellDimension;

  const isActiveCell = (row, col) => {
    return activeCell && activeCell.y === row && activeCell.x === col;
  };

  return (
    <View style={{ ...styles.grid, width: gridWidth }}>
      {props.grid.map((row, i) => {
        return row.map((cellData, j) => {
          return (
            <Cell
              active={isActiveCell(i + 1, j + 1)}
              empty={!cellData}
              answers={cellData ? cellData.answers : null}
              value={cellData ? cellData.value : null}
              number={cellData ? cellData.number : null}
              cellDimension={props.cellDimension}
              key={`${i}-${j}`}
            />
          );
        });
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: "100%",
  },
});

export default Grid;
