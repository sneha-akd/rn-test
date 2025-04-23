import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';

type ButtonsProps = {
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  isFirst: boolean;
  isLast: boolean;
  onClear: () => void;
  onsaveNext: () => void;
  onsavereview: () => void;
  onreviewnext: () => void;
};

const Buttons: React.FC<ButtonsProps> = ({
  onNext,
  onPrev,
  onFinish,
  isFirst,
  isLast,
  onClear,
  onsaveNext,
  onsavereview,
  onreviewnext,
}) => {
  return (<View>
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.success]} onPress={onsaveNext}>
        <Text style={styles.buttonText}>Save & Next</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.warning]} onPress={onsavereview}>
        <Text style={styles.buttonText}>Save & Mark For Review</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.info]} onPress={onreviewnext}>
        <Text style={styles.buttonText}>Mark For Review & Next</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.light]} onPress={onClear}>
        <Text style={styles.buttonText}>Clear Response</Text>
      </TouchableOpacity>


    </View>
    <View style={styles.container}>

      <TouchableOpacity
        style={[styles.button, styles.outlinePrimary]}
        onPress={onPrev}
        disabled={isFirst}
      >
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.outlineSuccess]}
        onPress={onNext}
        disabled={isLast}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.outlineDanger]}
        onPress={onFinish}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  success: {
    backgroundColor: '#28a745',
  },
  warning: {
    backgroundColor: '#ffc107',
  },
  info: {
    backgroundColor: '#00bfff',
  },
  light: {
    backgroundColor: '#6c757d',
  },
  outlinePrimary: {
    borderWidth: 1,
    borderColor: '#007bff',
    backgroundColor: '#007bff',
  },
  outlineSuccess: {
    borderWidth: 1,
    borderColor: '#28a745',
    backgroundColor: '#28a745',
  },
  outlineDanger: {
    borderWidth: 1,
    borderColor: '#dc3545',
    backgroundColor: "#dc3545"
  },
});

export default Buttons;