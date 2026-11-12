import { useEffect, useState, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  buscarNotificacoes,
  marcarNotificacaoComoLida,
  marcarTodasComoLidas,
  type Notificacao,
} from "@/services/notificacoes";
export default function NotificacoesScreen() {
    useEffect(() => {
  async function carregar() {
    try {
      const resultado = await buscarNotificacoes();

      console.log("Notificações recebidas da API:", resultado);

    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  }

  carregar();
}, []);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>Notificações</Text>

        <Text style={styles.subtitulo}>
          Acompanhe as novidades e atualizações
          das suas ocorrências.
        </Text>
      </View>

      <View style={styles.resumo}>
        <View style={styles.icone}>
          <Ionicons
            name="notifications"
            size={28}
            color="#2e7d32"
          />
        </View>

        <View style={styles.resumoTexto}>
          <Text style={styles.resumoTitulo}>
            Suas notificações
          </Text>

          <Text style={styles.resumoSubtitulo}>
            Fique por dentro das novidades!
          </Text>
        </View>
      </View>

      <View style={styles.vazio}>
        <Ionicons
          name="notifications-outline"
          size={48}
          color="#9eaaa0"
        />

        <Text style={styles.vazioTitulo}>
          Nenhuma notificação por aqui
        </Text>

        <Text style={styles.vazioTexto}>
          Quando houver novidades, elas aparecerão aqui.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f5",
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 25,
  },

  titulo: {
    fontSize: 25,
    fontWeight: "700",
    color: "#222",
  },

  subtitulo: {
    fontSize: 13,
    color: "#777",
    lineHeight: 20,
    marginTop: 7,
  },

  resumo: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    elevation: 2,
  },

  icone: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e8f3e8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  resumoTexto: {
    flex: 1,
  },

  resumoTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },

  resumoSubtitulo: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },

  vazio: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },

  vazioTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#444",
    marginTop: 15,
    textAlign: "center",
  },

  vazioTexto: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 19,
  },
});
