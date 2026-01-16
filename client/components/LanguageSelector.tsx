import React, { useState } from "react";
import { View, StyleSheet, Pressable, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/translations";
import { Spacing, BorderRadius } from "@/constants/theme";

export function LanguageSelector() {
  const { theme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectLanguage = (lang: Language) => {
    Haptics.selectionAsync();
    setLanguage(lang);
    setModalVisible(false);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "pt", label: t.settings.portuguese, flag: "BR" },
    { code: "en", label: t.settings.english, flag: "US" },
  ];

  return (
    <>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          setModalVisible(true);
        }}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.backgroundSecondary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        hitSlop={8}
      >
        <Feather name="globe" size={18} color={theme.text} />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>
              {t.settings.language}
            </ThemedText>

            {languages.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => handleSelectLanguage(lang.code)}
                style={({ pressed }) => [
                  styles.languageOption,
                  {
                    backgroundColor:
                      language === lang.code
                        ? theme.backgroundSecondary
                        : pressed
                        ? theme.backgroundSecondary
                        : "transparent",
                  },
                ]}
              >
                <ThemedText style={styles.languageLabel}>{lang.label}</ThemedText>
                {language === lang.code ? (
                  <Feather name="check" size={18} color={theme.primary} />
                ) : null}
              </Pressable>
            ))}
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    width: "100%",
    maxWidth: 300,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.xs,
  },
  languageLabel: {
    fontSize: 16,
  },
});
