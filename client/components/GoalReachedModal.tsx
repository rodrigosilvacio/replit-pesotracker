import React from "react";
import { View, StyleSheet, Pressable, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface GoalReachedModalProps {
  visible: boolean;
  onDismiss: () => void;
  goalWeight: number;
  currentWeight: number;
}

export function GoalReachedModal({
  visible,
  onDismiss,
  goalWeight,
  currentWeight,
}: GoalReachedModalProps) {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: Colors[isDark ? "dark" : "light"].success + "20" },
            ]}
          >
            <Feather
              name="award"
              size={56}
              color={Colors[isDark ? "dark" : "light"].success}
            />
          </View>

          <ThemedText style={styles.title}>{t.goalReached.title}</ThemedText>
          <ThemedText style={[styles.message, { color: theme.textSecondary }]}>
            {t.goalReached.message}
          </ThemedText>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                {t.summary.goal}
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: theme.primary }]}>
                {goalWeight.toFixed(1)} kg
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                {t.summary.current}
              </ThemedText>
              <ThemedText
                style={[
                  styles.statValue,
                  { color: Colors[isDark ? "dark" : "light"].success },
                ]}
              >
                {currentWeight.toFixed(1)} kg
              </ThemedText>
            </View>
          </View>

          <Pressable
            onPress={handleDismiss}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: Colors[isDark ? "dark" : "light"].success,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={styles.buttonText}>{t.goalReached.dismiss}</ThemedText>
          </Pressable>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  content: {
    width: "100%",
    maxWidth: 340,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  divider: {
    width: 1,
    height: 40,
  },
  button: {
    width: "100%",
    height: 52,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
