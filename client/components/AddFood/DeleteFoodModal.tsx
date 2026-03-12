import { Modal, View, Text, Pressable } from "react-native";

interface DeleteFoodModalProps {
  visible: boolean;
  selectedLogId: number | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export default function DeleteFoodModal({
  visible,
  selectedLogId,
  onClose,
  onDelete,
}: DeleteFoodModalProps) {
  const handleDelete = () => {
    if (selectedLogId !== null) {
      onDelete(selectedLogId);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <View className="bg-white p-6 rounded-2xl w-full max-w-[320px]">
          <Text className="text-lg font-bold text-slate-900 mb-2">
            Remove Food?
          </Text>

          <Text className="text-slate-500 mb-5">
            This food will be removed from your log.
          </Text>

          <View className="flex-row justify-end space-x-3">
            <Pressable onPress={onClose} className="px-4 py-2">
              <Text className="text-slate-500 font-medium">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              className="px-4 py-2 bg-red-500 rounded-lg active:bg-red-600"
            >
              <Text className="text-white font-bold">Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
