import React from 'react';
import { 
  Text, 
  View, 
  Image,
  Pressable, 
  StyleSheet 
} from 'react-native';
import { Colors } from '@/constants/Colors';


export default function TD3Dice() {

  const [firstDice, setFirstDice] = React.useState(2);

  const randomNum = (min = 2, max = 3*2) => Math.floor(Math.random() * (max - min + 1)) + min;
  
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
    color: Colors.white,
  },
  button: {
    width: 175,
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 2,
    borderColor: Colors.slate,
},
});