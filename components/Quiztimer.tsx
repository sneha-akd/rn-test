import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
// import { TestpageContext } from './store/testpage-store'; // Import the context
// import { useNavigation } from '@react-navigation/native'; // React Navigation for navigation
import { TestpageContext } from '../store/testpage-store';

// Timer component
function Quiztimer() {
  const testPageContext = useContext(TestpageContext);
  if (testPageContext === null) return null;

  const { activetest } = testPageContext;

  // State to store the remaining time in seconds
  const [timeLeft, setTimeLeft] = useState(0);
  // const navigation = useNavigation();

  // Calculate the initial time difference when the component mounts
  useEffect(() => {
    if (activetest && activetest.schedule_end) {
      const endTime = new Date(activetest.schedule_end).getTime();
      const currentTime = Date.now();
      const initialTimeLeft = Math.max(0, Math.floor((endTime - currentTime) / 1000)); // Convert to seconds
      setTimeLeft(initialTimeLeft);

      // Set up the interval to update the timer every second
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const newTimeLeft = Math.max(0, Math.floor((endTime - currentTime) / 1000));
        setTimeLeft(newTimeLeft);

        // If time is up, clear the interval and navigate
        if (newTimeLeft <= 0) {
          clearInterval(intervalId);
          // navigation.navigate('Studentreport'); // Navigate to "Studentreport" screen
          console.log("got to report");
        }
      }, 1000);

      // Cleanup interval on component unmount or when the test changes
      return () => clearInterval(intervalId);
    }
  }, [activetest]);

  // Format time from seconds to hh:mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Define color styles for the timer
  const getTimerColor = () => {
    if (timeLeft <= 10) {
      return { color: 'red', fontWeight: 'bold' };
    } else if (
      activetest &&
      activetest.schedule_end &&
      timeLeft <= Math.floor(
        (Date.parse(activetest.schedule_end) - Date.now()) / 1000
      ) * 0.25
    ) {
      return { color: 'orange' };
    }
    return { color: 'black' };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        Quiz Timer {formatTime(timeLeft)}
      </Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Quiztimer;