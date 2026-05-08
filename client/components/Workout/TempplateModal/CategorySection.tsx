import React from "react";
import { View, Text, Pressable } from "react-native";
import { Section } from "./Section";

const CATEGORIES = [
  "push",
  "pull",
  "legs",
  "upper",
  "lower",
  "full_body",
  "cardio",
];

type Props = {
  category: string;
  onCategoryChange: (cat: string) => void;
};

export default function CategorySection({ category, onCategoryChange }: Props) {
  return (
    <Section label="Category">
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => onCategoryChange(cat)}
            className={`py-2 px-4 rounded-xl border items-center ${
              category === cat
                ? "bg-orange-50 border-orange-400"
                : "bg-white border-slate-200"
            }`}
          >
            <Text
              className={`font-bold text-xs capitalize ${
                category === cat ? "text-orange-500" : "text-slate-400"
              }`}
            >
              {cat.replace("_", " ")}
            </Text>
          </Pressable>
        ))}
      </View>
    </Section>
  );
}
