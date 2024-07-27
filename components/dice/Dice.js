import React from 'react';
import { 
  Text, 
  View, 
  Image,
  Pressable, 
  StyleSheet 
} from 'react-native';
import { Colors } from '@/constants/Colors';

const diceImages = {
  1: require('../../assets/icons/fighter.png'),
  2: require('../../assets/icons/destroyer.png'),
  3: require('../../assets/icons/lcruiser.png'),
  4: require('../../assets/icons/hcruiser.png'),
  5: require('../../assets/icons/battleship.png'),
  6: require('../../assets/icons/dreadnought.png'),
};

export default function Dice() {

  const [firstDice, setFirstDice] = React.useState(2);

  const randomNum = (min = 1, max = 4) => Math.floor(Math.random() * (max - min + 1)) + min;
  
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
          <Image
            style={styles.diceImage}
            source={diceImages[firstDice]}
          />
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
    margin: 20,
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
  },
  diceImage: {
    marginHorizontal: 10,
  },
  lite: {
    opacity: 0.95,
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