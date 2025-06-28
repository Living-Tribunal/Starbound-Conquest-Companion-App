import React, { useRef, useEffect } from "react";
import { View, Animated } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";
import { Colors } from "@/constants/Colors";
import PulsingGlow from "@/components/Pusle/PulsingGlow";

export default function ShipSwitch({ ship, showFiringArcs }) {
  const animOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animOpacity, {
      toValue: showFiringArcs ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showFiringArcs]);

  const shipSwitch = (ship) => {
    switch (ship.type) {
      case "Fighter":
        if (showFiringArcs) {
          return (
            <Animated.View style={{ opacity: animOpacity }}>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -160 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -170 }, { translateY: -275 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -60 -60 A 150 150 0 0 1 60 -60"
                  stroke={Colors.lightCannon}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="0"
                  y="-85"
                  fill={Colors.lightCannon}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Light Cannon
                </SvgText>
              </Svg>
              <View
                style={{
                  position: "absolute",
                  top: -40,
                  right: 54,
                }}
              >
                <PulsingGlow
                  ship={ship}
                  size={40}
                  color={Colors.plasmaCannon}
                />
              </View>
            </Animated.View>
          );
        }
        break;

      case "Destroyer":
        if (showFiringArcs) {
          return (
            <Animated.View style={{ opacity: animOpacity }}>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -160 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -170 }, { translateY: -285 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -60 -60 A 150 150 0 0 1 60 -60"
                  stroke={Colors.mediumCannon}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="0"
                  y="-85"
                  fill={Colors.mediumCannon}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Medium Cannon
                </SvgText>
              </Svg>
              <View
                style={{
                  position: "absolute",
                  top: -85,
                  left: -30,
                }}
              >
                <PulsingGlow
                  ship={ship}
                  size={60}
                  color={Colors.plasmaCannon}
                />
              </View>
            </Animated.View>
          );
        }
        break;

      case "Cruiser":
        if (showFiringArcs) {
          return (
            <Animated.View style={{ opacity: animOpacity }}>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -160 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -170 }, { translateY: -300 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -60 -60 A 150 150 0 0 1 60 -60"
                  stroke={Colors.heavyCannon}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="0"
                  y="-85"
                  fill={Colors.heavyCannon}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Heavy Cannon
                </SvgText>
              </Svg>
              <Svg
                width={300}
                height={300}
                viewBox="-160 -150 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -240 }, { translateY: -200 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -106.07 106.07 A 150 150 0 0 1 -106.07 -106.07"
                  stroke={Colors.plasmaCannon}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="-100"
                  y="0"
                  fill={Colors.plasmaCannon}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Plasma Cannon
                </SvgText>
              </Svg>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -150 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -120 }, { translateY: -200 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -106.07 106.07 A 150 150 0 0 1 -106.07 -106.07"
                  stroke={Colors.plasmaCannon}
                  strokeWidth={2}
                  fill="none"
                  transform="scale(-1,1)"
                />
                <SvgText
                  x="100"
                  y="0"
                  fill={Colors.plasmaCannon}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Plasma Cannon
                </SvgText>
              </Svg>
              <View
                style={{
                  position: "absolute",
                  top: -97,
                  left: -35,
                }}
              >
                <PulsingGlow
                  ship={ship}
                  size={70}
                  color={Colors.plasmaCannon}
                />
              </View>
            </Animated.View>
          );
        }
        break;

      case "Carrier":
        if (showFiringArcs) {
          return (
            <Animated.View style={{ opacity: animOpacity }}>
              <View
                style={{
                  position: "absolute",
                  top: -90,
                  left: -38,
                }}
              >
                <PulsingGlow
                  ship={ship}
                  size={80}
                  color={Colors.plasmaCannon}
                />
              </View>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -220 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -165 }, { translateY: -500 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -212 -100 A 320 320 0 0 1 212 -100"
                  stroke={Colors.railguns}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="0"
                  y="-200"
                  fill={Colors.railguns}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  350mm Railguns
                </SvgText>
              </Svg>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -160 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -165 }, { translateY: -270 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -60 -60 A 150 150 0 0 1 60 -60"
                  stroke={Colors.railguns}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="0"
                  y="-85"
                  fill={Colors.railguns}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  350mm Railguns
                </SvgText>
              </Svg>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -180 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -165 }, { translateY: -290 }],
                  zIndex: -1,
                }}
              >
                <Path
                  transform="rotate(90 0 0)"
                  d="M -106.07 106.07 A 150 150 0 0 1 -106.07 -106.07"
                  stroke={Colors.missiles}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="0"
                  y="-160"
                  fill={Colors.missiles}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Missle Battery
                </SvgText>
              </Svg>
            </Animated.View>
          );
        }
        break;

      case "Dreadnought":
        if (showFiringArcs) {
          return (
            <Animated.View style={{ opacity: animOpacity }}>
              <Svg
                width={300}
                height={300}
                viewBox="-160 -150 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -280 }, { translateY: -200 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -106.07 106.07 A 150 150 0 0 1 -106.07 -106.07"
                  stroke={Colors.plasmaCannon}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="-100"
                  y="0"
                  fill={Colors.plasmaCannon}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Plasma Cannon
                </SvgText>
              </Svg>
              <View
                style={{
                  position: "absolute",
                  top: -140,
                  left: -45,
                }}
              >
                <PulsingGlow
                  ship={ship}
                  size={90}
                  color={Colors.plasmaCannon}
                />
              </View>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -150 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -120 }, { translateY: -200 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -106.07 106.07 A 150 150 0 0 1 -106.07 -106.07"
                  stroke={Colors.plasmaCannon}
                  strokeWidth={2}
                  fill="none"
                  transform="scale(-1,1)"
                />
                <SvgText
                  x="100"
                  y="0"
                  fill={Colors.plasmaCannon}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Plasma Cannon
                </SvgText>
              </Svg>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -180 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -190 }, { translateY: -300 }],
                  zIndex: -1,
                }}
              >
                <Path
                  transform="rotate(90 0 0)"
                  d="M -106.07 106.07 A 150 150 0 0 1 -106.07 -106.07"
                  stroke={Colors.particleBeam}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="0"
                  y="-160"
                  fill={Colors.particleBeam}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Ion Particle Beam
                </SvgText>
              </Svg>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -220 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -190 }, { translateY: -480 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -212 -100 A 320 320 0 0 1 212 -100"
                  stroke={Colors.railguns}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="0"
                  y="-200"
                  fill={Colors.railguns}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  350mm Railguns
                </SvgText>
              </Svg>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -160 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -190 }, { translateY: -300 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -60 -60 A 150 150 0 0 1 60 -60"
                  stroke={Colors.railguns}
                  strokeWidth={2}
                  fill="none"
                />
                <SvgText
                  x="0"
                  y="-85"
                  fill={Colors.railguns}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  350mm Railguns
                </SvgText>
              </Svg>
            </Animated.View>
          );
        }
        break;

      default:
        return null;
    }
  };

  return shipSwitch(ship, showFiringArcs);
}
