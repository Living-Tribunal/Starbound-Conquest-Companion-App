import React from 'react';
import { 
  Text, 
  View, 
  Pressable, 
  StyleSheet 
} from 'react-native';
import { Colors } from '@/constants/Colors';


export default function D20Dice() {

  const [firstDice, setFirstDice] = React.useState(1);

  const randomNum = (min = 1, max = 20) => Math.floor(Math.random() * (max - min + 1)) + min;
  
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
      <View style={styles.container}>
        <View style={styles.diceContainer}>
        <Text style={styles.diceText}>
            {firstDice}
          </Text>
        </View>
        <Pressable onPress={rollDiceOnTap}>
          <Text
          style={styles.rollDiceBtnText}
          selectable={false}
          >
            Roll the dice
          </Text>
        </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  imageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  diceContainer: {
    margin: 5,
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
  },
  diceText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.slate,
  },
  rollDiceBtnText: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: Colors.slate,
    fontSize: 10,
    color: Colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
    backgroundColor: Colors.dark_gray
  },
});