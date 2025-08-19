export const getCombinedGameRoomID = ({ user, item }) => {
  const userID = user.uid;
  const itemID = item.uid;
  const sortedIDs = [itemID, userID].sort();
  const combinedID = sortedIDs.join("-");
  return combinedID;
};
