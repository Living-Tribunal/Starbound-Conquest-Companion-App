import { useState } from 'react';

export default ShowStat = () => {
    const [showStat, setShowStat] = useState({
        hitPoint: false,
        toHit: false,
        moveDistance: false,
        soak: false,
        weaponType: false,
        firingArc: false,
        weaponDamage: false,
        weaponRange: false,
        specialOrders: false,
        pointValue: false,
        capacity: false,
      });
    
      const handlePress = (key) => {
        setShowStat((prevState) => ({
          ...prevState,
          [key]: !prevState[key],
        }));
      };

      const showAllStat = (value) => {
        setShowStat((prevState) => {
            const updatedState = {};
            for (const key in prevState) {
                updatedState[key] = value;
            }
            return updatedState;
        });
    };
      return{ showStat, handlePress, showAllStat }
    };