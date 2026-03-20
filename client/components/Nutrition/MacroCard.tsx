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
          from={{ opacity: 0, translateX: slideFrom, scale: 0.92 }}
          animate={{ opacity: 1, translateX: 0, scale: 1 }}
          transition={{
            type: "spring",
            delay: index * 60, // stagger still works
            stiffness: 180,
            damping: 18,
          }}
          className={`flex-1 ${card.bg} rounded-2xl p-4 items-center border ${card.border}`}
        >
          {/* Icon with a subtle pulse ring */}
          <MotiView
            from={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              delay: index * 80 + 120,
              stiffness: 200,
              damping: 14,
            }}
            className="mb-2 items-center justify-center"
          >
            <Feather name={card.icon as any} size={20} color={card.iconColor} />
          </MotiView>

          {/* Value — pops in after icon */}
          <MotiView
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 300,
              delay: index * 80 + 180,
            }}
          >
            <Text className={`${card.textValue} font-black text-xl`}>
              {card.value}g
            </Text>
          </MotiView>

          {/* Label */}
          <Text
            className={`${card.textLabel} font-semibold text-[10px] uppercase mt-1`}
          >
            {card.label}
          </Text>

          {/*  Animated progress bar — grows from 0 to value width */}
          <View
            className="w-full h-1 rounded-full mt-3 overflow-hidden"
            style={{ backgroundColor: card.barColor + "20" }}
          >
            <MotiView
              from={{ width: "0%" }}
              animate={{ width: `${Math.min(card.value, 100)}%` }}
              transition={{
                type: "timing",
                duration: 600,
                delay: index * 80 + 250,
              }}
              className="h-full rounded-full"
              style={{ backgroundColor: card.barColor }}
            />
          </View>
        </MotiView>
      ))}
    </View>
  );
}
