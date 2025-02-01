import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Image } from "react-native";

export default function API() {
  const shipsURL = "https://starboundconquest.com/load-ship-data";

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const getShips = () => {
    setIsLoading(true);
    fetch(shipsURL)
      .then((response) => response.json())
      .then((json) => setData(json.ships))
      .catch((error) => console.error("Error:", error))
      .finally(() => setIsLoading(false));
  };

  return (
    <View>
        <Button title="Get Ship Data" 
    onPress={getShips} color="green" />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => {
            return (
              <View style={styles.item}>
                <Text style={styles.title}>
                  {item.shipId}, {item.type}, {item.user}
                </Text>
                {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <Text>No Image Available</Text>
              )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
    },
    item: {
      padding: 10,
      backgroundColor: "#f9c23c",
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 24,
    },
    image: {
        width: 200,  // Adjust to preferred size
        height: 150,
        resizeMode: "cover",
        marginTop: 10,
        borderRadius: 8,
      },
  });
