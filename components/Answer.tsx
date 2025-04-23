import MathJaxComponent from "../components/MathJaxComponent.tsx";
// import { TestpageContext } from "/Users/Ananya/Documents/react_native/studentproject/android/store/testpage-store-tsx";
import { Fragment, useContext, useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native"
import { TestpageContext } from "../store/testpage-store.tsx";
// import CheckBox from "@react-native-community/checkbox";
import BouncyCheckbox from "react-native-bouncy-checkbox";

function Question_text(props: {
  questionindex: number,
}) {
  const activeTestContext = useContext(TestpageContext);
  let question =
    activeTestContext?.activetest?.data[props.questionindex]?.descr;

  return (
    question !== undefined && (
      <View style={styles.question_item}>
        <Text> Question number: {props.questionindex + 1}</Text>
        <MathJaxComponent>{question}</MathJaxComponent>
      </View >
    )
  );
}

function Answer(props: {
  questionindex: number,
  onuserselectionchange: (questionindex: number, answewrindex: number, checked: boolean) => void,
  userselection: (number | undefined)[],
  usersaved: (number | undefined)[],
}) {
  const activeTestContext = useContext(TestpageContext);
  const answers =
    activeTestContext?.activetest?.data[props.questionindex]?.answers;
  return (
    answers !== undefined && (
      <View>
        {answers.map((answer: { id: number, descr: string }, index: number) => {
          return (
            <View key={answer.id} style={styles.answer_item}>
              <BouncyCheckbox
                isChecked={(props.userselection[props.questionindex] ?? props.usersaved[props.questionindex]) === index}
                fillColor="green"
                onPress={(checked) => {
                  props.onuserselectionchange(props.questionindex, index, checked);
                }}
              />
              <Text>
                <MathJaxComponent>{answer.descr}</MathJaxComponent>
              </Text>
            </View>
          );
        })}
      </View>
    )
  );
}

const styles = StyleSheet.create({
  answer_item: {
    // backgroundColor: "gray",
    // borderWidth: 1,
    // borderColor: 'pink',
    // minHeight: 30,
    // flex: 1,
    flexDirection: "row",
    marginBottom: 5,
  },
  question_item: {
    // backgroundColor: 'blue',
    // borderWidth: 1,
    // borderColor: 'darkblue',
    marginBottom: 5,
    // minHeight: 200,
    // flex: 1,
  },
});

export default Answer;
export { Question_text };
