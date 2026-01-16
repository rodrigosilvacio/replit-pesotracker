import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { Spacing, BorderRadius, Typography, Colors } from "@/constants/theme";
import { WeightSummary } from "@/types/weight";

interface SummaryCardsProps {
  summary: WeightSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  const formatWeight = (weight: number | null) => {
    if (weight === null) return "--";
    return weight.toFixed(1);
  };

  const getChangeColor = () => {
    if (summary.change === null || summary.change === 0) return theme.textSecondary;
    return summary.change < 0 ? Colors[isDark ? "dark" : "light"].success : Colors[isDark ? "dark" : "light"].error;
  };

  const getChangeIcon = (): "trending-down" | "trending-up" | "minus" => {
    if (summary.change === null || summary.change === 0) return "minus";
    return summary.change < 0 ? "trending-down" : "trending-up";
  };

  const cards = [
    {
      label: t.summary.current,
      value: formatWeight(summary.currentWeight),
      unit: t.summary.kg,
      color: theme.primary,
    },
    {
      label: t.summary.change,
      value: summary.change !== null ? `${summary.change >= 0 ? "+" : ""}${summary.change.toFixed(1)}` : "--",
      unit: t.summary.kg,
      color: getChangeColor(),
      icon: getChangeIcon(),
    },
    {
      label: t.summary.lowest,
      value: formatWeight(summary.lowestWeight),
      unit: t.summary.kg,
      color: Colors[isDark ? "dark" : "light"].success,
    },
    {
      label: t.summary.highest,
      value: formatWeight(summary.highestWeight),
      unit: t.summary.kg,
      color: Colors[isDark ? "dark" : "light"].error,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.cardsGrid}>
        {cards.map((card) => (
          <View
            key={card.label}
            style={[
              styles.card,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.border,
              },
            ]}
          >
            <ThemedText
              style={[styles.label, { color: theme.textSecondary }]}
            >
              {card.label}
            </ThemedText>
            <View style={styles.valueRow}>
              {card.icon ? (
                <Feather
                  name={card.icon}
                  size={20}
                  color={card.color}
                  style={styles.icon}
                />
              ) : null}
              <ThemedText style={[styles.value, { color: card.color }]}>
                {card.value}
              </ThemedText>
            </View>
            <ThemedText style={[styles.unit, { color: theme.textSecondary }]}>
              {card.unit}
            </ThemedText>
          </View>
        ))}
      </View>
      {user?.goalWeight ? (
        <View
          style={[
            styles.goalCard,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.primary,
            },
          ]}
        >
          <Feather name="target" size={20} color={theme.primary} />
          <View style={styles.goalContent}>
            <ThemedText style={[styles.goalLabel, { color: theme.textSecondary }]}>
              {t.summary.goal}
            </ThemedText>
            <ThemedText style={[styles.goalValue, { color: theme.primary }]}>
              {user.goalWeight.toFixed(1)} {t.summary.kg}
            </ThemedText>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  card: {
    flex: 1,
    minWidth: "45%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  label: {
    fontSize: Typography.caption.fontSize,
    fontWeight: "500",
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: Spacing.xs,
  },
  value: {
    fontSize: Typography.cardValue.fontSize,
    fontWeight: Typography.cardValue.fontWeight,
    lineHeight: Typography.cardValue.lineHeight,
  },
  unit: {
    fontSize: Typography.caption.fontSize,
    marginTop: Spacing.xs,
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  goalContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  goalValue: {
    fontSize: 18,
    fontWeight: "700",
  },
});
