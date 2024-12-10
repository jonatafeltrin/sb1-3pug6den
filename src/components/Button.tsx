import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

type ButtonProps = TouchableOpacityProps & {
  text?: string;
};

export function Button({ ...props }: ButtonProps) {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.button} {...props}>
      <Text style={styles.textButton}>{props.children || props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    margin: 16,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#2E3DE0',
    bottom: 0,
  },

  textButton: {
    color: '#fff',
  },
});
