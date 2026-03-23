import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";

interface Props {
  protein: number;
  carbs: number;
  fats: number;
  direction: "left" | "right";
}

export default function MacroCards({ protein, carbs, fats, direction }: Props) {
  const slideFrom = direction === "right" ? 40 : -40;
  const cards = [
    {
      label: "Protein",
      value: Math.round(protein),
      icon: "target",
      iconColor: "#7c3aed",
      bg: "bg-violet-50",
      border: "border-violet-100",
      textValue: "text-violet-900",
      textLabel: "text-violet-600",
      barColor: "#7c3aed",
    },
    {
      label: "Carbs",
      value: Math.round(carbs),
      icon: "zap",
      iconColor: "#2563eb",
      bg: "bg-blue-50",
      border: "border-blue-100",
      textValue: "text-blue-900",
      textLabel: "text-blue-600",
      barColor: "#2563eb",
    },
    {
      label: "Fat",
      value: Math.round(fats),
      icon: "droplet",
      iconColor: "#dc2626",
      bg: "bg-red-50",
      border: "border-red-100",
      textValue: "text-red-900",
      textLabel: "text-red-600",
      barColor: "#dc2626",
    },
  ] as const;

  return (
    <View className="flex-row justify-between gap-3 mb-6">
      {cards.map((card, index) => (
        <MotiView
          key={card.label}
          from={{ opacity: 0, translateX: slideFrom }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{
            type: "timing",
            duration: 300,
            delay: index * 60,
          }}
          className={`flex-1 ${card.bg} rounded-2xl p-4 items-center border ${card.border}`}
        >
          <Feather name={card.icon as any} size={20} color={card.iconColor} />

          <Text className={`${card.textValue} font-black text-xl mt-2`}>
            {card.value}g
          </Text>

          <Text
            className={`${card.textLabel} font-semibold text-[10px] uppercase mt-1`}
          >
            {card.label}
          </Text>

          <View
            className="w-full h-1 rounded-full mt-3 overflow-hidden"
            style={{ backgroundColor: card.barColor + "20" }}
          >
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: card.barColor,
                width: `${Math.min(card.value, 100)}%`,
              }}
            />
          </View>
        </MotiView>
      ))}
    </View>
  );
}
