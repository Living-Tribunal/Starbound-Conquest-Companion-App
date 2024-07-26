
import {StyleSheet, Text, View} from 'react-native';
import { Colors } from '@/constants/Colors';
export default function Dreadnought() {
    return (
      <View style={styles.container} >
        <Text style={styles.text}>Dreadnought</Text>
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

  
  