/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Test from "./components/Test"
import Studentreport from "./components/Studentreport"
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

type RootStackParamList = {
  Test: undefined;
  Studentreport: {
    user_id: number;
  };
}

const TestWrapper = (props: NativeStackScreenProps<RootStackParamList, "Test">) => {
  return <View>
    <TouchableOpacity onPress={() => {
      props.navigation.navigate('Studentreport', {
        user_id: 2,
      });
    }}><Text>Go to Reports</Text></TouchableOpacity>
    <Test userid={2} testid={83} scheduleid={919} setfinished={function (_: boolean): void {
      throw new Error('Function not implemented.');
    }} />
  </View>
}

const StudentReportWrapper = (props: NativeStackScreenProps<RootStackParamList, "Studentreport">) => {
  return <Studentreport user_id={props.route.params.user_id} />
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Test" component={TestWrapper} />
        <Stack.Screen name="Studentreport" component={StudentReportWrapper} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}


export default App;
