import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FoodPickerModal } from "@/components/food/FoodPickerModal";
import type { FoodItem } from "@/types/foods";

export default function AddFoodScreen() {
  type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

  const router = useRouter();
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [activeMeal, setActiveMeal] = useState<MealType | null>(null);

  // Mock data
  const goal = 2000;
  const food = 850;
  const exercise = 200;
  const remaining = goal - food + exercise;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Date */}
        <View style={styles.header}>
          <Pressable style={styles.navButton}>
            <Feather name="chevron-left" size={22} color="#0f172a" />
          </Pressable>

          <View>
            <Text style={styles.subtitle}>Today</Text>
            <Text style={styles.title}>Feb 1, 2026</Text>
          </View>

          <Pressable style={styles.navButton}>
            <Feather name="chevron-right" size={22} color="#0f172a" />
          </Pressable>
        </View>

        {/* Calories Remaining Card */}
        <View style={styles.calorieCard}>
          <Text style={styles.cardTitle}>Calories Remaining</Text>

          <View style={styles.calorieRow}>
            <CalorieItem label="Goal" value={goal} />
            <Text style={styles.operator}>−</Text>
            <CalorieItem label="Food" value={food} />
            <Text style={styles.operator}>+</Text>
            <CalorieItem label="Exercise" value={exercise} />
            <Text style={styles.operator}>=</Text>
            <View style={styles.remainingBox}>
              <Text style={styles.remainingValue}>{remaining}</Text>
              <Text style={styles.remainingLabel}>Remaining</Text>
            </View>
          </View>
        </View>

        {/* Add Food */}
        <MealCard title="Breakfast" onAdd={() => setShowFoodModal(true)} />

        <FoodPickerModal
          visible={showFoodModal}
          onClose={() => setShowFoodModal(false)}
          onSelect={(food: FoodItem) => {
            console.log("Selected food:", food);
            setShowFoodModal(false);
          }}
        />

        {/* Meals */}
        <MealCard title="Breakfast" onAdd={() => router.push("/add-food")} />
        <MealCard title="Lunch" onAdd={() => router.push("/add-food")} />
        <MealCard title="Dinner" onAdd={() => router.push("/add-food")} />
        <MealCard title="Snacks" onAdd={() => router.push("/add-food")} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

function CalorieItem({ label, value }: any) {
  return (
    <View style={styles.calorieItem}>
      <Text style={styles.calorieValue}>{value}</Text>
      <Text style={styles.calorieLabel}>{label}</Text>
    </View>
  );
}

function MealCard({ title, onAdd }: any) {
  return (
    <View style={styles.mealCard}>
      <View>
        <Text style={styles.mealTitle}>{title}</Text>
        <Text style={styles.mealSub}>No food logged</Text>
      </View>

      <Pressable style={styles.addButton} onPress={onAdd}>
        <Feather name="plus" size={18} color="#10b981" />
        <Text style={styles.addText}>Add Food</Text>
      </Pressable>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  navButton: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
  },

  /* Calories Card */
  calorieCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#64748b",
    marginBottom: 16,
  },
  calorieRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  calorieItem: {
    alignItems: "center",
    minWidth: 60,
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  calorieLabel: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
  operator: {
    fontSize: 18,
    fontWeight: "800",
    color: "#94a3b8",
    marginHorizontal: 4,
  },
  remainingBox: {
    backgroundColor: "#0f172a",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  remainingValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#22c55e",
  },
  remainingLabel: {
    fontSize: 11,
    color: "#94a3b8",
  },

  /* Meals */
  mealCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  mealSub: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  addText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "700",
    color: "#10b981",
  },
});
