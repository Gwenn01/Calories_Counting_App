import { View, Text, Pressable, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  iconBg: string;
  onPress: () => void;
};

const ActionButton = ({ icon, label, iconBg, onPress }: ActionButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();

  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className="flex-1"
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="items-center bg-white border border-slate-100 rounded-[20px] pt-4 pb-3 "
      >
        {/* Solid colored icon square */}
        <View
          className="w-11 h-11 rounded-[14px] items-center justify-center"
          style={{
            backgroundColor: iconBg,
            shadowColor: iconBg,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {icon}
        </View>

        <Text
          className="text-slate-900"
          style={{ fontSize: 11, fontWeight: "700", letterSpacing: 0.1 }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

type Props = {
  onAddManual: () => void;
  onFoodBot: () => void;
  onScanBarcode: () => void;
  onAddByPhoto: () => void;
};

export const FoodActions = ({
  onAddManual,
  onFoodBot,
  onScanBarcode,
  onAddByPhoto,
}: Props) => (
  <View className="flex-row mb-6">
    <ActionButton
      label="Create"
      iconBg="#3b82f6"
      onPress={onAddManual}
      icon={<Feather name="edit-2" size={18} color="white" />}
    />
    <ActionButton
      label="Food Bot"
      iconBg="#10b981"
      onPress={onFoodBot}
      icon={
        <MaterialCommunityIcons
          name="robot-excited-outline"
          size={21}
          color="white"
        />
      }
    />
    <ActionButton
      label="Barcode"
      iconBg="#f97316"
      onPress={onScanBarcode}
      icon={
        <MaterialCommunityIcons name="barcode-scan" size={21} color="white" />
      }
    />
    <ActionButton
      label="Photo"
      iconBg="#a855f7"
      onPress={onAddByPhoto}
      icon={<Feather name="camera" size={18} color="white" />}
    />
  </View>
);
