import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { SummaryCards } from "@/components/SummaryCards";
import { WeightForm } from "@/components/WeightForm";
import { WeightChart } from "@/components/WeightChart";
import { WeightTable } from "@/components/WeightTable";
import { GoalReachedModal } from "@/components/GoalReachedModal";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { Spacing } from "@/constants/theme";
import {
  useWeights,
  useWeightSummary,
  useCreateWeight,
  useUpdateWeight,
  useDeleteWeight,
} from "@/hooks/useWeights";
import { Weight } from "@/types/weight";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [editingWeight, setEditingWeight] = useState<Weight | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showGoalReached, setShowGoalReached] = useState(false);
  const [goalReachedWeight, setGoalReachedWeight] = useState<number>(0);

  const { data: weights, isLoading, refetch, isRefetching } = useWeights();
  const summary = useWeightSummary(weights);
  const createMutation = useCreateWeight();
  const updateMutation = useUpdateWeight();
  const deleteMutation = useDeleteWeight();

  const checkGoalReached = useCallback((newWeight: number) => {
    if (user?.goalWeight && newWeight <= user.goalWeight) {
      setGoalReachedWeight(newWeight);
      setShowGoalReached(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [user?.goalWeight]);

  const handleSubmit = useCallback(
    async (data: { date: string; time: string; weight: number }) => {
      setFormError(null);
      try {
        if (editingWeight) {
          await updateMutation.mutateAsync({ id: editingWeight.id, data });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setEditingWeight(null);
          checkGoalReached(data.weight);
        } else {
          await createMutation.mutateAsync(data);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          checkGoalReached(data.weight);
        }
      } catch (error: any) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        const message = error?.message || t.errors.saveFailed;
        if (message.includes("409") || message.includes("already exists")) {
          setFormError(t.errors.duplicateDate);
        } else {
          setFormError(message);
        }
      }
    },
    [editingWeight, createMutation, updateMutation, t, checkGoalReached]
  );

  const handleEdit = useCallback((weight: Weight) => {
    setEditingWeight(weight);
    setFormError(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingWeight(null);
    setFormError(null);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteMutation.mutateAsync(id);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
    [deleteMutation]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: theme.backgroundRoot,
            paddingTop: headerHeight + Spacing.xl,
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText style={[styles.loadingText, { color: theme.textSecondary }]}>
          {t.loading.loadingData}
        </ThemedText>
      </View>
    );
  }

  return (
    <>
      <KeyboardAwareScrollViewCompat
        style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <SummaryCards summary={summary} />

        <WeightForm
          onSubmit={handleSubmit}
          editingWeight={editingWeight}
          onCancelEdit={handleCancelEdit}
          isLoading={createMutation.isPending || updateMutation.isPending}
          error={formError}
        />

        <WeightChart weights={weights || []} />

        <WeightTable
          weights={weights || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      </KeyboardAwareScrollViewCompat>

      {user?.goalWeight ? (
        <GoalReachedModal
          visible={showGoalReached}
          onDismiss={() => setShowGoalReached(false)}
          goalWeight={user.goalWeight}
          currentWeight={goalReachedWeight}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 14,
  },
});
