import { Pressable, View, Text, ActivityIndicator } from "react-native";
import { Plus } from "lucide-react-native"; // Using Lucide to match the previous icons

type AddSetButtonProps = {
  onPress: () => void;
  addingSet: boolean;
};

export default function AddSetButton({
  onPress,
  addingSet,
}: AddSetButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={addingSet}
      // "overflow-hidden" ensures the background color doesn't bleed over the parent's rounded corners
      // "rounded-b-[12px]" matches your container's bottom rounding
      className={`
        mt-auto flex-row items-center justify-center py-3
        bg-slate-50/50 active:bg-slate-100 
        border-t border-slate-200 rounded-b-[12px] overflow-hidden
      `}
    >
      {addingSet ? (
        <ActivityIndicator size="small" color="#94a3b8" />
      ) : (
        <View className="flex-row items-center gap-1.5">
          {/* Slightly bolder icon and text for better tap-target visibility */}
          <Plus size={14} color="#64748b" strokeWidth={3} />
          <Text className="text-[13px] font-semibold text-slate-500">
            Add Set
          </Text>
        </View>
      )}
    </Pressable>
  );
}
