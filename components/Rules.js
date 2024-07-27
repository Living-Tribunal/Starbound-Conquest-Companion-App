
import {StyleSheet, Text, View} from 'react-native';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Rules() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container} >
                <Text style={styles.text}>Game Rules</Text>
            </View>
        </SafeAreaView>
         );
        }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.dark_gray,
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

  
  