import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import LoadingOverlay from "@/components/LoadingOverplay";
import { useToast } from "@/components/ToastProvider";
import { createFood } from "../../api/food";

const SectionHeader = ({ title }: { title: string }) => (
  <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 mt-5">
    {title}
  </Text>
);

const Field = ({
  placeholder,
  value,
  onChange,
  numeric,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
}) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    keyboardType={numeric ? "numeric" : "default"}
    onChangeText={onChange}
    placeholderTextColor="#94a3b8"
    className="border border-slate-200 bg-slate-50 p-4 mb-2 rounded-xl text-slate-800"
  />
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <View className="flex-row gap-2">{children}</View>
);

const HalfField = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <View className="flex-1">
    <TextInput
      placeholder={placeholder}
      value={value}
      keyboardType="numeric"
      onChangeText={onChange}
      placeholderTextColor="#94a3b8"
      className="border border-slate-200 bg-slate-50 p-4 mb-2 rounded-xl text-slate-800"
    />
  </View>
);

export function AddFoodManualModal({ visible, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [pasteText, setPasteText] = useState("");
  const [form, setForm] = useState({
    // Basic
    name: "",
    serving: "",
    calories: "",
    water: "",

    // Fats
    total_fat: "",
    saturated_fat: "",
    monounsaturated_fat: "",
    polyunsaturated_fat: "",
    cholesterol: "",

    // Carbs
    total_carbs: "",
    starch: "",
    sugars: "",
    fiber: "",

    // Protein
    protein: "",

    // Vitamins
    vitamin_a: "",
    vitamin_c: "",
    vitamin_e: "",
    vitamin_k: "",
    thiamin_b1: "",
    riboflavin_b2: "",
    niacin_b3: "",
    vitamin_b6: "",
    folate_b9: "",

    // Minerals
    calcium: "",
    iron: "",
    magnesium: "",
    phosphorus: "",
    potassium: "",
    sodium: "",
    zinc: "",
    copper: "",
    manganese: "",
  });

  const set = (key: string) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const numericFields = [
    "calories",
    "water",
    "total_fat",
    "saturated_fat",
    "monounsaturated_fat",
    "polyunsaturated_fat",
    "cholesterol",
    "total_carbs",
    "starch",
    "sugars",
    "fiber",
    "protein",
    "vitamin_a",
    "vitamin_c",
    "vitamin_e",
    "vitamin_k",
    "thiamin_b1",
    "riboflavin_b2",
    "niacin_b3",
    "vitamin_b6",
    "folate_b9",
    "calcium",
    "iron",
    "magnesium",
    "phosphorus",
    "potassium",
    "sodium",
    "zinc",
    "copper",
    "manganese",
  ];
  // handle functions
  const handlePasteNutrition = () => {
    try {
      const parsed = JSON.parse(pasteText);

      setForm((prev) => {
        const updated = { ...prev };

        Object.keys(parsed).forEach((key) => {
          if (key in updated) {
            const typedKey = key as keyof typeof prev;
            updated[typedKey] = String(parsed[key]);
          }
        });

        return updated;
      });

      showToast("Success", "Nutrition data imported.", "success");
    } catch (error) {
      showToast("Error", "Invalid JSON format.", "error");
    }
  };

  const handleSubmit = async () => {
    const payload: Record<string, any> = { ...form };
    numericFields.forEach((k) => {
      if (payload[k] !== "") payload[k] = Number(payload[k]);
    });
    try {
      setLoading(true);
      const newFood = await createFood(payload);
      showToast("Success!", "Food Created Successfully.", "success");
      onClose();
    } catch (error) {
      console.error("Create food error:", error);
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        {loading && <LoadingOverlay text="Creating food..." />}
        <View className="bg-white rounded-t-3xl max-h-[92%] p-5">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xl font-bold text-slate-800">
              Add Food Manually
            </Text>
            <Pressable onPress={onClose} className="p-1">
              <Feather name="x" size={22} color="#64748b" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {/* ── General ── */}
            <SectionHeader title="Paste Nutrition JSON" />
            <View className="mb-4">
              <TextInput
                multiline
                value={pasteText}
                onChangeText={setPasteText}
                placeholder="Paste nutrition JSON here"
                className="border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm"
                style={{ minHeight: 100 }}
              />

              <Pressable
                onPress={handlePasteNutrition}
                className="bg-emerald-500 py-3 rounded-xl mt-2"
              >
                <Text className="text-white text-center font-semibold">
                  Auto Fill Fields
                </Text>
              </Pressable>
            </View>
            {/* ── General ── */}
            <SectionHeader title="General" />
            <Field
              placeholder="Food name"
              value={form.name}
              onChange={set("name")}
            />
            <Field
              placeholder="Serving (e.g. 1 pack 300 ml)"
              value={form.serving}
              onChange={set("serving")}
            />
            <Row>
              <HalfField
                placeholder="Calories (kcal)"
                value={form.calories}
                onChange={set("calories")}
              />
              <HalfField
                placeholder="Water (ml)"
                value={form.water}
                onChange={set("water")}
              />
            </Row>

            {/* ── Macros ── */}
            <SectionHeader title="Macronutrients" />
            <Field
              placeholder="Protein (g)"
              value={form.protein}
              onChange={set("protein")}
              numeric
            />
            <Field
              placeholder="Total Carbs (g)"
              value={form.total_carbs}
              onChange={set("total_carbs")}
              numeric
            />
            <Row>
              <HalfField
                placeholder="Starch (g)"
                value={form.starch}
                onChange={set("starch")}
              />
              <HalfField
                placeholder="Sugars (g)"
                value={form.sugars}
                onChange={set("sugars")}
              />
            </Row>
            <Field
              placeholder="Fiber (g)"
              value={form.fiber}
              onChange={set("fiber")}
              numeric
            />

            {/* ── Fats ── */}
            <SectionHeader title="Fats" />
            <Field
              placeholder="Total Fat (g)"
              value={form.total_fat}
              onChange={set("total_fat")}
              numeric
            />
            <Row>
              <HalfField
                placeholder="Saturated (g)"
                value={form.saturated_fat}
                onChange={set("saturated_fat")}
              />
              <HalfField
                placeholder="Cholesterol (mg)"
                value={form.cholesterol}
                onChange={set("cholesterol")}
              />
            </Row>
            <Row>
              <HalfField
                placeholder="Monounsat. (g)"
                value={form.monounsaturated_fat}
                onChange={set("monounsaturated_fat")}
              />
              <HalfField
                placeholder="Polyunsat. (g)"
                value={form.polyunsaturated_fat}
                onChange={set("polyunsaturated_fat")}
              />
            </Row>

            {/* ── Vitamins ── */}
            <SectionHeader title="Vitamins" />
            <Row>
              <HalfField
                placeholder="Vitamin A (µg)"
                value={form.vitamin_a}
                onChange={set("vitamin_a")}
              />
              <HalfField
                placeholder="Vitamin C (mg)"
                value={form.vitamin_c}
                onChange={set("vitamin_c")}
              />
            </Row>
            <Row>
              <HalfField
                placeholder="Vitamin E (mg)"
                value={form.vitamin_e}
                onChange={set("vitamin_e")}
              />
              <HalfField
                placeholder="Vitamin K (µg)"
                value={form.vitamin_k}
                onChange={set("vitamin_k")}
              />
            </Row>
            <Row>
              <HalfField
                placeholder="B1 Thiamin (mg)"
                value={form.thiamin_b1}
                onChange={set("thiamin_b1")}
              />
              <HalfField
                placeholder="B2 Riboflavin (mg)"
                value={form.riboflavin_b2}
                onChange={set("riboflavin_b2")}
              />
            </Row>
            <Row>
              <HalfField
                placeholder="B3 Niacin (mg)"
                value={form.niacin_b3}
                onChange={set("niacin_b3")}
              />
              <HalfField
                placeholder="B6 (mg)"
                value={form.vitamin_b6}
                onChange={set("vitamin_b6")}
              />
            </Row>
            <Field
              placeholder="B9 Folate (µg)"
              value={form.folate_b9}
              onChange={set("folate_b9")}
              numeric
            />

            {/* ── Minerals ── */}
            <SectionHeader title="Minerals" />
            <Row>
              <HalfField
                placeholder="Calcium (mg)"
                value={form.calcium}
                onChange={set("calcium")}
              />
              <HalfField
                placeholder="Iron (mg)"
                value={form.iron}
                onChange={set("iron")}
              />
            </Row>
            <Row>
              <HalfField
                placeholder="Magnesium (mg)"
                value={form.magnesium}
                onChange={set("magnesium")}
              />
              <HalfField
                placeholder="Phosphorus (mg)"
                value={form.phosphorus}
                onChange={set("phosphorus")}
              />
            </Row>
            <Row>
              <HalfField
                placeholder="Potassium (mg)"
                value={form.potassium}
                onChange={set("potassium")}
              />
              <HalfField
                placeholder="Sodium (mg)"
                value={form.sodium}
                onChange={set("sodium")}
              />
            </Row>
            <Row>
              <HalfField
                placeholder="Zinc (mg)"
                value={form.zinc}
                onChange={set("zinc")}
              />
              <HalfField
                placeholder="Copper (mg)"
                value={form.copper}
                onChange={set("copper")}
              />
            </Row>
            <Field
              placeholder="Manganese (mg)"
              value={form.manganese}
              onChange={set("manganese")}
              numeric
            />

            <View className="h-6" />
          </ScrollView>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-black py-4 rounded-xl mt-3"
          >
            <Text className="text-white text-center font-semibold text-base">
              Save Food
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
