import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import LoadingOverlay from "@/components/LoadingOverplay";
import { useToast } from "@/components/ToastProvider";
import { createFood } from "../../api/food";

// ─── Sub-components ───────────────────────────────────────────────

const SectionHeader = ({
  title,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor?: string;
}) => (
  <View className="flex-row items-center gap-2.5 mt-6 mb-3">
    <View
      className="w-7 h-7 rounded-lg items-center justify-center"
      style={{ backgroundColor: iconBg }}
    >
      {icon}
    </View>
    <Text
      className="text-slate-700"
      style={{ fontSize: 13, fontWeight: "700", letterSpacing: 0.3 }}
    >
      {title}
    </Text>
    <View className="flex-1 h-px bg-slate-100 ml-1" />
  </View>
);

const Field = ({
  placeholder,
  value,
  onChange,
  numeric,
  icon,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
  icon?: React.ReactNode;
}) => (
  <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-0 mb-2.5 gap-2">
    {icon && <View className="opacity-40">{icon}</View>}
    <TextInput
      placeholder={placeholder}
      value={value}
      keyboardType={numeric ? "numeric" : "default"}
      onChangeText={onChange}
      placeholderTextColor="#94a3b8"
      className="flex-1 text-slate-800 py-3.5 text-sm"
      style={{ paddingVertical: 14 }}
    />
  </View>
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
  <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 mb-2.5">
    <TextInput
      placeholder={placeholder}
      value={value}
      keyboardType="numeric"
      onChangeText={onChange}
      placeholderTextColor="#94a3b8"
      className="text-slate-800 text-sm"
      style={{ paddingVertical: 14 }}
    />
  </View>
);

// ─── Main Modal ───────────────────────────────────────────────────

export function AddFoodManualModal({ visible, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [pasteText, setPasteText] = useState(`{
    "name": "",
    "serving": "",
    "calories": "",
    "water": "",
    "total_fat": "",
    "saturated_fat": "",
    "monounsaturated_fat": "",
    "polyunsaturated_fat": "",
    "cholesterol": "",
    "total_carbs": "",
    "starch": "",
    "sugars": "",
    "fiber": "",
    "protein": "",
    "vitamin_a": "",
    "vitamin_c": "",
    "vitamin_e": "",
    "vitamin_k": "",
    "thiamin_b1": "",
    "riboflavin_b2": "",
    "niacin_b3": "",
    "vitamin_b6": "",
    "folate_b9": "",
    "calcium": "",
    "iron": "",
    "magnesium": "",
    "phosphorus": "",
    "potassium": "",
    "sodium": "",
    "zinc": "",
    "copper": "",
    "manganese": ""
  }`);

  const [form, setForm] = useState({
    name: "",
    serving: "",
    calories: "",
    water: "",
    total_fat: "",
    saturated_fat: "",
    monounsaturated_fat: "",
    polyunsaturated_fat: "",
    cholesterol: "",
    total_carbs: "",
    starch: "",
    sugars: "",
    fiber: "",
    protein: "",
    vitamin_a: "",
    vitamin_c: "",
    vitamin_e: "",
    vitamin_k: "",
    thiamin_b1: "",
    riboflavin_b2: "",
    niacin_b3: "",
    vitamin_b6: "",
    folate_b9: "",
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
  // keyboard functions
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

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
      await createFood(payload);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 bg-black/50 justify-end">
          {loading && <LoadingOverlay text="Creating food..." />}

          <View
            className="bg-white rounded-t-[32px] max-h-[93%]"
            style={{ paddingBottom: 0 }}
          >
            {/* ── Handle bar ── */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-slate-200" />
            </View>

            {/* ── Header ── */}
            <View className="flex-row justify-between items-center px-5 pt-3 pb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-2xl bg-emerald-500 items-center justify-center">
                  <MaterialCommunityIcons
                    name="food-apple-outline"
                    size={20}
                    color="white"
                  />
                </View>
                <View>
                  <Text
                    className="text-slate-900"
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      letterSpacing: -0.4,
                    }}
                  >
                    Create Food
                  </Text>
                  <Text className="text-xs text-slate-400 font-medium">
                    Fill in nutrition details
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              >
                <Feather name="x" size={16} color="#64748b" />
              </Pressable>
            </View>

            {/* ── Divider ── */}
            <View className="h-px bg-slate-100 mx-5" />

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1 px-5"
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {/* ── JSON Import ── */}
              <SectionHeader
                title="Quick Import"
                iconBg="#f0fdf4"
                icon={
                  <MaterialCommunityIcons
                    name="code-json"
                    size={14}
                    color="#16a34a"
                  />
                }
              />

              <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-2">
                <TextInput
                  multiline
                  scrollEnabled
                  value={pasteText}
                  onChangeText={setPasteText}
                  placeholder="Paste nutrition JSON here..."
                  placeholderTextColor="#94a3b8"
                  className="text-slate-700 text-xs font-mono"
                  style={{
                    height: 130,
                    textAlignVertical: "top",
                    lineHeight: 18,
                  }}
                />
              </View>

              <Pressable
                onPress={handlePasteNutrition}
                className="flex-row items-center justify-center gap-2 bg-emerald-500 py-3.5 rounded-2xl mb-1"
              >
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={16}
                  color="white"
                />
                <Text className="text-white text-sm font-bold">
                  Auto Fill Fields
                </Text>
              </Pressable>

              {/* ── General ── */}
              <SectionHeader
                title="General"
                iconBg="#eff6ff"
                icon={<Feather name="info" size={13} color="#3b82f6" />}
              />
              <Field
                placeholder="Food name"
                value={form.name}
                onChange={set("name")}
                icon={
                  <MaterialCommunityIcons
                    name="food-variant"
                    size={16}
                    color="#64748b"
                  />
                }
              />
              <Field
                placeholder="Serving (e.g. 1 pack 300 ml)"
                value={form.serving}
                onChange={set("serving")}
                icon={
                  <MaterialCommunityIcons
                    name="scale"
                    size={16}
                    color="#64748b"
                  />
                }
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
              <SectionHeader
                title="Macronutrients"
                iconBg="#fff7ed"
                icon={
                  <MaterialCommunityIcons
                    name="chart-donut"
                    size={14}
                    color="#f97316"
                  />
                }
              />
              <Field
                placeholder="Protein (g)"
                value={form.protein}
                onChange={set("protein")}
                numeric
                icon={
                  <MaterialCommunityIcons
                    name="arm-flex-outline"
                    size={16}
                    color="#64748b"
                  />
                }
              />
              <Field
                placeholder="Total Carbs (g)"
                value={form.total_carbs}
                onChange={set("total_carbs")}
                numeric
                icon={
                  <MaterialCommunityIcons
                    name="grain"
                    size={16}
                    color="#64748b"
                  />
                }
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
                icon={
                  <MaterialCommunityIcons
                    name="leaf"
                    size={16}
                    color="#64748b"
                  />
                }
              />

              {/* ── Fats ── */}
              <SectionHeader
                title="Fats"
                iconBg="#fdf4ff"
                icon={
                  <MaterialCommunityIcons
                    name="water-outline"
                    size={14}
                    color="#a855f7"
                  />
                }
              />
              <Field
                placeholder="Total Fat (g)"
                value={form.total_fat}
                onChange={set("total_fat")}
                numeric
                icon={
                  <MaterialCommunityIcons
                    name="water"
                    size={16}
                    color="#64748b"
                  />
                }
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
              <SectionHeader
                title="Vitamins"
                iconBg="#fef9c3"
                icon={
                  <MaterialCommunityIcons
                    name="pill"
                    size={14}
                    color="#ca8a04"
                  />
                }
              />
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
                icon={
                  <Ionicons name="flask-outline" size={16} color="#64748b" />
                }
              />

              {/* ── Minerals ── */}
              <SectionHeader
                title="Minerals"
                iconBg="#fff1f2"
                icon={
                  <MaterialCommunityIcons
                    name="diamond-stone"
                    size={14}
                    color="#f43f5e"
                  />
                }
              />
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
                icon={
                  <MaterialCommunityIcons
                    name="atom"
                    size={16}
                    color="#64748b"
                  />
                }
              />
            </ScrollView>

            {/* ── Save button ── */}
            {!keyboardVisible && (
              <View
                className="px-5 pt-3 pb-8 bg-white"
                style={{ borderTopWidth: 0.5, borderTopColor: "#e2e8f0" }}
              >
                <TouchableOpacity
                  onPress={handleSubmit}
                  className="flex-row items-center justify-center gap-2 bg-slate-900 py-4 rounded-2xl"
                >
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={18}
                    color="white"
                  />
                  <Text className="text-white text-center font-bold text-base">
                    Save Food
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
