import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Svg, { Path, Circle, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Weight } from "@/types/weight";

interface WeightChartProps {
  weights: Weight[];
}

export function WeightChart({ weights }: WeightChartProps) {
  const { theme, isDark } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - Spacing.lg * 4;
  const chartHeight = 200;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 35;

  const sortedWeights = useMemo(() => {
    return [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [weights]);

  const { path, areaPath, points, yAxisLabels, xAxisLabels } = useMemo(() => {
    if (sortedWeights.length === 0) {
      return { path: "", areaPath: "", points: [], yAxisLabels: [], xAxisLabels: [] };
    }

    const weightValues = sortedWeights.map((w) => w.weight);
    const minWeight = Math.floor(Math.min(...weightValues) - 2);
    const maxWeight = Math.ceil(Math.max(...weightValues) + 2);
    const range = maxWeight - minWeight || 1;

    const graphWidth = chartWidth - paddingLeft - paddingRight;
    const graphHeight = chartHeight - paddingTop - paddingBottom;

    const pts = sortedWeights.map((w, i) => {
      const x =
        paddingLeft +
        (sortedWeights.length > 1
          ? (i / (sortedWeights.length - 1)) * graphWidth
          : graphWidth / 2);
      const y =
        paddingTop +
        graphHeight -
        ((w.weight - minWeight) / range) * graphHeight;
      return { x, y, weight: w, date: w.date };
    });

    let pathD = "";
    let areaPathD = "";

    if (pts.length === 1) {
      pathD = `M ${pts[0].x} ${pts[0].y}`;
      areaPathD = pathD;
    } else if (pts.length > 1) {
      pathD = pts.reduce((acc, pt, i) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`;
        const prev = pts[i - 1];
        const cp1x = prev.x + (pt.x - prev.x) / 3;
        const cp2x = prev.x + (2 * (pt.x - prev.x)) / 3;
        return `${acc} C ${cp1x} ${prev.y} ${cp2x} ${pt.y} ${pt.x} ${pt.y}`;
      }, "");

      areaPathD =
        pathD +
        ` L ${pts[pts.length - 1].x} ${paddingTop + graphHeight}` +
        ` L ${pts[0].x} ${paddingTop + graphHeight} Z`;
    }

    const yLabels = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const value = minWeight + (range * i) / steps;
      const y = paddingTop + graphHeight - (i / steps) * graphHeight;
      yLabels.push({ value: value.toFixed(0), y });
    }

    const xLabels = [];
    const maxXLabels = Math.min(5, sortedWeights.length);
    const step = Math.max(1, Math.floor(sortedWeights.length / maxXLabels));
    for (let i = 0; i < sortedWeights.length; i += step) {
      const date = new Date(sortedWeights[i].date);
      const label = `${date.getDate()}/${date.getMonth() + 1}`;
      xLabels.push({
        label,
        x: pts[i].x,
      });
    }

    return { path: pathD, areaPath: areaPathD, points: pts, yAxisLabels: yLabels, xAxisLabels: xLabels };
  }, [sortedWeights, chartWidth]);

  if (sortedWeights.length === 0) {
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
          <Feather name="trending-up" size={40} color={theme.primary} />
        </View>
        <ThemedText style={styles.emptyTitle}>No data yet</ThemedText>
        <ThemedText style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
          Add your first weight entry to see your progress chart
        </ThemedText>
      </View>
    );
  }

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
      <ThemedText style={styles.title}>Weight Evolution</ThemedText>
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={theme.primary} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={theme.primary} stopOpacity="0.05" />
            </LinearGradient>
          </Defs>

          {yAxisLabels.map((label, i) => (
            <G key={`y-${i}`}>
              <Line
                x1={paddingLeft}
                y1={label.y}
                x2={chartWidth - paddingRight}
                y2={label.y}
                stroke={theme.chartGrid}
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <SvgText
                x={paddingLeft - 8}
                y={label.y + 4}
                fontSize="11"
                fill={theme.textSecondary}
                textAnchor="end"
              >
                {label.value}
              </SvgText>
            </G>
          ))}

          {xAxisLabels.map((label, i) => (
            <SvgText
              key={`x-${i}`}
              x={label.x}
              y={chartHeight - 8}
              fontSize="10"
              fill={theme.textSecondary}
              textAnchor="middle"
            >
              {label.label}
            </SvgText>
          ))}

          {areaPath ? (
            <Path d={areaPath} fill="url(#areaGradient)" />
          ) : null}

          {path ? (
            <Path
              d={path}
              stroke={theme.chartLine}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {points.map((pt, i) => (
            <G key={i}>
              <Circle
                cx={pt.x}
                cy={pt.y}
                r="6"
                fill={theme.backgroundDefault}
                stroke={theme.chartLine}
                strokeWidth="2.5"
              />
            </G>
          ))}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
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
    maxWidth: 250,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  chartContainer: {
    alignItems: "center",
  },
});
