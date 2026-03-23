import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useToast } from "@/components/ToastProvider";
import { createFood } from "../../api/food";
import { NutritionForm, ChatMessage } from "@/types/foods";

const emptyForm: NutritionForm = {
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
};

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

// ─── Main Modal ===========================================================
interface Props {
  visible: boolean;
  onClose: () => void;
}

export function FoodBotModal({ visible, onClose }: Props) {
  const { showToast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [form, setForm] = useState<NutritionForm>(emptyForm);
  const [step, setStep] = useState<"chat" | "review">("chat");
  const [thinking, setThinking] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof NutritionForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleAsk = async () => {
    if (!input.trim() || thinking) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setThinking(true);

    try {
      const response = await fetch(`/api/food-bot/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: userMessage },
          ],
        }),
      });

      const data = await response.json();

      setMessages((prev) => [...prev, { role: "bot", text: data.message }]);

      if (data.nutrition) {
        const updated: NutritionForm = { ...emptyForm };
        Object.keys(data.nutrition).forEach((key) => {
          if (key in updated) {
            (updated as any)[key] = String(data.nutrition[key]);
          }
        });
        setForm(updated);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I couldn't fetch nutrition data. Please try again.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleSave = async () => {
    const payload: Record<string, any> = { ...form };
    numericFields.forEach((k) => {
      if (payload[k] !== "") payload[k] = Number(payload[k]);
    });
    try {
      setSaving(true);
      await createFood(payload);
      showToast("Success!", "Food saved successfully.", "success");
      handleClose();
    } catch (err) {
      showToast("Error", "Could not save food.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setMessages([]);
    setForm(emptyForm);
    setInput("");
    setStep("chat");
    onClose();
  };

  const hasData = form.name !== "" || form.calories !== "";

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className="bg-white rounded-t-[32px] max-h-[93%]"
            style={{ paddingBottom: 0, flex: 1 }}
          >
            {/* ── Handle ── */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-slate-200" />
            </View>

            {/* ── Header ── */}
            <View className="flex-row justify-between items-center px-5 pt-3 pb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-2xl bg-emerald-500 items-center justify-center">
                  <MaterialCommunityIcons
                    name="robot-excited-outline"
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
                    Food Bot
                  </Text>
                  <Text className="text-xs text-slate-400 font-medium">
                    Describe a food to get nutrition data
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                {/* Tab toggle */}
                {hasData && (
                  <View className="flex-row bg-slate-100 rounded-xl p-1 gap-1">
                    <Pressable
                      onPress={() => setStep("chat")}
                      className={`px-3 py-1.5 rounded-lg ${step === "chat" ? "bg-white" : ""}`}
                    >
                      <Text
                        className={`text-xs font-semibold ${step === "chat" ? "text-slate-900" : "text-slate-400"}`}
                      >
                        Chat
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setStep("review")}
                      className={`px-3 py-1.5 rounded-lg ${step === "review" ? "bg-white" : ""}`}
                    >
                      <Text
                        className={`text-xs font-semibold ${step === "review" ? "text-slate-900" : "text-slate-400"}`}
                      >
                        Review
                      </Text>
                    </Pressable>
                  </View>
                )}
                <Pressable
                  onPress={handleClose}
                  className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
                >
                  <Feather name="x" size={16} color="#64748b" />
                </Pressable>
              </View>
            </View>

            <View className="h-px bg-slate-100 mx-5" />

            {/* ══════════ CHAT STEP ══════════ */}
            {step === "chat" && (
              <>
                <ScrollView
                  className="flex-1 px-5"
                  contentContainerStyle={{ paddingVertical: 16 }}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Empty state */}
                  {messages.length === 0 && (
                    <View className="items-center mt-8 mb-4">
                      <View className="w-16 h-16 rounded-3xl bg-emerald-50 items-center justify-center mb-3">
                        <MaterialCommunityIcons
                          name="robot-happy-outline"
                          size={32}
                          color="#10b981"
                        />
                      </View>
                      <Text className="text-slate-900 font-bold text-base mb-1">
                        Ask me about any food!
                      </Text>
                      <Text className="text-slate-400 text-sm text-center px-8">
                        Describe a food or meal and I'll fill in the nutrition
                        details for you.
                      </Text>

                      {/* Suggestions */}
                      <View className="flex-row flex-wrap justify-center gap-2 mt-4">
                        {[
                          "1 cup of oats",
                          "Chicken breast 100g",
                          "Banana medium",
                          "2 eggs scrambled",
                        ].map((s) => (
                          <Pressable
                            key={s}
                            onPress={() => setInput(s)}
                            className="bg-slate-100 rounded-full px-3 py-2"
                          >
                            <Text className="text-slate-600 text-xs font-medium">
                              {s}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Chat bubbles */}
                  {messages.map((msg, i) => (
                    <View
                      key={i}
                      className={`mb-3 ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      {msg.role === "bot" && (
                        <View className="flex-row items-center gap-1.5 mb-1">
                          <View className="w-5 h-5 rounded-lg bg-emerald-500 items-center justify-center">
                            <MaterialCommunityIcons
                              name="robot-outline"
                              size={12}
                              color="white"
                            />
                          </View>
                          <Text className="text-xs font-semibold text-slate-400">
                            Food Bot
                          </Text>
                        </View>
                      )}
                      <View
                        className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                          msg.role === "user"
                            ? "bg-slate-900 rounded-tr-sm"
                            : "bg-slate-100 rounded-tl-sm"
                        }`}
                      >
                        <Text
                          className={`text-sm leading-5 ${msg.role === "user" ? "text-white" : "text-slate-700"}`}
                        >
                          {msg.text}
                        </Text>
                      </View>

                      {/* Review nudge after bot message */}
                      {msg.role === "bot" &&
                        hasData &&
                        i === messages.length - 1 && (
                          <Pressable
                            onPress={() => setStep("review")}
                            className="flex-row items-center gap-1.5 mt-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5"
                          >
                            <MaterialCommunityIcons
                              name="check-circle-outline"
                              size={13}
                              color="#10b981"
                            />
                            <Text className="text-xs font-semibold text-emerald-600">
                              Review & edit nutrition →
                            </Text>
                          </Pressable>
                        )}
                    </View>
                  ))}

                  {/* Thinking indicator */}
                  {thinking && (
                    <View className="items-start mb-3">
                      <View className="flex-row items-center gap-1.5 mb-1">
                        <View className="w-5 h-5 rounded-lg bg-emerald-500 items-center justify-center">
                          <MaterialCommunityIcons
                            name="robot-outline"
                            size={12}
                            color="white"
                          />
                        </View>
                        <Text className="text-xs font-semibold text-slate-400">
                          Food Bot
                        </Text>
                      </View>
                      <View className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex-row items-center gap-2">
                        <ActivityIndicator size="small" color="#10b981" />
                        <Text className="text-sm text-slate-400">
                          Analyzing nutrition...
                        </Text>
                      </View>
                    </View>
                  )}
                </ScrollView>

                {/* ── Input bar ── */}
                <View
                  className="flex-row items-end gap-2 px-5 pt-3 pb-8 bg-white"
                  style={{ borderTopWidth: 0.5, borderTopColor: "#e2e8f0" }}
                >
                  <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                    <TextInput
                      value={input}
                      onChangeText={setInput}
                      placeholder="e.g. 100g of grilled chicken..."
                      placeholderTextColor="#94a3b8"
                      multiline
                      className="text-sm text-slate-800"
                      style={{ maxHeight: 80 }}
                    />
                  </View>
                  <Pressable
                    onPress={handleAsk}
                    disabled={!input.trim() || thinking}
                    className={`w-11 h-11 rounded-2xl items-center justify-center ${
                      input.trim() && !thinking
                        ? "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  >
                    <Feather
                      name="send"
                      size={16}
                      color={input.trim() && !thinking ? "white" : "#94a3b8"}
                    />
                  </Pressable>
                </View>
              </>
            )}

            {/* ══════════ REVIEW STEP ══════════ */}
            {step === "review" && (
              <>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="flex-1 px-5"
                  contentContainerStyle={{ paddingBottom: 24 }}
                >
                  {/* Info banner */}
                  <View className="flex-row items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 mt-4">
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={16}
                      color="#10b981"
                    />
                    <Text className="text-xs text-emerald-700 font-medium flex-1">
                      Review and edit the nutrition data before saving.
                    </Text>
                  </View>

                  {/* ── General ── */}
                  <SectionHeader
                    title="General"
                    iconBg="#eff6ff"
                    icon={<Feather name="info" size={13} color="#3b82f6" />}
                  />
                  <Field
                    label="Food Name"
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
                    label="Serving"
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
                      label="Calories (kcal)"
                      value={form.calories}
                      onChange={set("calories")}
                    />
                    <HalfField
                      label="Water (ml)"
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
                    label="Protein (g)"
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
                    label="Total Carbs (g)"
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
                      label="Starch (g)"
                      value={form.starch}
                      onChange={set("starch")}
                    />
                    <HalfField
                      label="Sugars (g)"
                      value={form.sugars}
                      onChange={set("sugars")}
                    />
                  </Row>
                  <Field
                    label="Fiber (g)"
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
                    label="Total Fat (g)"
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
                      label="Saturated (g)"
                      value={form.saturated_fat}
                      onChange={set("saturated_fat")}
                    />
                    <HalfField
                      label="Cholesterol (mg)"
                      value={form.cholesterol}
                      onChange={set("cholesterol")}
                    />
                  </Row>
                  <Row>
                    <HalfField
                      label="Monounsat. (g)"
                      value={form.monounsaturated_fat}
                      onChange={set("monounsaturated_fat")}
                    />
                    <HalfField
                      label="Polyunsat. (g)"
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
                      label="Vitamin A (µg)"
                      value={form.vitamin_a}
                      onChange={set("vitamin_a")}
                    />
                    <HalfField
                      label="Vitamin C (mg)"
                      value={form.vitamin_c}
                      onChange={set("vitamin_c")}
                    />
                  </Row>
                  <Row>
                    <HalfField
                      label="Vitamin E (mg)"
                      value={form.vitamin_e}
                      onChange={set("vitamin_e")}
                    />
                    <HalfField
                      label="Vitamin K (µg)"
                      value={form.vitamin_k}
                      onChange={set("vitamin_k")}
                    />
                  </Row>
                  <Row>
                    <HalfField
                      label="B1 Thiamin (mg)"
                      value={form.thiamin_b1}
                      onChange={set("thiamin_b1")}
                    />
                    <HalfField
                      label="B2 Riboflavin (mg)"
                      value={form.riboflavin_b2}
                      onChange={set("riboflavin_b2")}
                    />
                  </Row>
                  <Row>
                    <HalfField
                      label="B3 Niacin (mg)"
                      value={form.niacin_b3}
                      onChange={set("niacin_b3")}
                    />
                    <HalfField
                      label="B6 (mg)"
                      value={form.vitamin_b6}
                      onChange={set("vitamin_b6")}
                    />
                  </Row>
                  <Field
                    label="B9 Folate (µg)"
                    value={form.folate_b9}
                    onChange={set("folate_b9")}
                    numeric
                    icon={
                      <Ionicons
                        name="flask-outline"
                        size={16}
                        color="#64748b"
                      />
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
                      label="Calcium (mg)"
                      value={form.calcium}
                      onChange={set("calcium")}
                    />
                    <HalfField
                      label="Iron (mg)"
                      value={form.iron}
                      onChange={set("iron")}
                    />
                  </Row>
                  <Row>
                    <HalfField
                      label="Magnesium (mg)"
                      value={form.magnesium}
                      onChange={set("magnesium")}
                    />
                    <HalfField
                      label="Phosphorus (mg)"
                      value={form.phosphorus}
                      onChange={set("phosphorus")}
                    />
                  </Row>
                  <Row>
                    <HalfField
                      label="Potassium (mg)"
                      value={form.potassium}
                      onChange={set("potassium")}
                    />
                    <HalfField
                      label="Sodium (mg)"
                      value={form.sodium}
                      onChange={set("sodium")}
                    />
                  </Row>
                  <Row>
                    <HalfField
                      label="Zinc (mg)"
                      value={form.zinc}
                      onChange={set("zinc")}
                    />
                    <HalfField
                      label="Copper (mg)"
                      value={form.copper}
                      onChange={set("copper")}
                    />
                  </Row>
                  <Field
                    label="Manganese (mg)"
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

                {/* ── Footer ── */}
                <View
                  className="px-5 pt-3 pb-8 bg-white gap-2.5"
                  style={{ borderTopWidth: 0.5, borderTopColor: "#e2e8f0" }}
                >
                  <Pressable
                    onPress={handleSave}
                    disabled={saving}
                    className="flex-row items-center justify-center gap-2 bg-emerald-500 py-4 rounded-2xl"
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <MaterialCommunityIcons
                        name="check-circle-outline"
                        size={18}
                        color="white"
                      />
                    )}
                    <Text className="text-white font-bold text-sm">
                      {saving ? "Saving..." : "Save Food"}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setStep("chat")}
                    className="items-center py-2"
                  >
                    <Text className="text-slate-400 text-sm font-semibold">
                      ← Back to chat
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
