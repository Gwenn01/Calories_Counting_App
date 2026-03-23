import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Food } from "../../types/foods";

interface Props {
  visible: boolean;
  selectedFood: Food | null;
  onClose: () => void;
  onUpdate: (id: number, food: Food) => void;
  onDelete: (id: number) => void;
}

const mineralFields: [keyof Food, string][] = [
  ["calcium", "Calcium"],
  ["iron", "Iron"],
  ["magnesium", "Magnesium"],
  ["phosphorus", "Phosphorus"],
  ["potassium", "Potassium"],
  ["sodium", "Sodium"],
  ["zinc", "Zinc"],
  ["copper", "Copper"],
  ["manganese", "Manganese"],
];

const vitaminFields: [keyof Food, string][] = [
  ["vitamin_a", "Vitamin A"],
  ["vitamin_c", "Vitamin C"],
  ["vitamin_e", "Vitamin E"],
  ["vitamin_k", "Vitamin K"],
  ["vitamin_b1", "B1 Thiamin"],
  ["vitamin_b2", "B2 Riboflavin"],
  ["vitamin_b3", "B3 Niacin"],
  ["vitamin_b6", "B6"],
  ["vitamin_b9", "B9 Folate"],
  ["vitamin_b12", "B12"],
];

// ─── Sub-components ───────────────────────────────────────────────

const SectionHeader = ({
  title,
  icon,
  iconBg,
}: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
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

const Label = ({ text }: { text: string }) => (
  <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
    {text}
  </Text>
);

const Field = ({
  label,
  value,
  onChange,
  numeric,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
  icon?: React.ReactNode;
}) => (
  <View className="mb-3">
    <Label text={label} />
    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 gap-2">
      {icon && <View className="opacity-35">{icon}</View>}
      <TextInput
        value={value}
        keyboardType={numeric ? "numeric" : "default"}
        onChangeText={onChange}
        placeholderTextColor="#94a3b8"
        className="flex-1 text-slate-800 text-sm"
        style={{ paddingVertical: 14 }}
      />
    </View>
  </View>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <View className="flex-row gap-2">{children}</View>
);

const HalfField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <View className="flex-1 mb-3">
    <Label text={label} />
    <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5">
      <TextInput
        keyboardType="numeric"
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#94a3b8"
        className="text-slate-800 text-sm"
        style={{ paddingVertical: 14 }}
      />
    </View>
  </View>
);

// ─── Main Modal ───────────────────────────────────────────────────

export default function ManageFoodModal({
  visible,
  selectedFood,
  onClose,
  onUpdate,
  onDelete,
}: Props) {
  const [form, setForm] = useState<Food | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // keyboard effects
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

  useEffect(() => {
    if (selectedFood) setForm(selectedFood);
  }, [selectedFood]);

  if (!form) return null;

  const handleChange = (field: keyof Food, value: string) => {
    setForm((prev) => ({
      ...prev!,
      [field]: isNaN(Number(value)) ? value : Number(value),
    }));
  };

  const handleSave = () => onUpdate(form.id, form);
  const handleDelete = () => onDelete(form.id);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[32px] max-h-[93%]">
            {/* ── Handle bar ── */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-slate-200" />
            </View>

            {/* ── Header ── */}
            <View className="flex-row justify-between items-center px-5 pt-3 pb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-2xl bg-slate-900 items-center justify-center">
                  <MaterialCommunityIcons
                    name="food-variant"
                    size={19}
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
                    Edit Food
                  </Text>
                  <Text
                    className="text-xs text-slate-400 font-medium"
                    numberOfLines={1}
                  >
                    {form.name || "Update nutrition details"}
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
              {/* ── General ── */}
              <SectionHeader
                title="General"
                iconBg="#eff6ff"
                icon={<Feather name="info" size={13} color="#3b82f6" />}
              />
              <Field
                label="Food Name"
                value={form.name}
                onChange={(v) => handleChange("name", v)}
                icon={
                  <MaterialCommunityIcons
                    name="food-variant"
                    size={16}
                    color="#64748b"
                  />
                }
              />
              <Field
                label="Serving"
                value={form.serving}
                onChange={(v) => handleChange("serving", v)}
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
                  label="Calories (kcal)"
                  value={String(form.calories)}
                  onChange={(v) => handleChange("calories", v)}
                />
                <HalfField
                  label="Water (g)"
                  value={String(form.water)}
                  onChange={(v) => handleChange("water", v)}
                />
              </Row>

              {/* ── Protein ── */}
              <SectionHeader
                title="Protein"
                iconBg="#eff6ff"
                icon={
                  <MaterialCommunityIcons
                    name="arm-flex-outline"
                    size={14}
                    color="#3b82f6"
                  />
                }
              />
              <Field
                label="Protein (g)"
                value={String(form.protein)}
                onChange={(v) => handleChange("protein", v)}
                numeric
                icon={
                  <MaterialCommunityIcons
                    name="arm-flex-outline"
                    size={16}
                    color="#64748b"
                  />
                }
              />

              {/* ── Carbohydrates ── */}
              <SectionHeader
                title="Carbohydrates"
                iconBg="#fff7ed"
                icon={
                  <MaterialCommunityIcons
                    name="grain"
                    size={14}
                    color="#f97316"
                  />
                }
              />
              <Field
                label="Total Carbs (g)"
                value={String(form.total_carbs)}
                onChange={(v) => handleChange("total_carbs", v)}
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
                  label="Sugars (g)"
                  value={String(form.sugars)}
                  onChange={(v) => handleChange("sugars", v)}
                />
                <HalfField
                  label="Fiber (g)"
                  value={String(form.fiber)}
                  onChange={(v) => handleChange("fiber", v)}
                />
              </Row>
              <Field
                label="Starch (g)"
                value={String(form.starch)}
                onChange={(v) => handleChange("starch", v)}
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
                title="Fats & Cholesterol"
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
                label="Total Fat (g)"
                value={String(form.total_fat)}
                onChange={(v) => handleChange("total_fat", v)}
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
                  label="Saturated (g)"
                  value={String(form.saturated_fat)}
                  onChange={(v) => handleChange("saturated_fat", v)}
                />
                <HalfField
                  label="Cholesterol (mg)"
                  value={String(form.cholesterol)}
                  onChange={(v) => handleChange("cholesterol", v)}
                />
              </Row>
              <Row>
                <HalfField
                  label="Monounsat. (g)"
                  value={String(form.monounsaturated_fat)}
                  onChange={(v) => handleChange("monounsaturated_fat", v)}
                />
                <HalfField
                  label="Polyunsat. (g)"
                  value={String(form.polyunsaturated_fat)}
                  onChange={(v) => handleChange("polyunsaturated_fat", v)}
                />
              </Row>
              <Field
                label="Trans Fat (g)"
                value={String(form.trans_fat)}
                onChange={(v) => handleChange("trans_fat", v)}
                numeric
                icon={
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={16}
                    color="#64748b"
                  />
                }
              />

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
                {vitaminFields.slice(0, 2).map(([key, label]) => (
                  <HalfField
                    key={key}
                    label={label}
                    value={String(form[key] ?? 0)}
                    onChange={(v) => handleChange(key, v)}
                  />
                ))}
              </Row>
              <Row>
                {vitaminFields.slice(2, 4).map(([key, label]) => (
                  <HalfField
                    key={key}
                    label={label}
                    value={String(form[key] ?? 0)}
                    onChange={(v) => handleChange(key, v)}
                  />
                ))}
              </Row>
              <Row>
                {vitaminFields.slice(4, 6).map(([key, label]) => (
                  <HalfField
                    key={key}
                    label={label}
                    value={String(form[key] ?? 0)}
                    onChange={(v) => handleChange(key, v)}
                  />
                ))}
              </Row>
              <Row>
                {vitaminFields.slice(6, 8).map(([key, label]) => (
                  <HalfField
                    key={key}
                    label={label}
                    value={String(form[key] ?? 0)}
                    onChange={(v) => handleChange(key, v)}
                  />
                ))}
              </Row>
              <Row>
                {vitaminFields.slice(8, 10).map(([key, label]) => (
                  <HalfField
                    key={key}
                    label={label}
                    value={String(form[key] ?? 0)}
                    onChange={(v) => handleChange(key, v)}
                  />
                ))}
              </Row>

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
              {Array.from(
                { length: Math.ceil(mineralFields.length / 2) },
                (_, i) => (
                  <Row key={i}>
                    {mineralFields
                      .slice(i * 2, i * 2 + 2)
                      .map(([key, label]) => (
                        <HalfField
                          key={key}
                          label={`${label} (mg)`}
                          value={String(form[key] ?? 0)}
                          onChange={(v) => handleChange(key, v)}
                        />
                      ))}
                  </Row>
                ),
              )}
            </ScrollView>

            {/* ── Footer ── */}
            {!keyboardVisible && (
              <View
                className="px-5 pt-1 pb-5 bg-white gap-2.5"
                style={{ borderTopWidth: 0.5, borderTopColor: "#e2e8f0" }}
              >
                <View className="flex-row gap-2.5">
                  {/* Save */}
                  <Pressable
                    onPress={handleSave}
                    className="flex-1 flex-row items-center justify-center bg-emerald-500 py-4 rounded-2xl"
                  >
                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={17}
                      color="white"
                    />
                    <Text className="text-white font-bold text-sm">Save</Text>
                  </Pressable>

                  {/* Delete */}
                  <Pressable
                    onPress={handleDelete}
                    className="flex-1 flex-row items-center justify-center bg-red-500 py-4 rounded-2xl"
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={17}
                      color="white"
                    />
                    <Text className="text-white font-bold text-sm">Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
