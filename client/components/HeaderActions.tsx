import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/lib/auth/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";

export function HeaderActions() {
  const { theme } = useTheme();
  const { logout } = useAuth();

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await logout();
  };

  return (
    <View style={styles.container}>
      <LanguageSelector />
      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed ? theme.backgroundSecondary : "transparent",
          },
        ]}
        hitSlop={8}
      >
        <Feather name="log-out" size={20} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  button: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
});
