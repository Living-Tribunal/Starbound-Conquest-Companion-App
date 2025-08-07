import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { WeaponColors, weaponDescriptions } from "@/constants/WeaponColors";
import { ShipAttributes } from "../../constants/ShipAttributes.js";

export default function ShipInfo({
  selectedShip,
  shipPressed,
  shipActionCountTaken,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isShowWeaponInfo, setIsShowWeaponInfo] = useState(false);
  const [isWeapon, setIsWeapon] = useState(false);
  const shipSpecialOrdersIcon = selectedShip
    ? ShipAttributes[selectedShip.type]
    : null;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: shipPressed ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [shipPressed]);

  return (
    <>
      <Animated.View
        style={[
          styles.shipInfoContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.shipInfo}>Ship: {selectedShip.shipId}</Text>
        <Text
          style={[
            styles.shipInfo,
            {
              color: selectedShip.bonuses.inFighterRangeBonus
                ? Colors.green_toggle
                : Colors.hud,
            },
          ]}
        >
          HP:{" "}
          {selectedShip.hp ?? 0 + selectedShip.bonuses.inFighterRangeBonus ?? 0}{" "}
          / {selectedShip.maxHP ?? 0}
        </Text>
        <Text style={styles.shipInfo}>Type: {selectedShip.type}</Text>
        <Text style={styles.shipInfo}>
          Rotation: {selectedShip?.rotation?.__getValue()?.toFixed(0) ?? 0}°
        </Text>
        {selectedShip.type === "Carrier" && (
          <>
            <Text style={[styles.shipInfo]}>
              Protecting: {selectedShip.numberOfShipsProtecting}
            </Text>
            <Text style={[styles.shipInfo]}>Ship Color</Text>
            <View
              style={{
                width: 100,
                height: 20,
                backgroundColor: selectedShip.color,
                borderRadius: 5,
                marginTop: 5,
              }}
            />
          </>
        )}
        <Text style={styles.shipInfo}>Weapons:</Text>
        {selectedShip?.weaponType?.map((weapon, index) => {
          const ionCannon = weapon === "Ion Particle Beam";
          const ionCannonIconStatus =
            weapon === "Ion Particle Beam" &&
            selectedShip.weaponStatus?.["Ion Particle Beam"] === false;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setIsShowWeaponInfo(!isShowWeaponInfo), setIsWeapon(weapon);
              }}
            >
              <View style={ionCannon ? styles.ionCannon : styles.shipInfo2}>
                <Text
                  style={[
                    styles.shipInfo,
                    {
                      borderRadius: 5,
                      padding: 2,
                      margin: 2,
                      fontFamily: "LeagueSpartan-Bold",
                      fontSize: 9,
                      textAlign: "center",
                      color: Colors.dark_gray,
                      backgroundColor: WeaponColors[weapon] || Colors.hud,
                    },
                  ]}
                >
                  {weapon}
                </Text>
                {ionCannon && (
                  <Image
                    source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/starbound-conquest-a1adc.firebasestorage.app/o/maneuverIcons%2Fsinusoidal-beam.png?alt=media&token=96d76ac5-5426-4bbb-835c-f541f7ba3023",
                    }}
                    style={{
                      width: 10,
                      height: 10,
                      zIndex: 1000,
                      tintColor: ionCannonIconStatus
                        ? Colors.green_toggle
                        : Colors.blue_gray,
                      borderWidth: 1,
                      borderColor: ionCannonIconStatus
                        ? Colors.green_toggle
                        : Colors.blue_gray,
                      borderRadius: 5,
                      padding: 10,
                      backgroundColor: ionCannonIconStatus
                        ? Colors.darker_green_toggle
                        : Colors.hudDarker,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        <Text style={styles.shipInfo}>Orders:</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {shipSpecialOrdersIcon?.specialOrders?.map((specialOrder, index) => {
            const orderIcon = specialOrder[2];
            const orderName = specialOrder[0];

            const isAttempted =
              selectedShip.specialOrdersAttempted?.[orderName] === true;
            const isSuccessful =
              selectedShip.specialOrders?.[orderName] === true;

            let tintColor = Colors.blue_gray;
            if (isAttempted && isSuccessful) tintColor = Colors.green_toggle;
            else if (isAttempted && !isSuccessful)
              tintColor = Colors.lighter_red;

            return (
              <View key={index}>
                {orderIcon && (
                  <Image
                    style={[styles.image, { tintColor }]}
                    source={{ uri: orderIcon }}
                  />
                )}
              </View>
            );
          })}

          {shipActionCountTaken >= 2 && (
            <Text
              style={[
                styles.shipInfo,
                {
                  color: Colors.hud,
                  textAlign: "center",
                  fontFamily: "LeagueSpartan-Regular",
                },
              ]}
            >
              This ship has taken all of its actions.
            </Text>
          )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isShowWeaponInfo}
          onRequestClose={() => setIsShowWeaponInfo(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => setIsShowWeaponInfo(false)}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.25)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "30%",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.dark_gray,
                borderWidth: 1,
                borderColor: Colors.hud,
              }}
            >
              <Image
                style={{
                  width: 315,
                  height: 161,
                  resizeMode: "contain",
                }}
                source={require("../../assets/images/SC_logo1.png")}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  fontFamily: "LeagueSpartan-Bold",
                  color: Colors.hud,
                }}
              >
                {isWeapon}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  fontFamily: "LeagueSpartan-Regular",
                  color: Colors.white,
                }}
              >
                {weaponDescriptions[isWeapon]}
              </Text>
              <TouchableOpacity onPress={() => setIsShowWeaponInfo(false)}>
                <Text
                  style={{
                    marginTop: 20,
                    color: Colors.hudDarker,
                    backgroundColor: Colors.hud,
                    padding: 5,
                    borderRadius: 5,
                    fontFamily: "LeagueSpartan-Bold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  shipInfo: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    fontSize: 12,
    zIndex: 10000,
  },

  shipInfoContainer: {
    position: "absolute",
    zIndex: 10000,
    width: 150,
    padding: 10,
    backgroundColor: "#284b54b8",
    top: 10,
    left: 100,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "left",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    flexGrow: 1,
  },
  ionCannon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  image: {
    width: 20,
    height: 20,
    tintColor: Colors.hud,
    zIndex: 10000,
  },
  shipInfo2: {
    gap: 3,
  },
});
