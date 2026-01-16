import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Weight } from "@/types/weight";

interface WeightTableProps {
  weights: Weight[];
  onEdit: (weight: Weight) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

type SortOrder = "asc" | "desc";

export function WeightTable({
  weights,
  onEdit,
  onDelete,
  isDeleting,
}: WeightTableProps) {
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [weightToDelete, setWeightToDelete] = useState<Weight | null>(null);

  const sortedWeights = useMemo(() => {
    return [...weights].sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`).getTime();
      const dateTimeB = new Date(`${b.date}T${b.time}`).getTime();
      return sortOrder === "asc" ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
    });
  }, [weights, sortOrder]);

  const weightDiffs = useMemo(() => {
    const chronological = [...weights].sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`).getTime();
      const dateTimeB = new Date(`${b.date}T${b.time}`).getTime();
      return dateTimeA - dateTimeB;
    });
    const diffs: Record<number, number | null> = {};
    chronological.forEach((w, i) => {
      if (i === 0) {
        diffs[w.id] = null;
      } else {
        diffs[w.id] = w.weight - chronological[i - 1].weight;
      }
    });
    return diffs;
  }, [weights]);

  const toggleSort = () => {
    Haptics.selectionAsync();
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleDeletePress = (weight: Weight) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWeightToDelete(weight);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (weightToDelete) {
      onDelete(weightToDelete.id);
      setDeleteModalVisible(false);
      setWeightToDelete(null);
    }
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    const locale = language === "pt" ? "pt-BR" : "en-US";
    const dateFormatted = date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
    });
    return `${dateFormatted} ${timeStr}`;
  };

  const formatDiff = (diff: number | null) => {
    if (diff === null) return "--";
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}`;
  };

  const getDiffColor = (diff: number | null) => {
    if (diff === null || diff === 0) return theme.textSecondary;
    return diff < 0
      ? Colors[isDark ? "dark" : "light"].success
      : Colors[isDark ? "dark" : "light"].error;
  };

  if (weights.length === 0) {
    return (
      <View
        style={[
          styles.container,
          styles.emptyContainer,
          {
            backgroundColor: theme.backgroundDefault,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={[styles.emptyIconContainer, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name="clipboard" size={40} color={theme.primary} />
        </View>
        <ThemedText style={styles.emptyTitle}>{t.table.noEntries}</ThemedText>
        <ThemedText style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
          {t.table.noEntriesDescription}
        </ThemedText>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Weight; index: number }) => {
    const diff = weightDiffs[item.id];
    return (
      <Pressable
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: pressed
              ? theme.backgroundSecondary
              : index % 2 === 0
              ? theme.backgroundDefault
              : theme.backgroundSecondary,
          },
        ]}
        onPress={() => {
          Haptics.selectionAsync();
          onEdit(item);
        }}
      >
        <View style={[styles.cell, styles.dateCell]}>
          <ThemedText style={styles.cellText}>
            {formatDateTime(item.date, item.time)}
          </ThemedText>
        </View>
        <View style={[styles.cell, styles.weightCell]}>
          <ThemedText style={[styles.cellText, styles.weightText]}>
            {item.weight.toFixed(1)}
          </ThemedText>
        </View>
        <View style={[styles.cell, styles.diffCell]}>
          <ThemedText style={[styles.cellText, { color: getDiffColor(diff) }]}>
            {formatDiff(diff)}
          </ThemedText>
        </View>
        <View style={styles.actionsCell}>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onEdit(item);
            }}
            style={({ pressed }) => [
              styles.actionButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            hitSlop={8}
          >
            <Feather name="edit-2" size={16} color={theme.primary} />
          </Pressable>
          <Pressable
            onPress={() => handleDeletePress(item)}
            style={({ pressed }) => [
              styles.actionButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            hitSlop={8}
          >
            <Feather name="trash-2" size={16} color={Colors[isDark ? "dark" : "light"].error} />
          </Pressable>
        </View>
      </Pressable>
    );
  };

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
      <View style={styles.header}>
        <ThemedText style={styles.title}>{t.table.title}</ThemedText>
        <Pressable
          onPress={toggleSort}
          style={({ pressed }) => [
            styles.sortButton,
            {
              backgroundColor: theme.backgroundSecondary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Feather
            name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
            size={14}
            color={theme.text}
          />
          <ThemedText style={styles.sortText}>{t.table.dateTime}</ThemedText>
        </Pressable>
      </View>

      <View style={[styles.tableHeader, { borderBottomColor: theme.border }]}>
        <View style={[styles.cell, styles.dateCell]}>
          <ThemedText style={[styles.headerText, { color: theme.textSecondary }]}>
            {t.table.dateTime}
          </ThemedText>
        </View>
        <View style={[styles.cell, styles.weightCell]}>
          <ThemedText style={[styles.headerText, { color: theme.textSecondary }]}>
            kg
          </ThemedText>
        </View>
        <View style={[styles.cell, styles.diffCell]}>
          <ThemedText style={[styles.headerText, { color: theme.textSecondary }]}>
            {t.table.diff}
          </ThemedText>
        </View>
        <View style={styles.actionsCell} />
      </View>

      <FlatList
        data={sortedWeights}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <View style={[styles.modalIconContainer, { backgroundColor: `${Colors[isDark ? "dark" : "light"].error}20` }]}>
              <Feather
                name="alert-triangle"
                size={32}
                color={Colors[isDark ? "dark" : "light"].error}
              />
            </View>
            <ThemedText style={styles.modalTitle}>{t.deleteModal.title}</ThemedText>
            <ThemedText style={[styles.modalMessage, { color: theme.textSecondary }]}>
              {t.deleteModal.message}
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setDeleteModalVisible(false)}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.cancelButton,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <ThemedText>{t.deleteModal.cancel}</ThemedText>
              </Pressable>
              <Pressable
                onPress={confirmDelete}
                disabled={isDeleting}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.deleteButton,
                  {
                    backgroundColor: Colors[isDark ? "dark" : "light"].error,
                    opacity: isDeleting ? 0.5 : pressed ? 0.8 : 1,
                  },
                ]}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                    {t.deleteModal.delete}
                  </ThemedText>
                )}
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xs,
    gap: Spacing.xs,
  },
  sortText: {
    fontSize: 12,
    fontWeight: "500",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  cell: {
    justifyContent: "center",
  },
  dateCell: {
    flex: 2.2,
  },
  weightCell: {
    flex: 1,
  },
  diffCell: {
    flex: 1,
  },
  actionsCell: {
    flexDirection: "row",
    gap: Spacing.sm,
    width: 56,
    justifyContent: "flex-end",
  },
  cellText: {
    fontSize: 13,
  },
  weightText: {
    fontWeight: "500",
  },
  actionButton: {
    padding: Spacing.xs,
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
    maxWidth: 340,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {},
  deleteButton: {},
});
