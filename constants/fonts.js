import { useFonts } from "expo-font";

export const FONTS = {
    aboreto: "Aboreto-Regular",
    leagueBold: "LeagueSpartan-ExtraBold",
    leagueRegular: "LeagueSpartan-Regular",
}

export const LoadFonts = () => {
const [fontsLoaded] = useFonts({
[FONTS.aboreto]: require("../assets/fonts/Aboreto-Regular.ttf"),
[FONTS.leagueBold]: require("../assets/fonts/LeagueSpartan-ExtraBold.ttf"),
[FONTS.leagueRegular]: require("../assets/fonts/LeagueSpartan-Regular.ttf")
  });

  return fontsLoaded;

};