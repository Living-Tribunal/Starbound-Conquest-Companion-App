<View style={styles.shipContainer}>
            {Object.entries(ship).map(([shipClass, { type, value }], index) => (
              <View style={styles.shipItem} key={shipClass}>
                <TouchableOpacity
                  style={styles.touchable}
                  onPress={() => {
                    navigation.navigate("Fleet", { shipClass });
                  }}
                >
                  <Image
                    source={require("../../assets/images/6966409.png")}
                    style={styles.image}
                  />
                  <View
                    style={{
                      backgroundColor: Colors.hudDarker,
                      width: "100%",
                      height: "40%",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    <Text style={styles.typeText}>{type}</Text>
                  </View>

                  <Text style={styles.valueStat}>{value}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>