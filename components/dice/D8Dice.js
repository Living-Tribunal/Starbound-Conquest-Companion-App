import React from 'react';
import { 
  Text, 
  View, 
  Image,
  Pressable, 
  StyleSheet 
} from 'react-native';
import { Colors } from '@/constants/Colors';


export default function D8Dice() {

  const [firstDice, setFirstDice] = React.useState(1);

  const randomNum = (min = 1, max = 8) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const getDiceNum = (prev) => {
      let num = randomNum();
      if (prev === num) {
        return randomNum();
      }
      return num;
  }

  const rollDiceOnTap = () => {
    setFirstDice((prev) => getDiceNum(prev));
  }

  return (
                <View style={styles.diceContainer}>
                <Pressable onPress={rollDiceOnTap}
                style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor: pressed ? Colors.goldenrod : Colors.blue_gray,
                    borderColor: pressed ? Colors.gold : Colors.slate,
                    },
                ]}> 
                  <Text
                  style={styles.rollDiceBtnText}>
                   D8
                  </Text>
                </Pressable>
                <Text style={styles.diceText}>
                    {firstDice}
                  </Text>
              </View>
          );
        }
        
        const styles = StyleSheet.create({
          container: {
            alignItems: 'center',
          }, 
          diceContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20
          },
          diceText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors.slate,
          },
          rollDiceBtnText: {
            color: Colors.white,
            fontSize: 10,
            padding: 10,
          },
          button: {
            alignItems: "center",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: Colors.slate,
        },
});