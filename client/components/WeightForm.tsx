import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Weight } from "@/types/weight";

interface WeightFormProps {
  onSubmit: (data: { date: string; weight: number }) => void;
  editingWeight?: Weight | null;
  onCancelEdit?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function WeightForm({
  onSubmit,
  editingWeight,
  onCancelEdit,
  isLoading,
  error,
}: WeightFormProps) {
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const [date, setDate] = useState(new Date());
  const [weight, setWeight] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (editingWeight) {
      setDate(new Date(editingWeight.date + "T12:00:00"));
      setWeight(editingWeight.weight.toString());
    } else {
      setDate(new Date());
      setWeight("");
    }
    setLocalError(null);
  }, [editingWeight]);

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (d: Date) => {
    const locale = language === "pt" ? "pt-BR" : "en-US";
    return d.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSubmit = () => {
    setLocalError(null);

    const weightValue = parseFloat(weight.replace(",", "."));
    if (isNaN(weightValue)) {
      setLocalError(t.form.validWeight);
      return;
    }

    if (weightValue <= 0 || weightValue >= 500) {
      setLocalError(t.form.weightRange);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSubmit({ date: formatDate(date), weight: weightValue });

    if (!editingWeight) {
      setWeight("");
      setDate(new Date());
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const displayError = error || localError;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.border,
        },
      ]}
    >
      <ThemedText style={styles.title}>
        {editingWeight ? t.form.editRecord : t.form.addWeight}
      </ThemedText>

      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            {t.form.date}
          </ThemedText>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={[
              styles.dateInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Feather name="calendar" size={18} color={theme.textSecondary} />
            <ThemedText style={styles.dateText}>
              {formatDisplayDate(date)}
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.inputWrapper}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            {t.form.weight}
          </ThemedText>
          <View
            style={[
              styles.weightInputContainer,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <TextInput
              style={[styles.weightInput, { color: theme.text }]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor={theme.textDisabled}
              editable={!isLoading}
            />
            <ThemedText style={[styles.unit, { color: theme.textSecondary }]}>
              kg
            </ThemedText>
          </View>
        </View>
      </View>

      {displayError ? (
        <ThemedText style={[styles.error, { color: Colors[isDark ? "dark" : "light"].error }]}>
          {displayError}
        </ThemedText>
      ) : null}

      <View style={styles.buttonRow}>
        {editingWeight && onCancelEdit ? (
          <Pressable
            onPress={onCancelEdit}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.cancelButton,
              {
                backgroundColor: theme.backgroundSecondary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={{ color: theme.text }}>{t.form.cancel}</ThemedText>
          </Pressable>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={isLoading || !weight}
          style={({ pressed }) => [
            styles.submitButton,
            {
              backgroundColor: theme.primary,
              opacity: isLoading || !weight ? 0.5 : pressed ? 0.8 : 1,
              flex: editingWeight ? 1 : undefined,
            },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Feather
                name={editingWeight ? "check" : "plus"}
                size={18}
                color="#FFFFFF"
              />
              <ThemedText style={styles.submitText}>
                {editingWeight ? t.form.update : t.form.addRecord}
              </ThemedText>
            </>
          )}
        </Pressable>
      </View>

      {showDatePicker ? (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  dateText: {
    fontSize: 16,
  },
  weightInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  weightInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  unit: {
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
  error: {
    fontSize: 13,
    marginTop: Spacing.sm,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  cancelButton: {
    height: 48,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
