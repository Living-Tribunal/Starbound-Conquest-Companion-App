const checkifAllAheadFullBonus = () => {
  if (diceValueToShare >= 11) {
    setDiceValueToShare(ship.moveDistance);
  } else {
    const halfShipMoveDistance = ship.moveDistance / 2;
    setDiceValueToShare(halfShipMoveDistance);
  }
};
