import Svg, { Path, Circle, Text as SvgText, G } from "react-native-svg";
import { View } from "react-native";
import { Colors } from "@/constants/Colors";

export default function ShipSwitch({ ship, showFiringArcs }) {
  const shipSwitch = (ship) => {
    switch (ship.type) {
      case "Fighter":
        console.log("Fighter");
        if (showFiringArcs) {
          return (
            <View>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -160 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -140 }, { translateY: -250 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -60 -60 A 150 150 0 0 1 60 -60"
                  stroke={Colors.lightCannon}
                  strokeWidth={2}
                  fill="none"
                />

                {/* Normal text, unaffected by mirroring */}
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
            </View>
          );
        }
        break;
      case "Destroyer":
        if (showFiringArcs) {
          return (
            <View>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -160 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -140 }, { translateY: -250 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -60 -60 A 150 150 0 0 1 60 -60"
                  stroke={Colors.mediumCannon}
                  strokeWidth={2}
                  fill="none"
                />

                {/* Normal text, unaffected by mirroring */}
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
            </View>
          );
        }
        break;
      case "Cruiser":
        if (showFiringArcs) {
          return (
            <View>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -160 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -140 }, { translateY: -250 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -60 -60 A 150 150 0 0 1 60 -60"
                  stroke={Colors.heavyCannon}
                  strokeWidth={2}
                  fill="none"
                />

                {/* Normal text, unaffected by mirroring */}
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
                viewBox="-160 -150 300 300" // Centered on (0, 0)
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -200 }, { translateY: -200 }],
                  zIndex: -1, // send behind ship image if needed
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
                  transform: [{ translateX: -100 }, { translateY: -200 }],
                  zIndex: -1,
                }}
              >
                {/* Mirrored arc */}
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
            </View>
          );
        }
        break;
      case "Carrier":
        if (showFiringArcs) {
          return (
            <View>
              <Svg
                width={300}
                height={300}
                viewBox="-140 -220 300 300"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -140 }, { translateY: -460 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -212 -100 A 320 320 0 0 1 212 -100"
                  stroke={Colors.railguns}
                  strokeWidth={2}
                  fill="none"
                />

                {/* Normal text, unaffected by mirroring */}
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
                  transform: [{ translateX: -140 }, { translateY: -250 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -60 -60 A 150 150 0 0 1 60 -60"
                  stroke={Colors.railguns}
                  strokeWidth={2}
                  fill="none"
                />

                {/* Normal text, unaffected by mirroring */}
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
                  transform: [{ translateX: -140 }, { translateY: -270 }],
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

                {/* Normal text, unaffected by mirroring */}
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
            </View>
          );
        }
        break;
      case "Dreadnought":
        if (showFiringArcs) {
          return (
            <View>
              <Svg
                width={300}
                height={300}
                viewBox="-160 -150 300 300" // Centered on (0, 0)
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -200 }, { translateY: -200 }],
                  zIndex: -1, // send behind ship image if needed
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
                  transform: [{ translateX: -100 }, { translateY: -200 }],
                  zIndex: -1,
                }}
              >
                {/* Mirrored arc */}
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
                  transform: [{ translateX: -140 }, { translateY: -270 }],
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

                {/* Normal text, unaffected by mirroring */}
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
                  transform: [{ translateX: -140 }, { translateY: -460 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -212 -100 A 320 320 0 0 1 212 -100"
                  stroke={Colors.railguns}
                  strokeWidth={2}
                  fill="none"
                />

                {/* Normal text, unaffected by mirroring */}
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
                  transform: [{ translateX: -140 }, { translateY: -250 }],
                  zIndex: -1,
                }}
              >
                <Path
                  d="M -60 -60 A 150 150 0 0 1 60 -60"
                  stroke={Colors.railguns}
                  strokeWidth={2}
                  fill="none"
                />

                {/* Normal text, unaffected by mirroring */}
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
            </View>
          );
        }
      default:
        console.log("No ship type found");
    }
  };
  return shipSwitch(ship, showFiringArcs);
}
