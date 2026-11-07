import Footer from "@/components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/LogoCida.png")}
          style={styles.logo}
        ></Image>
        <Text style={styles.title}>Que bom te ver de volta!</Text>
        <Text style={styles.subtitle}>Acesse sua conta para cintinuar</Text>

        <Text style={styles.label}>E-mail</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={18}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.Input}
            placeholder="seu email@exemplo.com"
            placeholderTextColor={"#999"}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.Input}
            placeholder="sua senha segura"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
          />
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={18}
            color="#666"
            onPress={() => setShowPassword(!showPassword)}
          />
        </View>
        <Text style={styles.recsenha}>Esqueceu a senha?</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/feed")}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Entrar
          </Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 15, color: "#555", marginBottom: 5 }}>
            Ainda não tem uma conta?
          </Text>
          <TouchableOpacity onPress={() => router.push("/cadastro")}>
            <Text
              style={{ fontSize: 15, color: "#2e7d32", fontWeight: "bold" }}
            >
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
  },

  text: {
    color: "#000000",
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b6b6b",
    marginBottom: 24,
    textAlign: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  label: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    alignSelf: "flex-start",
    marginLeft: 4,
  },

  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  Input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
  },
  recsenha: {
    fontSize: 15,
    color: "#999",
    textDecorationLine: "underline",
    marginBottom: 24,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#2e7d32",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 8,
  },
});
