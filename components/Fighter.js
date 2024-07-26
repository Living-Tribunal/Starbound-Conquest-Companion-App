
import {StyleSheet, Text, View} from 'react-native';
import { Colors } from '@/constants/Colors';
export default function Fighter() {
    return (
      <View style={styles.container} >
        <Text style={styles.text}>Fighter</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
        color: Colors.misty_blue,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'aboreto',
      },
  });

  
  