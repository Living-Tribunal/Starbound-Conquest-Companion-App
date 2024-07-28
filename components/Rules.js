
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
export default function Rules() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden />
            <ScrollView>
                <View style={styles.container} >
                <Text style={styles.textHeader}>Movement Rules</Text>
                    <View style={styles.rulesSection}>
                        <View style={styles.textSectionContainer}>
                            <Text style={styles.textSection}>Hex Movement Basics:</Text>
                        </View>
                        <View style={styles.textBodyContainer}>
                            <Text style={styles.textBody}>1. All movement and combat actions are resolved during each player's turn.</Text>
                            <Text style={styles.textBody}>2. Each ship can move a number of hexes equal to its Move Distance each turn.</Text>
                            <Text style={styles.textBody}>3. Movement can be in any direction, but must follow the hex grid.</Text>
                        </View>
                    </View>
                    <View style={styles.rulesSection}>
                        <View style={styles.textSectionContainer}>
                            <Text style={styles.textSection}>Special Movement Orders:</Text>
                        </View>
                        <View style={styles.textBodyContainer}>
                        <Text style={{fontWeight:'bold', fontSize: 15, color: Colors.white}}>All Ahead Full:</Text>
                            <Text style={styles.textBody}>1. Roll 2d10. The result is the additional hexes the ship can move that turn.</Text>
                            <Text style={styles.textBody}>2. This order must be declared at the start of the movement phase.</Text>
                        </View>
                    </View>

                    <Text style={styles.textHeader}>Combat System</Text>
                    <View style={styles.rulesSection}>
                        <View style={styles.textSectionContainer}>
                            <Text style={styles.textSection}>Hit Roll:</Text>
                        </View>
                        <View style={styles.textBodyContainer}>
                            <Text style={styles.textBody}>1. Roll a d20</Text>
                            <Text style={styles.textBody}>2. Compare the result to the target's Threat Level.</Text>
                            <Text style={styles.textBody}>3. If your roll is equal to or higher than the target's Threat Level, you hit!</Text>
                        </View>
                    </View>
                    <View style={styles.rulesSection}>
                        <View style={styles.textSectionContainer}>
                            <Text style={styles.textSection}>Damage Roll:</Text>
                        </View>
                        <View style={styles.textBodyContainer}>
                            <Text style={styles.textBody}>1. Roll the weapon’s damage dice.</Text>
                            <Text style={styles.textBody}>2. Compare the damage roll to the target's Damage Threshold.</Text>
                            <Text style={styles.textBody}>3. If your damage roll is equal to or higher than the target's Damage Threshold, you deal damage.</Text>
                        </View>
                    </View>
                </View> 
            </ScrollView>
        </SafeAreaView>
         );
        }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.dark_gray,
    },
    text: {
        color: Colors.misty_blue,
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'aboreto',
      },
      rulesSection: {
        flex: 1,
      },
      textSection: {
        fontFamily: 'monospace',
        color: Colors.dark_gray,
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: Colors.slate,
        fontWeight: 'bold',
     },
     textSectionContainer: {
        flex: 1,
        backgroundColor: Colors.slate,
        textAlign: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        marginRight: 5,

     },
     textBody: {
        color: Colors.white,
        flex: 1,
        fontFamily: 'monospace',
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        paddingHorizontal: 10,
        fontSize: 12,
     },
     textHeader: {
        color: Colors.white,
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'aboreto',
        marginBottom: 20,
     },
     textBodyContainer: {
        flex: 1,
        backgroundColor: Colors.dark_gray,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
     }
  });

  
  