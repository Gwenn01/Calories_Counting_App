// components/WorkoutProfileCard.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Scale,
  Timer,
  Zap,
  TrendingUp,
  Activity,
  Edit3,
  Plus,
} from "lucide-react-native";

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

export default function WorkoutProfileCard({ profile, onOpenModal }: Props) {
  return (
    <View className="bg-white mb-3 p-5 rounded-[28px] shadow-sm border border-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center gap-3">
          <View className="bg-green-100 p-2.5 rounded-xl">
            <Activity size={24} color="#16a34a" />
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900 tracking-tight">
              Workout Profile
            </Text>
            <Text className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-0.5">
              Training Config
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onOpenModal}
          activeOpacity={0.7}
          className="bg-green-50 flex-row items-center gap-1.5 px-3 py-2 rounded-xl border border-green-100"
        >
          {profile ? (
            <>
              <Edit3 size={14} color="#16a34a" />
              <Text className="text-green-600 font-bold text-sm">Edit</Text>
            </>
          ) : (
            <>
              <Plus size={16} color="#16a34a" />
              <Text className="text-green-600 font-bold text-sm">Create</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      {profile ? (
        <View className="flex-row flex-wrap justify-between">
          <InfoTile
            label="Unit"
            value={profile.weight_unit.toUpperCase()}
            icon={<Scale size={18} color="#9ca3af" />}
          />
          <InfoTile
            label="Rest"
            value={`${profile.default_rest_time}s`}
            icon={<Timer size={18} color="#9ca3af" />}
          />
          <InfoTile
            label="Level"
            value={capitalize(profile.experience_level)}
            icon={<Zap size={18} color="#9ca3af" />}
          />
          <InfoTile
            label="Method"
            value={capitalize(profile.progression_type)}
            icon={<TrendingUp size={18} color="#9ca3af" />}
          />
        </View>
      ) : (
        <View className="py-8 items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
          <Activity size={32} color="#d1d5db" className="mb-2" />
          <Text className="text-gray-400 font-medium">
            No profile data found
          </Text>
        </View>
      )}
    </View>
  );
}

function InfoTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <View className="w-[48%] bg-gray-50/50 p-4 rounded-2xl mb-3 border border-gray-50">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
          {label}
        </Text>
        {icon}
      </View>
      <Text className="text-gray-800 font-bold text-lg">{value}</Text>
    </View>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
