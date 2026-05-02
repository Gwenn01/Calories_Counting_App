import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useToast } from "@/components/ToastProvider";
import { createFood } from "../../api/food";
import { NutritionForm } from "@/types/foods";
import { foodBar } from "@/api/food";

// ─── Replace with your actual API call ───────────────────────────
// Your backend receives the barcode and returns a nutrition object
//import { getFoodByBarcode } from "../../api/food";

// ─── Types ────────────────────────────────────────────────────────
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

// ─── Main Modal ───────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
}

type Step = "scan" | "loading" | "review";

export function BarcodeScannerModal({ visible, onClose }: Props) {
  const { showToast } = useToast();
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<Step>("scan");
  const [scanned, setScanned] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [form, setForm] = useState<NutritionForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof NutritionForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible]);

  // Reset on close
  const handleClose = () => {
    setStep("scan");
    setScanned(false);
    setBarcodeValue("");
    setForm(emptyForm);
    onClose();
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setBarcodeValue(data);
    setStep("loading");

    try {
      // Call your backend API
      const result = await foodBar(data);

      const updated: NutritionForm = { ...emptyForm };

      Object.keys(updated).forEach((key) => {
        if (result[key] !== undefined) {
          (updated as any)[key] = String(result[key]);
        }
      });
      setForm(updated);
      setStep("review");
    } catch (err) {
      showToast(
        "Not Found",
        "No nutrition data found for this barcode.",
        "error",
      );
      setScanned(false);
      setStep("scan");
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
              <View className="w-10 h-10 rounded-2xl bg-orange-500 items-center justify-center">
                <MaterialCommunityIcons
                  name="barcode-scan"
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
                  Scan Barcode
                </Text>
                <Text className="text-xs text-slate-400 font-medium">
                  {step === "scan" && "Point camera at a product barcode"}
                  {step === "loading" && "Looking up nutrition data..."}
                  {step === "review" && "Review and edit before saving"}
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

          {/* ══════════ SCAN STEP ══════════ */}
          {step === "scan" && (
            <View className="px-5 py-5">
              {/* Permission denied */}
              {!permission?.granted ? (
                <View className="items-center py-10 gap-4">
                  <View className="w-16 h-16 rounded-3xl bg-orange-50 items-center justify-center">
                    <MaterialCommunityIcons
                      name="camera-off"
                      size={30}
                      color="#f97316"
                    />
                  </View>
                  <Text className="text-slate-700 font-bold text-base">
                    Camera Permission Required
                  </Text>
                  <Text className="text-slate-400 text-sm text-center px-4">
                    Allow camera access to scan product barcodes.
                  </Text>
                  <Pressable
                    onPress={requestPermission}
                    className="flex-row items-center gap-2 bg-orange-500 px-6 py-3 rounded-2xl mt-2"
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
                    style={{ height: 300 }}
                  >
                    <CameraView
                      style={StyleSheet.absoluteFillObject}
                      facing="back"
                      onBarcodeScanned={
                        scanned ? undefined : handleBarcodeScanned
                      }
                      barcodeScannerSettings={{
                        barcodeTypes: [
                          "ean13",
                          "ean8",
                          "upc_a",
                          "upc_e",
                          "code128",
                          "code39",
                          "code93",
                          "itf14",
                          "codabar",
                          "datamatrix",
                          "qr",
                        ],
                      }}
                    />

                    {/* Scanner overlay */}
                    <View
                      style={StyleSheet.absoluteFillObject}
                      className="items-center justify-center"
                    >
                      {/* Dark overlay top */}
                      <View
                        className="absolute top-0 left-0 right-0 bg-black/40"
                        style={{ height: 80 }}
                      />
                      {/* Dark overlay bottom */}
                      <View
                        className="absolute bottom-0 left-0 right-0 bg-black/40"
                        style={{ height: 80 }}
                      />
                      {/* Dark overlay left */}
                      <View
                        className="absolute top-20 bottom-20 left-0 bg-black/40"
                        style={{ width: 40 }}
                      />
                      {/* Dark overlay right */}
                      <View
                        className="absolute top-20 bottom-20 right-0 bg-black/40"
                        style={{ width: 40 }}
                      />

                      {/* Scan window */}
                      <View
                        className="border-2 border-white rounded-2xl"
                        style={{ width: 220, height: 120 }}
                      >
                        {/* Corner accents */}
                        <View className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-orange-400 rounded-tl-xl" />
                        <View className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-orange-400 rounded-tr-xl" />
                        <View className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-orange-400 rounded-bl-xl" />
                        <View className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-orange-400 rounded-br-xl" />

                        {/* Scan line */}
                        <View
                          className="absolute left-2 right-2 bg-orange-400 rounded-full"
                          style={{ height: 2, top: "50%" }}
                        />
                      </View>

                      <Text className="text-white text-xs font-medium mt-4 opacity-80">
                        Align barcode within the frame
                      </Text>
                    </View>
                  </View>

                  {/* Tip */}
                  <View className="flex-row items-center gap-2 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 mt-4">
                    <MaterialCommunityIcons
                      name="lightbulb-outline"
                      size={15}
                      color="#f97316"
                    />
                    <Text className="text-xs text-orange-700 font-medium flex-1">
                      Works with EAN-13, UPC-A, Code128, QR and more. Ensure
                      good lighting for best results.
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}

          {/* ══════════ LOADING STEP ══════════ */}
          {step === "loading" && (
            <View className="items-center py-16 px-5 gap-4">
              <View className="w-16 h-16 rounded-3xl bg-orange-50 items-center justify-center">
                <ActivityIndicator size="large" color="#f97316" />
              </View>
              <Text className="text-slate-900 font-bold text-base">
                Looking up barcode
              </Text>
              <View className="flex-row items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5">
                <MaterialCommunityIcons
                  name="barcode"
                  size={16}
                  color="#94a3b8"
                />
                <Text className="text-slate-500 font-mono text-sm">
                  {barcodeValue}
                </Text>
              </View>
              <Text className="text-slate-400 text-sm text-center">
                Fetching nutrition data from the database...
              </Text>
            </View>
          )}

          {/* ══════════ REVIEW STEP ══════════ */}
          {step === "review" && (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {/* Scanned barcode pill */}
                <View className="mt-5 mb-2 gap-3 pt-5">
                  {/* Top Row */}
                  <View className="flex-row items-center justify-between">
                    {/* Barcode pill */}
                    <View className="flex-row items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-3 py-1.5">
                      <MaterialCommunityIcons
                        name="barcode-scan"
                        size={13}
                        color="#f97316"
                      />
                      <Text
                        numberOfLines={1}
                        className="text-xs font-semibold text-orange-600 max-w-[140px]"
                      >
                        {barcodeValue}
                      </Text>
                    </View>

                    {/* Rescan button */}
                    <Pressable
                      onPress={() => {
                        setScanned(false);
                        setStep("scan");
                      }}
                      className="flex-row items-center gap-1 bg-slate-100 rounded-full px-3 py-1.5"
                    >
                      <Feather name="refresh-cw" size={11} color="#64748b" />
                      <Text className="text-xs font-semibold text-slate-500">
                        Rescan
                      </Text>
                    </Pressable>
                  </View>

                  {/* Info banner */}
                  <View className="flex-row items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={15}
                      color="#10b981"
                      style={{ marginTop: 2 }}
                    />
                    <Text className="text-xs text-emerald-700 font-medium flex-1 leading-4">
                      Nutrition data pre-filled. Review and edit any values
                      before saving.
                    </Text>
                  </View>
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
                    <MaterialCommunityIcons
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
                  onPress={() => {
                    setScanned(false);
                    setStep("scan");
                  }}
                  className="items-center py-2"
                >
                  <Text className="text-slate-400 text-sm font-semibold">
                    ← Scan Again
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
