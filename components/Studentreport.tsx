import { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { django_server_url } from "../store/app_consts";
//import { useNavigation } from "@react-navigation/native"; // Use react-navigation for routing in React Native

type MultiReportResponseType = {
  data: {
    attempted: number;
    correct: number;
    incorrect: number;
    total: number;
    unattempted: number;
    title: string;
    schedule_id: number;
  }[];
};

// props: { userid: number | undefined }
function StudentReport(props) {
  const [reports, setReports] = useState<MultiReportResponseType | null>(null);
  const [activeReportIndex, setActiveReportIndex] = useState<number | null>(null);



  const fetchInfo1 = () => {
    fetch(`${django_server_url}/views/reports/?user_id=${props.userid}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText} (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setReports(data);
      })
      .catch((e) => {
        console.error("Error fetching data:", e);
      });
  };

  useEffect(() => {
    if (props.userid) {
      fetchInfo1();
    }
  }, [props.userid]);

  const handleDelete = async (schedule_id: number, index: number) => {
    try {
      if (reports) {
        const updatedReports = { ...reports };
        updatedReports.data = updatedReports.data.filter((_, i) => i !== index);
        setReports(updatedReports);
        setActiveReportIndex(null);
      }
      const response = await fetch(
        `${django_server_url}/views/report/?user_id=${props.userid}&schedule_id=${schedule_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        console.log(await response.text());
      }
    } catch (error) {
      console.log("Fetch Error", error);
    }
  };

  if (props.userid === undefined) {
    return (
      <View style={styles.centered}>
        <Text>Please select </Text>
        <TouchableOpacity onPress={() => (" ")}>
          <Text style={styles.link}>Home</Text>
        </TouchableOpacity>
        <Text> and login to continue</Text>
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Quiz Final Result</Text>

      <View style={styles.reportList}>
        {reports?.data.map((report, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Final Report</Text>
              <Text style={styles.cardText}>{report.title}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => setActiveReportIndex(index)}
              >
                <Text style={styles.buttonText}>Show Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(report.schedule_id, index)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {reports && activeReportIndex !== null ? (
        <View style={styles.details}>
          <Text>Attempted Questions: {reports.data[activeReportIndex]?.attempted}</Text>
          <Text>Correct Answers: {reports.data[activeReportIndex]?.correct}</Text>
          <Text>Incorrect Answers: {reports.data[activeReportIndex]?.incorrect}</Text>
          <Text>Total Questions: {reports.data[activeReportIndex]?.total}</Text>
          <Text>Unattempted Questions: {reports.data[activeReportIndex]?.unattempted}</Text>
        </View>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  reportList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: "70%",
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#f8d7da",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  details: {
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

export default StudentReport;