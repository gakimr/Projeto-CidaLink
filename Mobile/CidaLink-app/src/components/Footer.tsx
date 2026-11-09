import { View, Image, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Image
        source={require("@/assets/images/fatec.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    backgroundColor: "#8fd19e",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  logo: {
    width: 140,
    height: 60,
    resizeMode: "contain",
  },
});
