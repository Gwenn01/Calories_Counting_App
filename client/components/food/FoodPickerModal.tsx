// components/food/FoodPickerModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FOOD_DATA, FOOD_HISTORY } from "@/data/food";

export function FoodPickerModal({ visible, onClose, onSelect }: any) {
  const [query, setQuery] = useState("");

  const filteredFoods = FOOD_DATA.filter((food) =>
    food.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Food</Text>
            <Pressable onPress={onClose}>
              <Feather name="x" size={22} />
            </Pressable>
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Feather name="search" size={16} color="#94a3b8" />
            <TextInput
              placeholder="Search food..."
              value={query}
              onChangeText={setQuery}
              style={styles.input}
            />
          </View>

          {/* History */}
          {!query && (
            <>
              <Text style={styles.section}>Recently Used</Text>
              {FOOD_HISTORY.map((item) => (
                <Pressable
                  key={item}
                  style={styles.row}
                  onPress={() => onSelect(item)}
                >
                  <Text>{item}</Text>
                </Pressable>
              ))}
            </>
          )}

          {/* Results */}
          <FlatList
            data={filteredFoods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable style={styles.row} onPress={() => onSelect(item)}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.kcal}>{item.calories} kcal</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  section: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
  },
  kcal: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
