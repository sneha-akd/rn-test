import { useState, useEffect } from "react";
import { ActiveTestType, TestpageContext } from "../store/testpage-store";
import Answer, { Question_text } from "../components/Answer";
import Buttons from "../components/Buttons";
import Quiztimer from "../components/Quiztimer.tsx";
// import { useNavigation } from "@react-navigation/native"; // Use navigation for React Native
// import Smallbuttons from "../components/Buttons.tsx";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { django_server_url } from "../store/app_consts.ts";
import Studentreport from "./Studentreport.tsx";
import { useNavigation } from '@react-navigation/native';




function Test(props: {
  userid: number | undefined;
  testid: number | undefined;
  scheduleid: number | undefined;
  setfinished: (_: boolean) => void;
}) {
  const [activetest, setactivetest] = useState<ActiveTestType | undefined>(undefined);
  const [questionindex, setquestionindex1] = useState(0);
  const [userselection, setuserselection] = useState<(number | undefined)[]>([]);
  const [userreview, setuserreview] = useState<(boolean | undefined)[]>([]);
  const [usersaved, setusersaved] = useState<(number | undefined)[]>([]);
  const [seen, setseen] = useState<(boolean | undefined)[]>([]);
  // const navigation = useNavigation(); // React Native Navigation

  const exported_user_id = 2;

  if (props.userid === undefined) return (
    <View style={styles.errorContainer}>
      <Text>Please select</Text>
      <TouchableOpacity onPress={() => {
        // navigation.navigate("Home");
        console.log("go home pressed");
      }}>
        <Text style={styles.linkText}>Home</Text>
      </TouchableOpacity>
      <Text> and login to continue</Text>
    </View>
  );

  // RESPONSIBILITY FUNCTIONS
  const manageuserselections = (questionindex: number, answerindex: number, checked: boolean) => {
    console.log("manageuserselections", questionindex, answerindex, checked);
    setuserselection((olddata) => {
      let newdata = [...olddata];
      newdata[questionindex] = checked ? answerindex : undefined;
      return newdata;
    });
  };

  const manageseen = (questionindex: number) => {
    setseen((olddata) => {
      let newdata = [...olddata];
      newdata[questionindex] = true;
      return newdata;
    });
  };

  const managesavedanswer = (questionindex: number, answerindex: number | undefined) => {
    setusersaved((olddata) => {
      let newdata = [...olddata];
      newdata[questionindex] = answerindex;
      return newdata;
    });
  };

  const managequestionnavigation = (newquestionindex: number) => {
    if (activetest?.data.length && newquestionindex < activetest.data.length - 1 && newquestionindex >= 0) {
      manageseen(questionindex);
      setquestionindex1(newquestionindex);
    }
  };

  const postanswer = async (answerindex: number | undefined, review: boolean) => {
    try {
      const answer_data = {
        schedule_id: activetest?.schedule_id,
        user_id: exported_user_id,
        test_id: activetest?.test_id,
        data: [
          {
            review: review,
            answers: answerindex !== undefined ? [activetest?.data[questionindex]?.answers[answerindex]?.id] : [],
            question: activetest?.data[questionindex]?.id,
          },
        ],
      };

      const response = await fetch(`${django_server_url}/views/response/`, {
        method: "POST",
        body: JSON.stringify(answer_data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log(await response.text());
      }
    } catch (error) {
      console.log("Fetch Error", error);
    }
  };

  const postAllAnswers = async () => {
    let report_data = [];
    for (let qindex = 0; qindex < (activetest?.data.length ?? 0); ++qindex) {
      const questionid = activetest?.data[qindex]?.id;
      const selectedAnswerIndex = userselection[qindex];

      const answers =
        selectedAnswerIndex !== undefined
          ? [activetest?.data[qindex]?.answers[selectedAnswerIndex]?.id]
          : [];

      let this_report_item = {
        question: questionid,
        answers,
      };
      report_data.push(this_report_item);
    }

    try {
      const answer_data1 = {
        schedule_id: activetest?.schedule_id,
        user_id: exported_user_id,
        test_id: activetest?.test_id,
        data: report_data,
      };

      const response = await fetch(`${django_server_url}/views/test_response/`, {
        method: "POST",
        body: JSON.stringify(answer_data1),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log(await response.text());
      }
    } catch (error) {
      console.log("Fetch Error", error);
    }
  };

  const userselectreview = (questionindex: number, review: boolean | undefined) => {
    setuserreview((olddata) => {
      let newdata = [...olddata];
      newdata[questionindex] = review;
      return newdata;
    });
  };

  const changeclear = () => {
    manageuserselections(questionindex, 0, false);
    managesavedanswer(questionindex, undefined);
    userselectreview(questionindex, undefined);
    postanswer(undefined, false);
  };

  const handlesavenext = () => {
    const answerindex: number | undefined = userselection[questionindex];
    managesavedanswer(questionindex, answerindex);
    postanswer(answerindex, false);
    managequestionnavigation(questionindex + 1);
    userselectreview(questionindex, undefined);
  };

  const handlesavemarkreview = () => {
    const answerindex: number | undefined = userselection[questionindex];
    managesavedanswer(questionindex, answerindex);
    postanswer(answerindex, true);
    userselectreview(questionindex, true);
  };

  const handlereviewandnext = () => {
    const answerindex: number | undefined = usersaved[questionindex];
    postanswer(answerindex, true);
    userselectreview(questionindex, true);
    managequestionnavigation(questionindex + 1);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handlenext = () => {
    manageuserselections(questionindex, 0, false);
    managequestionnavigation(questionindex + 1);
  };

  const handleprev = () => {
    manageuserselections(questionindex, 0, false);
    managequestionnavigation(questionindex - 1);
  };

  const handleuserselectionchange = (questionindex: number, answerindex: number, checked: boolean) => {
    manageuserselections(questionindex, answerindex, checked);
  };


  const changefinish = async () => {
    const navigation = useNavigation();
    postAllAnswers();
    // setactivetest(undefined);
    props.setfinished(true);


  };

  const fetchInfo = () => {
    const url = `${django_server_url}/views/test_view/?user_id=${props.userid}&test_id=${props.testid}&schedule_id=${props.scheduleid}`;
    return fetch(url)
      .then((res) => res.json())
      .catch((e) => {
        console.log("Error while fetching test_data", e);
      })
      .then((d) => {
        if (d !== undefined) {
          setactivetest(d);
        }
      });
  };

  return activetest && (
    <TestpageContext.Provider value={{ activetest }}>
      <View style={styles.container}>
        <Quiztimer />
        <View style={styles.testContent}>
          <View style={styles.questionContainer}>
            <Question_text questionindex={questionindex} />
            <Answer
              userselection={userselection}
              usersaved={usersaved}
              onuserselectionchange={handleuserselectionchange}
              questionindex={questionindex}
            />
            <Buttons
              onNext={handlenext}
              onPrev={handleprev}
              onFinish={changefinish}
              isFirst={questionindex === 0}
              isLast={activetest && activetest.data && questionindex === activetest.data.length - 1}
              onsaveNext={handlesavenext}
              onClear={changeclear}
              onsavereview={handlesavemarkreview}
              onreviewnext={handlereviewandnext}
            />
          </View>
          {/* <Smallbuttons
            usersaved={usersaved}
            userreview={userreview}
            seen={seen}
            onClickHandler={managequestionnavigation}
          /> */}
        </View>
      </View>
    </TestpageContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
  },
  testContent: {
    // flex: 1,
  },
  questionContainer: {
    marginBottom: 20,
  },
  errorContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default Test;