
import Footer from "@/components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  function handleSubmit() {
    setErro("");

    if (!email.trim()) {
      setErro("Informe seu e-mail cadastrado.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!emailValido) {
      setErro("Digite um e-mail válido.");
      return;
    }

}

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.icone}>
            <Ionicons
              name="mail-outline"
              size={38}
              color="#2e7d32"
            />
          </View>

          <Text style={styles.title}>Recuperar senha</Text>

          <Text style={styles.subtitle}>
            Vamos recuperar seu acesso!
          </Text>

          <Text style={styles.descricao}>
            Esqueceu sua senha? Não se preocupe!
            Informe o e-mail cadastrado na sua conta
            para receber as instruções de recuperação.
          </Text>

          <Text style={styles.label}>E-mail cadastrado</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={19}
              color="#666"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {erro ? (
            <Text style={styles.erro}>{erro}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.botao,
              carregando && styles.botaoDesativado,
            ]}
            onPress={handleSubmit}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>
                Enviar link de recuperação
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.dica}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#777"
            />

            <Text style={styles.dicaTexto}>
              Confira se digitou corretamente o e-mail
              utilizado no seu cadastro.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.voltar}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.voltarTexto}>
              ← Voltar para o login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 35,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    alignItems: "center",
  },
  icone: {
    width: 76,
    height: 76,
    borderRadius: 50,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 18,
    textAlign: "center",
  },
  descricao: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#555",
    alignSelf: "flex-start",
    marginBottom: 7,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 14,
    color: "#333",
  },
  erro: {
    color: "#c62828",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },
  botao: {
    width: "100%",
    backgroundColor: "#2e7d32",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  botaoDesativado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  dica: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 24,
  },
  dicaTexto: {
    flex: 1,
    fontSize: 12,
    color: "#777",
    lineHeight: 19,
  },
  voltar: {
    alignItems: "center",
    marginTop: 5,
  },
  voltarTexto: {
    color: "#2e7d32",
    fontSize: 15,
    fontWeight: "600",
  },
});
