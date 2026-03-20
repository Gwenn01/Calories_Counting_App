import { View, Text, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// components
import { FoodListHeading } from "./FoodlistHeading";
import { FoodActions } from "./FoodAction";

type Props = {
  totalFoods: number;
  search: string;
  onSearchChange: (text: string) => void;
  onAddManual: () => void;
  onFoodBot: () => void;
  onScanBarcode: () => void;
  onAddByPhoto: () => void;
};

export const FoodListHeader = ({
  totalFoods,
  search,
  onSearchChange,
  onAddManual,
  onFoodBot,
  onScanBarcode,
  onAddByPhoto,
}: Props) => (
  <>
    {/* HEADER =========================================== */}
    <FoodListHeading totalFoods={totalFoods} />

    {/* SEARCH BAR =========================================== */}
    <View className="flex-row items-center bg-slate-900 border border-slate-700/50 rounded-3xl px-4 py-4 mb-5">
      <Feather name="search" size={15} color="#475569" />
      <TextInput
        placeholder="Search food..."
        placeholderTextColor="#475569"
        value={search}
        onChangeText={onSearchChange}
        className="flex-1 text-sm text-slate-200"
        style={{ paddingVertical: 0 }}
      />
      {/* Filter pill */}
      <Pressable className="flex-row items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
        <Feather name="filter" size={12} color="#10b981" />
        <Text className="text-[11px] font-semibold text-emerald-500 tracking-wide">
          Filter
        </Text>
      </Pressable>
    </View>

    {/* BUTTONS ========================================================== */}
    <FoodActions
      onAddManual={onAddManual}
      onFoodBot={onFoodBot}
      onScanBarcode={onScanBarcode}
      onAddByPhoto={onAddByPhoto}
    />
  </>
);
