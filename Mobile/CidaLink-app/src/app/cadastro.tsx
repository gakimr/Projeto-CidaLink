import { useAuth } from "@/context/AuthContext";
import { mensagemDeErro } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function formatarCpf(valor: string) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const router = useRouter();
  const { cadastrar } = useAuth();

  async function handleCadastrar() {
    setErro("");

    const cpfDigitos = cpf.replace(/\D/g, "");

    if (!nome.trim() || !cpfDigitos || !email.trim() || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (cpfDigitos.length !== 11) {
      setErro("Informe um CPF com 11 dígitos.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setEnviando(true);
    try {
      await cadastrar({
        nome: nome.trim(),
        cpf: cpfDigitos,
        email: email.trim(),
        password: senha,
        tipo: "cidadao",
      });
      router.replace("/feed");
    } catch (error) {
      setErro(mensagemDeErro(error, "Erro ao cadastrar. Tente novamente."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
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
            value={nome}
            onChangeText={setNome}
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
            value={cpf}
            onChangeText={(texto) => setCpf(formatarCpf(texto))}
            maxLength={14}
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
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
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
            value={senha}
            onChangeText={setSenha}
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
            placeholder="Repita a senha"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirmPassword}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
          <Ionicons
            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
            size={18}
            color="#666"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity
          style={[
            styles.registerButton,
            enviando && styles.registerButtonDesativado,
          ]}
          onPress={handleCadastrar}
          disabled={enviando}
        >
          <Text style={styles.registerButtonText}>
            {enviando ? "Cadastrando..." : "Cadastre-se"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 75,
    paddingBottom: 24,
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
  erro: {
    color: "#c62828",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
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
  registerButtonDesativado: {
    opacity: 0.6,
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
