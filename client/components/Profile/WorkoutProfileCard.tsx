// components/WorkoutProfileCard.tsx

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Edit3, Plus } from "lucide-react-native";

export interface FitnessProfile {
  id?: number;
  weight_unit: "kg" | "lbs";
  default_rest_time: number;
  experience_level: "beginner" | "intermediate" | "advanced";
  progression_type: "linear" | "double" | "percentage" | "rpe";
  progression_increment_kg: number;
  progression_increment_lbs: number;
  updated_at?: string;
}

type Props = {
  profile: FitnessProfile | null;
  onOpenModal: () => void;
};

const TILE_META: Record<
  string,
  { icon: string; color: string; bg: string; border: string }
> = {
  weight_unit: {
    icon: "maximize-2",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#dbeafe",
  },
  rest_time: {
    icon: "clock",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#ffedd5",
  },
  experience: {
    icon: "zap",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ede9fe",
  },
  progression: {
    icon: "trending-up",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#dcfce7",
  },
  inc_kg: {
    icon: "activity",
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "#fce7f3",
  },
  inc_lbs: {
    icon: "activity",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fef3c7",
  },
};

export default function WorkoutProfileCard({ profile, onOpenModal }: Props) {
  return (
    <View
      className="bg-white mb-3 p-5 rounded-[28px]"
      style={{
        borderWidth: 1,
        borderColor: "#f1f5f9",
        shadowColor: "#94a3b8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Text className="text-xs font-bold tracking-widest text-slate-400 uppercase flex-1">
          WORKOUT PROFILE
        </Text>

        <Pressable
          onPress={onOpenModal}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "#f0fdf4",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#bbf7d0",
          })}
        >
          {profile ? (
            <View className="flex-row items-center" style={{ gap: 4 }}>
              <Edit3 size={12} color="#16a34a" />
              <Text className="text-emerald-600 font-bold text-xs">Edit</Text>
            </View>
          ) : (
            <View className="flex-row items-center" style={{ gap: 4 }}>
              <Plus size={12} color="#16a34a" />
              <Text className="text-emerald-600 font-bold text-xs">Create</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Content */}
      {profile ? (
        <View className="flex-row flex-wrap justify-between">
          <InfoTile
            metaKey="weight_unit"
            label="Unit"
            value={profile.weight_unit.toUpperCase()}
          />
          <InfoTile
            metaKey="rest_time"
            label="Rest"
            value={`${profile.default_rest_time}`}
            unit="sec"
          />
          <InfoTile
            metaKey="experience"
            label="Level"
            value={capitalize(profile.experience_level)}
          />
          <InfoTile
            metaKey="progression"
            label="Method"
            value={capitalize(profile.progression_type)}
          />
          <InfoTile
            metaKey="inc_kg"
            label="Inc KG"
            value={`${profile.progression_increment_kg}`}
            unit="kg"
          />
          <InfoTile
            metaKey="inc_lbs"
            label="Inc LBS"
            value={`${profile.progression_increment_lbs}`}
            unit="lbs"
          />
        </View>
      ) : (
        <View
          className="py-8 items-center justify-center rounded-2xl"
          style={{
            borderWidth: 2,
            borderColor: "#f1f5f9",
            borderStyle: "dashed",
            backgroundColor: "#f8fafc",
          }}
        >
          <Text className="text-slate-400 font-medium text-sm">
            No workout profile yet
          </Text>
          <Text className="text-slate-300 text-xs mt-1">
            Tap Create to set up your profile
          </Text>
        </View>
      )}
    </View>
  );
}

/* ---------- InfoTile ---------- */

function InfoTile({
  metaKey,
  label,
  value,
  unit,
}: {
  metaKey: string;
  label: string;
  value: string;
  unit?: string;
}) {
  const meta = TILE_META[metaKey] ?? {
    icon: "bar-chart-2",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };

  return (
    <View
      className="w-[48%] items-center rounded-[18px] px-3 py-3 mb-3"
      style={{
        backgroundColor: meta.bg,
        borderWidth: 1,
        borderColor: meta.border,
      }}
    >
      {/* Icon chip */}
      <View
        className="w-8 h-8 rounded-[11px] items-center justify-center mb-2"
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: meta.border,
          shadowColor: meta.color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Feather name={meta.icon as any} size={13} color={meta.color} />
      </View>

      {/* Value + unit */}
      <View className="flex-row items-baseline" style={{ gap: 2 }}>
        <Text
          className="font-black"
          style={{ fontSize: 16, color: meta.color, letterSpacing: -0.4 }}
        >
          {value}
        </Text>
        {unit && (
          <Text
            className="font-semibold text-slate-400"
            style={{ fontSize: 9 }}
          >
            {unit}
          </Text>
        )}
      </View>

      {/* Label */}
      <Text
        className="font-bold text-slate-400 uppercase mt-0.5"
        style={{ fontSize: 8, letterSpacing: 1 }}
      >
        {label}
      </Text>
    </View>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
