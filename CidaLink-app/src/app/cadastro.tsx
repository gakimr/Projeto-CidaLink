import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CadastroScreen() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Crie a sua conta!</Text>
        <Text style={styles.subtitle}>
          Junte-se a nós pra transformar a cidade. É rápido!
        </Text>

        <Text style={styles.label}>Nome Completo</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={18}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor="#999"
          />
        </View>
        <Text style={styles.label}>CPF</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="card-outline"
            size={18}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="000.000.000-00"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.label}>E-mail</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={18}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor="#999"
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
            style={styles.input}
            placeholder="Crie uma senha segura"
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
        <Text style={styles.label}>Confirmar Senha</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha segura"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirmPassword}
          />
          <Ionicons
            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
            size={18}
            color="#666"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={() => {}}>
          <Text style={styles.registerButtonText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 75,
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
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#2e7d32",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
});
