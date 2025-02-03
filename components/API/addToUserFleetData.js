const addToUserFleetData = useCallback(async (ship) => {
    if (!username || !ship) return;
  
    try {
      const response = await fetch(`https://starboundconquest.com/user-ships/${username}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: ship.id,
          factionName: ship.factionName,
          user: ship.user,
          shipId: ship.shipId,
          type: ship.type,
          x: ship.x,
          y: ship.y,
          prevX: ship.prevX,
          prevY: ship.prevY,
          width: ship.width,
          height: ship.height,
          isSelected: ship.isSelected ? 1 : 0,
          isToggled: ship.isToggled ? 1 : 0,
          rotation_angle: ship.rotation_angle,
          highlighted: ship.highlighted ? 1 : 0,
          image: ship.image,
          globalAlpha: ship.globalAlpha,
          maxHP: ship.maxHP,
          hp: ship.hp,
          damageThreshold: ship.damageThreshold,
          threatLevel: ship.threatLevel,
          moveDistance: ship.moveDistance,
          weaponType: ship.weaponType,
          firingArc: ship.firingArc,
          weaponDamage: ship.weaponDamage,
          weaponRange: ship.weaponRange,
          pointValue: ship.pointValue,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log("Response Data:", responseData);
  
      // Store in AsyncStorage if needed
      await AsyncStorage.setItem("fleetData", JSON.stringify(responseData));
  
      // Update context state
      setData(responseData);
  
    } catch (error) {
      console.error("Error posting fleet data:", error);
    }
  }, [username, setData]);
  