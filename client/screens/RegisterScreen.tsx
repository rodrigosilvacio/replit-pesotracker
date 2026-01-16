import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);

    if (!username.trim()) {
      setError(t.auth.usernameRequired);
      return;
    }
    if (!password) {
      setError(t.auth.passwordRequired);
      return;
    }
    if (password.length < 6) {
      setError(t.auth.passwordMinLength);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.auth.passwordsMatch);
      return;
    }

    const goalWeightValue = goalWeight ? parseFloat(goalWeight.replace(",", ".")) : undefined;

    setIsLoading(true);
    try {
      await register(username.trim(), password, goalWeightValue);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (err?.message?.includes("409")) {
        setError(t.auth.usernameTaken);
      } else {
        setError(t.auth.registerFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + Spacing["3xl"],
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.primary + "20" },
          ]}
        >
          <Feather name="user-plus" size={48} color={theme.primary} />
        </View>
        <ThemedText style={styles.welcomeText}>{t.auth.createAccount}</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t.auth.trackYourWeight}
        </ThemedText>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            {t.auth.username}
          </ThemedText>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Feather name="user" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={username}
              onChangeText={setUsername}
              placeholder={t.auth.username}
              placeholderTextColor={theme.textDisabled}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            {t.auth.password}
          </ThemedText>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Feather name="lock" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={password}
              onChangeText={setPassword}
              placeholder={t.auth.password}
              placeholderTextColor={theme.textDisabled}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            {t.auth.confirmPassword}
          </ThemedText>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Feather name="lock" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t.auth.confirmPassword}
              placeholderTextColor={theme.textDisabled}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            {t.auth.goalWeight}
          </ThemedText>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Feather name="target" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={goalWeight}
              onChangeText={setGoalWeight}
              placeholder="70.0"
              placeholderTextColor={theme.textDisabled}
              keyboardType="decimal-pad"
              editable={!isLoading}
            />
            <ThemedText style={{ color: theme.textSecondary }}>kg</ThemedText>
          </View>
          <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
            {t.auth.goalWeightHint}
          </ThemedText>
        </View>

        {error ? (
          <ThemedText
            style={[
              styles.error,
              { color: Colors[isDark ? "dark" : "light"].error },
            ]}
          >
            {error}
          </ThemedText>
        ) : null}

        <Pressable
          onPress={handleRegister}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: theme.primary,
              opacity: isLoading ? 0.5 : pressed ? 0.8 : 1,
            },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <ThemedText style={styles.buttonText}>
              {t.auth.registerButton}
            </ThemedText>
          )}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <ThemedText style={{ color: theme.textSecondary }}>
          {t.auth.hasAccount}{" "}
        </ThemedText>
        <Pressable onPress={onNavigateToLogin} disabled={isLoading}>
          <ThemedText style={[styles.link, { color: theme.primary }]}>
            {t.auth.signIn}
          </ThemedText>
        </Pressable>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  form: {
    gap: Spacing.md,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  hint: {
    fontSize: 12,
    marginTop: 2,
  },
  error: {
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    height: 52,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing["3xl"],
  },
  link: {
    fontWeight: "600",
  },
});
