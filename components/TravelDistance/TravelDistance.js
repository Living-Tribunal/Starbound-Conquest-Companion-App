import { View, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";

export default function TraveledDistance({
  ship,
  position,
  resetTrigger,
  reportedDistance,
}) {
  const [distance, setDistance] = useState(0);
  const startX = useRef(null);
  const startY = useRef(null);
  const warning = distance > ship.moveDistance + ship.moveDistanceBonus;

  useEffect(() => {
    setDistance(0);
    startX.current = null;
    startY.current = null;
  }, [resetTrigger]);

  useEffect(() => {
    const id = position.addListener(({ x, y }) => {
      // Initialize starting position once
      if (startX.current === null || startY.current === null) {
        startX.current = x;
        startY.current = y;
        return;
      }

      // Distance from starting point (net displacement)
      const deltaX = x - startX.current;
      const deltaY = y - startY.current;
      const netDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2) / 4;

      const clamped = Math.max(0, netDistance); // don't allow negative
      setDistance(clamped);
      ship.netDistance = clamped;

      if (typeof reportedDistance === "function") {
        reportedDistance(ship.id, clamped); // 🔥 Push update externally
      }

      //console.log("Net from start:", clamped.toFixed(2));
    });

    return () => {
      position.removeListener(id);
    };
  }, [position]);

  /*   if (!(shipPressed === ship.id && user.uid === ship.user)) return null; */

  return (
    <View
      style={{
        backgroundColor: warning ? Colors.deep_red : Colors.hudDarker,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: warning ? Colors.lighter_red : Colors.hud,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginTop: 4,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          color: warning ? Colors.lighter_red : Colors.hud,
        }}
      >
        {distance.toFixed(0) || 0}u/{ship.distanceTraveled?.toFixed(0) || 0}u
      </Text>
    </View>
  );
}
