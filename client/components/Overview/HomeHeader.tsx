import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { fetchCalendarOverview } from "@/api/overview";

interface CalendarDay {
  date: string;
  categories: string[];
  total_workouts: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface HomeHeaderProps {
  dateStr: string;
  dayName: string;
  animKey?: number; // pass keyCal/keyWorkout from parent to re-animate on reload
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CATEGORY_COLORS: Record<string, string> = {
  push: "#38bdf8",
  pull: "#a78bfa",
  legs: "#34d399",
  cardio: "#fb923c",
  chest: "#f472b6",
  back: "#facc15",
  rest: "#94a3b8",
};

const CATEGORY_ICONS: Record<string, string> = {
  push: "trending-up",
  pull: "trending-down",
  legs: "activity",
  cardio: "wind",
  chest: "heart",
  back: "layers",
  rest: "moon",
};

export default function HomeHeader({
  dateStr,
  dayName,
  animKey,
}: HomeHeaderProps) {
  const today = new Date();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const fetchCalendar = async (y: number, m: number) => {
    setLoading(true);
    setSelectedDay(null);
    try {
      const mm = String(m + 1).padStart(2, "0");
      const res = await fetchCalendarOverview(y, parseInt(mm));
      setCalendarData(res);
    } catch {
      setCalendarData([]);
    } finally {
      setLoading(false);
    }
  };

  const openCalendar = () => {
    setCalendarVisible(true);
    fetchCalendar(year, month);
  };

  const changeMonth = (dir: 1 | -1) => {
    let newMonth = month + dir;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setMonth(newMonth);
    setYear(newYear);
    fetchCalendar(newYear, newMonth);
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dataMap: Record<number, CalendarDay> = {};
  calendarData.forEach((d) => {
    const day = parseInt(d.date.split("-")[2]);
    dataMap[day] = d;
  });

  const todayDay =
    today.getMonth() === month && today.getFullYear() === year
      ? today.getDate()
      : null;

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <>
      {/* ── Header Card ─────────────────────────────────── */}
      <MotiView
        key={animKey}
        from={{ opacity: 0, translateY: -20, scale: 0.97 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        style={{ marginBottom: 15 }}
      >
        <LinearGradient
          colors={["#0f172a", "#1e293b", "#0f172a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-[27px] px-4 py-3 overflow-hidden"
          style={{
            shadowColor: "#0f172a",
            shadowOpacity: 0.45,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 10,
          }}
        >
          <View className="absolute w-36 h-36 rounded-full bg-sky-400 opacity-10 -top-10 -right-5" />

          <View className="flex-row justify-between items-center">
            {/* ── Left: logo + date/day ── */}
            <View className="flex-row items-center gap-3">
              {/* Logo bounces in */}
              <MotiView
                from={{ opacity: 0, scale: 0.5, rotate: "-15deg" }}
                animate={{ opacity: 1, scale: 1, rotate: "0deg" }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 14,
                  delay: 150,
                }}
              >
                <View className="w-11 h-11 rounded-2xl items-center justify-center border border-slate-600 bg-white/5">
                  <Image
                    source={require("@/assets/image/logo.jpg")}
                    className="w-8 h-8 rounded-lg"
                    resizeMode="contain"
                  />
                </View>
              </MotiView>

              <View className="items-start">
                {/* Date label slides from left */}
                <MotiView
                  from={{ opacity: 0, translateX: -10 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", duration: 350, delay: 200 }}
                >
                  <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                    TODAY · {dateStr}
                  </Text>
                </MotiView>

                {/* Day name + dot springs up */}
                <MotiView
                  from={{ opacity: 0, translateY: 8 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 16,
                    delay: 280,
                  }}
                >
                  <View className="flex-row items-center gap-1.5">
                    <Text
                      className="text-2xl font-black text-slate-100"
                      style={{ letterSpacing: -0.5 }}
                    >
                      {dayName}
                    </Text>
                    <View
                      className="w-2 h-2 rounded-full bg-emerald-400 mb-0.5"
                      style={{
                        shadowColor: "#34d399",
                        shadowOpacity: 0.8,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 0 },
                      }}
                    />
                  </View>
                </MotiView>
              </View>
            </View>

            {/* ── Right: calendar button bounces in ── */}
            <MotiView
              from={{ opacity: 0, scale: 0.4, rotate: "20deg" }}
              animate={{ opacity: 1, scale: 1, rotate: "0deg" }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 14,
                delay: 320,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={openCalendar}
                className="w-11 h-11 rounded-2xl items-center justify-center bg-sky-400/10 border border-sky-400/30"
                style={{
                  shadowColor: "#38bdf8",
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                }}
              >
                <Feather name="calendar" size={18} color="#7dd3fc" />
              </TouchableOpacity>
            </MotiView>
          </View>
        </LinearGradient>
      </MotiView>

      {/* ── Calendar Modal ───────────────────────────────── */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/60"
          activeOpacity={1}
          onPress={() => setCalendarVisible(false)}
        />

        <LinearGradient
          colors={["#0f172a", "#1e293b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="pt-4 pb-10 overflow-hidden"
          style={{ maxHeight: "88%" }}
        >
          <View className="absolute w-48 h-48 rounded-full bg-sky-400 opacity-5 -top-20 -right-10" />

          {/* Handle */}
          <View className="w-9 h-1 rounded-full bg-slate-600 self-center mb-4" />

          {/* Month / Year Navigator */}
          <View className="flex-row justify-between items-center px-5 mb-4">
            <TouchableOpacity
              onPress={() => changeMonth(-1)}
              className="w-8 h-8 rounded-xl items-center justify-center bg-slate-700/50 border border-slate-600/30"
            >
              <Feather name="chevron-left" size={16} color="#94a3b8" />
            </TouchableOpacity>
            <View className="items-center">
              <Text
                className="text-lg font-black text-slate-100"
                style={{ letterSpacing: -0.3 }}
              >
                {MONTH_NAMES[month]}
              </Text>
              <Text className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                {year}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => changeMonth(1)}
              className="w-8 h-8 rounded-xl items-center justify-center bg-slate-700/50 border border-slate-600/30"
            >
              <Feather name="chevron-right" size={16} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Day Labels */}
          <View className="flex-row px-3 mb-2">
            {DAY_LABELS.map((d) => (
              <Text
                key={d}
                className="flex-1 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider"
              >
                {d}
              </Text>
            ))}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 12 }}
          >
            {loading ? (
              <View className="h-64 items-center justify-center">
                <ActivityIndicator color="#38bdf8" />
              </View>
            ) : (
              <View className="flex-row flex-wrap">
                {cells.map((day, i) => {
                  if (!day) {
                    return (
                      <View
                        key={`empty-${i}`}
                        style={{ width: "14.28%", padding: 2 }}
                      >
                        <View className="h-[72px] rounded-xl bg-transparent" />
                      </View>
                    );
                  }

                  const data = dataMap[day];
                  const isToday = day === todayDay;
                  const hasWorkout = !!data && data.total_workouts > 0;
                  const hasFood = !!data && data.calories > 0;
                  const primaryCat = data?.categories?.[0];
                  const catColor = primaryCat
                    ? (CATEGORY_COLORS[primaryCat] ?? "#38bdf8")
                    : null;
                  const catIcon = primaryCat
                    ? (CATEGORY_ICONS[primaryCat] ?? "zap")
                    : null;
                  const isSelected = selectedDay?.date === data?.date;

                  return (
                    <View key={day} style={{ width: "14.28%", padding: 2 }}>
                      <TouchableOpacity
                        activeOpacity={data ? 0.7 : 1}
                        onPress={() => data && setSelectedDay(data)}
                        style={{
                          height: 72,
                          borderRadius: 12,
                          borderWidth: 1,
                          backgroundColor: isSelected
                            ? "rgba(56,189,248,0.15)"
                            : isToday
                              ? "rgba(56,189,248,0.08)"
                              : data
                                ? "rgba(30,41,59,0.9)"
                                : "rgba(15,23,42,0.5)",
                          borderColor: isSelected
                            ? "rgba(56,189,248,0.55)"
                            : isToday
                              ? "rgba(56,189,248,0.35)"
                              : data
                                ? "rgba(71,85,105,0.5)"
                                : "rgba(30,41,59,0.4)",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingVertical: 6,
                          paddingHorizontal: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "800",
                            color: isToday
                              ? "#38bdf8"
                              : isSelected
                                ? "#7dd3fc"
                                : data
                                  ? "#e2e8f0"
                                  : "#334155",
                          }}
                        >
                          {day}
                        </Text>

                        <View
                          style={{
                            alignItems: "center",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          {hasWorkout && catIcon && catColor ? (
                            <View
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 7,
                                backgroundColor: `${catColor}25`,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Feather
                                name={catIcon as any}
                                size={11}
                                color={catColor}
                              />
                            </View>
                          ) : (
                            <View style={{ width: 22, height: 22 }} />
                          )}

                          {hasFood ? (
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 8,
                                fontWeight: "700",
                                color: "#34d399",
                                letterSpacing: 0.2,
                              }}
                            >
                              {data.calories >= 1000
                                ? `${(data.calories / 1000).toFixed(1)}k`
                                : Math.round(data.calories)}
                              {" kcal"}
                            </Text>
                          ) : (
                            <View style={{ height: 10 }} />
                          )}
                        </View>

                        {isToday ? (
                          <View
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: "#38bdf8",
                            }}
                          />
                        ) : (
                          <View style={{ height: 4 }} />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Divider */}
            <View className="h-px bg-slate-700/40 my-4 mx-1" />

            {/* Selected Day Detail */}
            {selectedDay ? (
              <View className="gap-3 px-1">
                <View className="flex-row items-center gap-2">
                  <View className="h-px flex-1 bg-slate-700/40" />
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(
                      selectedDay.date + "T00:00:00",
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  <View className="h-px flex-1 bg-slate-700/40" />
                </View>

                {selectedDay.categories.length > 0 && (
                  <View className="flex-row gap-2 flex-wrap">
                    {selectedDay.categories.map((cat) => (
                      <View
                        key={cat}
                        className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[cat] ?? "#38bdf8"}18`,
                          borderColor: `${CATEGORY_COLORS[cat] ?? "#38bdf8"}40`,
                        }}
                      >
                        <Feather
                          name={(CATEGORY_ICONS[cat] ?? "zap") as any}
                          size={10}
                          color={CATEGORY_COLORS[cat] ?? "#38bdf8"}
                        />
                        <Text
                          className="text-xs font-bold capitalize"
                          style={{ color: CATEGORY_COLORS[cat] ?? "#38bdf8" }}
                        >
                          {cat}
                        </Text>
                      </View>
                    ))}
                    <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-700/40 border border-slate-600/30">
                      <Feather name="zap" size={10} color="#94a3b8" />
                      <Text className="text-xs font-bold text-slate-400">
                        {selectedDay.total_workouts}{" "}
                        {selectedDay.total_workouts === 1
                          ? "session"
                          : "sessions"}
                      </Text>
                    </View>
                  </View>
                )}

                {selectedDay.calories > 0 ? (
                  <View className="flex-row gap-2">
                    {[
                      {
                        label: "Calories",
                        value: Math.round(selectedDay.calories).toString(),
                        unit: "kcal",
                        color: "#fb923c",
                        icon: "zap",
                      },
                      {
                        label: "Protein",
                        value: selectedDay.protein.toFixed(1),
                        unit: "g",
                        color: "#a78bfa",
                        icon: "shield",
                      },
                      {
                        label: "Carbs",
                        value: selectedDay.carbs.toFixed(1),
                        unit: "g",
                        color: "#38bdf8",
                        icon: "battery",
                      },
                      {
                        label: "Fats",
                        value: selectedDay.fats.toFixed(1),
                        unit: "g",
                        color: "#34d399",
                        icon: "droplet",
                      },
                    ].map((n) => (
                      <View
                        key={n.label}
                        className="flex-1 rounded-2xl bg-slate-800/60 border border-slate-700/40 py-2.5 px-1 items-center gap-1"
                      >
                        <Feather
                          name={n.icon as any}
                          size={12}
                          color={n.color}
                        />
                        <Text
                          className="text-sm font-black"
                          style={{ color: n.color }}
                        >
                          {n.value}
                        </Text>
                        <Text className="text-[8px] text-slate-500 font-semibold uppercase tracking-wide">
                          {n.unit}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="items-center py-3 gap-1">
                    <Feather name="moon" size={18} color="#334155" />
                    <Text className="text-slate-600 text-xs font-medium">
                      No nutrition logged
                    </Text>
                  </View>
                )}

                {selectedDay.calories === 0 &&
                  selectedDay.total_workouts === 0 && (
                    <Text className="text-slate-600 text-xs font-medium text-center py-1">
                      No data for this day
                    </Text>
                  )}
              </View>
            ) : (
              <View className="items-center py-4 gap-1.5">
                <Feather name="calendar" size={18} color="#1e3a5f" />
                <Text className="text-slate-600 text-xs font-medium">
                  Tap any day to see your log
                </Text>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </Modal>
    </>
  );
}
