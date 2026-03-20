import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { useState, useRef } from "react";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useToast } from "@/components/ToastProvider";
import { createFood } from "../../api/food";
import { NutritionData, DetectedFood } from "@/types/foods";

// ─── Replace with your actual API call ───────────────────────────
//import { analyzeFoodPhoto } from "../../api/food";

// ─── Types ────────────────────────────────────────────────────────
type NutritionForm = Record<string, string>;

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

const toForm = (n: NutritionData): NutritionForm =>
  Object.fromEntries(Object.entries(n).map(([k, v]) => [k, String(v ?? "")]));

type Step = "camera" | "loading" | "select" | "review";

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

const NutritionReview = ({
  form,
  setForm,
}: {
  form: NutritionForm;
  setForm: (f: NutritionForm) => void;
}) => {
  const set = (key: string) => (value: string) =>
    setForm({ ...form, [key]: value });

  return (
    <>
      <SectionHeader
        title="General"
        iconBg="#eff6ff"
        icon={<Feather name="info" size={13} color="#3b82f6" />}
      />
      <Field
        label="Food Name"
        value={form.name ?? ""}
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
        value={form.serving ?? ""}
        onChange={set("serving")}
        icon={<MaterialCommunityIcons name="scale" size={16} color="#64748b" />}
      />
      <Row>
        <HalfField
          label="Calories (kcal)"
          value={form.calories ?? ""}
          onChange={set("calories")}
        />
        <HalfField
          label="Water (ml)"
          value={form.water ?? ""}
          onChange={set("water")}
        />
      </Row>

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
        value={form.protein ?? ""}
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
        value={form.total_carbs ?? ""}
        onChange={set("total_carbs")}
        numeric
        icon={<MaterialCommunityIcons name="grain" size={16} color="#64748b" />}
      />
      <Row>
        <HalfField
          label="Starch (g)"
          value={form.starch ?? ""}
          onChange={set("starch")}
        />
        <HalfField
          label="Sugars (g)"
          value={form.sugars ?? ""}
          onChange={set("sugars")}
        />
      </Row>
      <Field
        label="Fiber (g)"
        value={form.fiber ?? ""}
        onChange={set("fiber")}
        numeric
        icon={<MaterialCommunityIcons name="leaf" size={16} color="#64748b" />}
      />

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
        value={form.total_fat ?? ""}
        onChange={set("total_fat")}
        numeric
        icon={<MaterialCommunityIcons name="water" size={16} color="#64748b" />}
      />
      <Row>
        <HalfField
          label="Saturated (g)"
          value={form.saturated_fat ?? ""}
          onChange={set("saturated_fat")}
        />
        <HalfField
          label="Cholesterol (mg)"
          value={form.cholesterol ?? ""}
          onChange={set("cholesterol")}
        />
      </Row>
      <Row>
        <HalfField
          label="Monounsat. (g)"
          value={form.monounsaturated_fat ?? ""}
          onChange={set("monounsaturated_fat")}
        />
        <HalfField
          label="Polyunsat. (g)"
          value={form.polyunsaturated_fat ?? ""}
          onChange={set("polyunsaturated_fat")}
        />
      </Row>

      <SectionHeader
        title="Vitamins"
        iconBg="#fef9c3"
        icon={<MaterialCommunityIcons name="pill" size={14} color="#ca8a04" />}
      />
      <Row>
        <HalfField
          label="Vitamin A (µg)"
          value={form.vitamin_a ?? ""}
          onChange={set("vitamin_a")}
        />
        <HalfField
          label="Vitamin C (mg)"
          value={form.vitamin_c ?? ""}
          onChange={set("vitamin_c")}
        />
      </Row>
      <Row>
        <HalfField
          label="Vitamin E (mg)"
          value={form.vitamin_e ?? ""}
          onChange={set("vitamin_e")}
        />
        <HalfField
          label="Vitamin K (µg)"
          value={form.vitamin_k ?? ""}
          onChange={set("vitamin_k")}
        />
      </Row>
      <Row>
        <HalfField
          label="B1 Thiamin (mg)"
          value={form.thiamin_b1 ?? ""}
          onChange={set("thiamin_b1")}
        />
        <HalfField
          label="B2 Riboflavin (mg)"
          value={form.riboflavin_b2 ?? ""}
          onChange={set("riboflavin_b2")}
        />
      </Row>
      <Row>
        <HalfField
          label="B3 Niacin (mg)"
          value={form.niacin_b3 ?? ""}
          onChange={set("niacin_b3")}
        />
        <HalfField
          label="B6 (mg)"
          value={form.vitamin_b6 ?? ""}
          onChange={set("vitamin_b6")}
        />
      </Row>
      <Field
        label="B9 Folate (µg)"
        value={form.folate_b9 ?? ""}
        onChange={set("folate_b9")}
        numeric
        icon={
          <MaterialCommunityIcons
            name="flask-outline"
            size={16}
            color="#64748b"
          />
        }
      />

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
          value={form.calcium ?? ""}
          onChange={set("calcium")}
        />
        <HalfField
          label="Iron (mg)"
          value={form.iron ?? ""}
          onChange={set("iron")}
        />
      </Row>
      <Row>
        <HalfField
          label="Magnesium (mg)"
          value={form.magnesium ?? ""}
          onChange={set("magnesium")}
        />
        <HalfField
          label="Phosphorus (mg)"
          value={form.phosphorus ?? ""}
          onChange={set("phosphorus")}
        />
      </Row>
      <Row>
        <HalfField
          label="Potassium (mg)"
          value={form.potassium ?? ""}
          onChange={set("potassium")}
        />
        <HalfField
          label="Sodium (mg)"
          value={form.sodium ?? ""}
          onChange={set("sodium")}
        />
      </Row>
      <Row>
        <HalfField
          label="Zinc (mg)"
          value={form.zinc ?? ""}
          onChange={set("zinc")}
        />
        <HalfField
          label="Copper (mg)"
          value={form.copper ?? ""}
          onChange={set("copper")}
        />
      </Row>
      <Field
        label="Manganese (mg)"
        value={form.manganese ?? ""}
        onChange={set("manganese")}
        numeric
        icon={<MaterialCommunityIcons name="atom" size={16} color="#64748b" />}
      />
    </>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
}

const FOOD_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f97316",
  "#a855f7",
  "#f43f5e",
  "#ca8a04",
];

export function FoodPhotoModal({ visible, onClose }: Props) {
  const { showToast } = useToast();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [step, setStep] = useState<Step>("camera");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Per-food editable forms for review step
  const [forms, setForms] = useState<Record<string, NutritionForm>>({});
  const [activeTab, setActiveTab] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setStep("camera");
    setPhotoUri(null);
    setDetectedFoods([]);
    setSelectedIds(new Set());
    setForms({});
    setActiveTab("");
    onClose();
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });
      if (!photo) return;
      setPhotoUri(photo.uri);
      setStep("loading");

      // 🔌 Send base64 or uri to your backend
      // Expected response: DetectedFood[]
      //   const result: DetectedFood[] = await analyzeFoodPhoto(photo.base64 ?? photo.uri);

      //   setDetectedFoods(result);

      //   // Pre-build forms & select all by default
      //   const initialForms: Record<string, NutritionForm> = {};
      //   const initialSelected = new Set<string>();
      //   result.forEach((f) => {
      //     initialForms[f.id] = toForm(f.nutrition);
      //     initialSelected.add(f.id);
      //   });
      //   setForms(initialForms);
      //   setSelectedIds(initialSelected);
      //   setActiveTab(result[0]?.id ?? "");
      setStep("select");
    } catch (err) {
      showToast("Error", "Failed to analyze photo. Please try again.", "error");
      setStep("camera");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === detectedFoods.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(detectedFoods.map((f) => f.id)));
    }
  };

  const goToReview = () => {
    if (selectedIds.size === 0) {
      showToast(
        "Select a food",
        "Please select at least one food to continue.",
        "error",
      );
      return;
    }
    const firstSelected = detectedFoods.find((f) => selectedIds.has(f.id));
    setActiveTab(firstSelected?.id ?? "");
    setStep("review");
  };

  const handleSaveAll = async () => {
    const selected = detectedFoods.filter((f) => selectedIds.has(f.id));
    setSaving(true);
    try {
      await Promise.all(
        selected.map((f) => {
          const payload: Record<string, any> = { ...forms[f.id] };
          numericFields.forEach((k) => {
            if (payload[k] !== "") payload[k] = Number(payload[k]);
          });
          return createFood(payload);
        }),
      );
      showToast(
        "Success!",
        `${selected.length} food${selected.length > 1 ? "s" : ""} saved.`,
        "success",
      );
      handleClose();
    } catch (err) {
      showToast("Error", "Could not save foods.", "error");
    } finally {
      setSaving(false);
    }
  };

  const selectedFoods = detectedFoods.filter((f) => selectedIds.has(f.id));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-[32px] max-h-[93%]">
          {/* ── Handle ── */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-full bg-slate-200" />
          </View>

          {/* ── Header ── */}
          <View className="flex-row justify-between items-center px-5 pt-3 pb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-2xl bg-purple-500 items-center justify-center">
                <MaterialCommunityIcons
                  name="food-fork-drink"
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
                  Scan Food
                </Text>
                <Text className="text-xs text-slate-400 font-medium">
                  {step === "camera" && "Take a photo of your meal"}
                  {step === "loading" && "Analyzing your plate..."}
                  {step === "select" &&
                    `${detectedFoods.length} foods detected`}
                  {step === "review" && "Review nutrition before saving"}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={handleClose}
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
            >
              <Feather name="x" size={16} color="#64748b" />
            </Pressable>
          </View>

          <View className="h-px bg-slate-100 mx-5" />

          {/* ══════════ CAMERA STEP ══════════ */}
          {step === "camera" && (
            <View className="px-5 py-5">
              {!permission?.granted ? (
                <View className="items-center py-10 gap-4">
                  <View className="w-16 h-16 rounded-3xl bg-purple-50 items-center justify-center">
                    <MaterialCommunityIcons
                      name="camera-off"
                      size={30}
                      color="#a855f7"
                    />
                  </View>
                  <Text className="text-slate-700 font-bold text-base">
                    Camera Permission Required
                  </Text>
                  <Text className="text-slate-400 text-sm text-center px-4">
                    Allow camera access to photograph your meal.
                  </Text>
                  <Pressable
                    onPress={requestPermission}
                    className="flex-row items-center gap-2 bg-purple-500 px-6 py-3 rounded-2xl"
                  >
                    <Feather name="camera" size={15} color="white" />
                    <Text className="text-white font-bold text-sm">
                      Grant Permission
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  {/* Camera viewfinder */}
                  <View
                    className="rounded-3xl overflow-hidden"
                    style={{ height: 320 }}
                  >
                    <CameraView
                      ref={cameraRef}
                      style={StyleSheet.absoluteFillObject}
                      facing="back"
                    />
                    {/* Corner guides */}
                    <View
                      style={StyleSheet.absoluteFillObject}
                      className="items-center justify-center"
                    >
                      <View
                        style={{
                          width: 260,
                          height: 260,
                          position: "relative",
                        }}
                      >
                        <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-400 rounded-tl-xl" />
                        <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-400 rounded-tr-xl" />
                        <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-400 rounded-bl-xl" />
                        <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-400 rounded-br-xl" />
                      </View>
                    </View>
                    {/* Bottom overlay label */}
                    <View className="absolute bottom-0 left-0 right-0 bg-black/40 py-3 items-center">
                      <Text className="text-white text-xs font-medium opacity-90">
                        Fit your entire plate within the frame
                      </Text>
                    </View>
                  </View>

                  {/* Tip */}
                  <View className="flex-row items-center gap-2 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 mt-4 mb-5">
                    <MaterialCommunityIcons
                      name="lightbulb-outline"
                      size={15}
                      color="#a855f7"
                    />
                    <Text className="text-xs text-purple-700 font-medium flex-1">
                      For best results, photograph your meal from above in good
                      lighting.
                    </Text>
                  </View>

                  {/* Shutter button */}
                  <Pressable
                    onPress={handleTakePhoto}
                    className="flex-row items-center justify-center gap-2 bg-purple-500 py-4 rounded-2xl"
                  >
                    <Feather name="camera" size={18} color="white" />
                    <Text className="text-white font-bold text-base">
                      Take Photo
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          )}

          {/* ══════════ LOADING STEP ══════════ */}
          {step === "loading" && (
            <View className="items-center py-12 px-5 gap-5">
              {photoUri && (
                <View
                  className="rounded-2xl overflow-hidden"
                  style={{ width: 140, height: 140 }}
                >
                  <Image
                    source={{ uri: photoUri }}
                    style={{ width: 140, height: 140 }}
                  />
                  <View
                    style={StyleSheet.absoluteFillObject}
                    className="bg-black/30 items-center justify-center"
                  >
                    <ActivityIndicator size="large" color="white" />
                  </View>
                </View>
              )}
              <View className="items-center gap-1">
                <Text className="text-slate-900 font-bold text-base">
                  Analyzing your plate
                </Text>
                <Text className="text-slate-400 text-sm text-center">
                  Identifying foods and calculating nutrition...
                </Text>
              </View>
              <View className="flex-row gap-2 flex-wrap justify-center">
                {[
                  "Detecting foods",
                  "Estimating portions",
                  "Calculating nutrition",
                ].map((label, i) => (
                  <View
                    key={i}
                    className="flex-row items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5"
                  >
                    <ActivityIndicator size="small" color="#a855f7" />
                    <Text className="text-xs text-slate-500 font-medium">
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ══════════ SELECT STEP ══════════ */}
          {step === "select" && (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {/* Photo thumbnail + retake */}
                <View className="flex-row items-center gap-3 mt-4 mb-4">
                  {photoUri && (
                    <View
                      className="rounded-2xl overflow-hidden"
                      style={{ width: 64, height: 64 }}
                    >
                      <Image
                        source={{ uri: photoUri }}
                        style={{ width: 64, height: 64 }}
                      />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-slate-900 font-bold text-sm mb-0.5">
                      {detectedFoods.length} food
                      {detectedFoods.length !== 1 ? "s" : ""} detected
                    </Text>
                    <Text className="text-slate-400 text-xs">
                      Select which foods to add to your database.
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      setPhotoUri(null);
                      setStep("camera");
                    }}
                    className="flex-row items-center gap-1 bg-slate-100 rounded-full px-3 py-1.5"
                  >
                    <Feather name="refresh-cw" size={11} color="#64748b" />
                    <Text className="text-xs font-semibold text-slate-500">
                      Retake
                    </Text>
                  </Pressable>
                </View>

                {/* Select all toggle */}
                <Pressable
                  onPress={toggleSelectAll}
                  className="flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-3"
                >
                  <Text className="text-sm font-bold text-slate-700">
                    {selectedIds.size === detectedFoods.length
                      ? "Deselect All"
                      : "Select All"}
                  </Text>
                  <View
                    className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${
                      selectedIds.size === detectedFoods.length
                        ? "bg-purple-500 border-purple-500"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {selectedIds.size === detectedFoods.length && (
                      <Feather name="check" size={13} color="white" />
                    )}
                  </View>
                </Pressable>

                {/* Food cards */}
                {detectedFoods.map((food, index) => {
                  const isSelected = selectedIds.has(food.id);
                  const color = FOOD_COLORS[index % FOOD_COLORS.length];

                  return (
                    <Pressable
                      key={food.id}
                      onPress={() => toggleSelect(food.id)}
                      className={`flex-row items-center gap-3 rounded-2xl px-4 py-3.5 mb-2.5 border ${
                        isSelected
                          ? "bg-white border-purple-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {/* Color dot + food icon */}
                      <View
                        className="w-11 h-11 rounded-2xl items-center justify-center"
                        style={{ backgroundColor: color + "18" }}
                      >
                        <MaterialCommunityIcons
                          name="food"
                          size={20}
                          color={color}
                        />
                      </View>

                      <View className="flex-1">
                        <Text className="text-slate-900 font-bold text-sm">
                          {food.label}
                        </Text>
                        <View className="flex-row items-center gap-1.5 mt-0.5">
                          <MaterialCommunityIcons
                            name="weight"
                            size={11}
                            color="#94a3b8"
                          />
                          <Text className="text-xs text-slate-400 font-medium">
                            {food.weight}
                          </Text>
                          <View className="w-1 h-1 rounded-full bg-slate-300" />
                          <Text className="text-xs text-slate-400">
                            {food.nutrition.calories} kcal
                          </Text>
                        </View>
                        {/* Macro pills */}
                        <View className="flex-row gap-1.5 mt-1.5">
                          <View className="bg-blue-50 rounded-full px-2 py-0.5">
                            <Text className="text-[10px] font-semibold text-blue-600">
                              P {food.nutrition.protein}g
                            </Text>
                          </View>
                          <View className="bg-amber-50 rounded-full px-2 py-0.5">
                            <Text className="text-[10px] font-semibold text-amber-600">
                              C {food.nutrition.total_carbs}g
                            </Text>
                          </View>
                          <View className="bg-pink-50 rounded-full px-2 py-0.5">
                            <Text className="text-[10px] font-semibold text-pink-600">
                              F {food.nutrition.total_fat}g
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Checkbox */}
                      <View
                        className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${
                          isSelected
                            ? "bg-purple-500 border-purple-500"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <Feather name="check" size={13} color="white" />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Footer */}
              <View
                className="px-5 pt-3 pb-8 bg-white"
                style={{ borderTopWidth: 0.5, borderTopColor: "#e2e8f0" }}
              >
                <Pressable
                  onPress={goToReview}
                  disabled={selectedIds.size === 0}
                  className={`flex-row items-center justify-center gap-2 py-4 rounded-2xl ${
                    selectedIds.size > 0 ? "bg-purple-500" : "bg-slate-200"
                  }`}
                >
                  <Text
                    className={`font-bold text-sm ${selectedIds.size > 0 ? "text-white" : "text-slate-400"}`}
                  >
                    Review {selectedIds.size > 0 ? `${selectedIds.size} ` : ""}
                    Selected Food{selectedIds.size !== 1 ? "s" : ""}
                  </Text>
                  {selectedIds.size > 0 && (
                    <Feather name="arrow-right" size={15} color="white" />
                  )}
                </Pressable>
              </View>
            </>
          )}

          {/* ══════════ REVIEW STEP ══════════ */}
          {step === "review" && (
            <>
              {/* Food tabs */}
              {selectedFoods.length > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="border-b border-slate-100"
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    gap: 8,
                  }}
                >
                  {selectedFoods.map((food, index) => {
                    const isActive = activeTab === food.id;
                    const color =
                      FOOD_COLORS[
                        detectedFoods.findIndex((f) => f.id === food.id) %
                          FOOD_COLORS.length
                      ];
                    return (
                      <Pressable
                        key={food.id}
                        onPress={() => setActiveTab(food.id)}
                        className={`flex-row items-center gap-2 px-3.5 py-2 rounded-xl border ${
                          isActive
                            ? "border-purple-200 bg-purple-50"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <View
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <Text
                          className={`text-xs font-semibold ${isActive ? "text-purple-700" : "text-slate-500"}`}
                        >
                          {food.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}

              <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {/* Info banner */}
                <View className="flex-row items-center gap-2 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 mt-4 mb-1">
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={15}
                    color="#a855f7"
                  />
                  <Text className="text-xs text-purple-700 font-medium flex-1">
                    {selectedFoods.length > 1
                      ? `Reviewing ${selectedFoods.length} foods. Switch tabs to edit each one.`
                      : "Review and edit nutrition values before saving."}
                  </Text>
                </View>

                {/* Active food form */}
                {activeTab && forms[activeTab] && (
                  <NutritionReview
                    form={forms[activeTab]}
                    setForm={(updated) =>
                      setForms((prev) => ({ ...prev, [activeTab]: updated }))
                    }
                  />
                )}
              </ScrollView>

              {/* Footer */}
              <View
                className="px-5 pt-3 pb-8 bg-white gap-2.5"
                style={{ borderTopWidth: 0.5, borderTopColor: "#e2e8f0" }}
              >
                <Pressable
                  onPress={handleSaveAll}
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
                    {saving
                      ? "Saving..."
                      : `Save ${selectedFoods.length} Food${selectedFoods.length !== 1 ? "s" : ""}`}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setStep("select")}
                  className="items-center py-2"
                >
                  <Text className="text-slate-400 text-sm font-semibold">
                    ← Back to selection
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
