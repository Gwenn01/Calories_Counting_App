import { useEffect, useState, useRef } from "react";
import { View, Text, Animated } from "react-native";

interface Props {
  startTime: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

function AnimatedDigit({ value }: { value: string }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    prevValue.current = value;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -8,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [value]);

  return (
    <Animated.Text
      style={{
        transform: [{ translateY }],
        opacity,
        fontSize: 38,
        fontWeight: "800",
        color: "#0f172a",
        letterSpacing: -2,
        minWidth: 24,
        textAlign: "center",
      }}
    >
      {value}
    </Animated.Text>
  );
}

function BlinkingColon() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.15,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.Text
      style={{
        opacity,
        fontSize: 28,
        fontWeight: "700",
        color: "#cbd5e1",
        marginHorizontal: 1,
        paddingBottom: 3,
      }}
    >
      :
    </Animated.Text>
  );
}

function PulsingDot() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <View
      className="w-9 h-9 rounded-full items-center justify-center"
      style={{
        backgroundColor: "rgba(249,115,22,0.10)",
        borderWidth: 1.5,
        borderColor: "rgba(249,115,22,0.25)",
      }}
    >
      <Animated.View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: "#f97316",
          transform: [{ scale }],
          opacity,
        }}
      />
    </View>
  );
}

export default function SessionTimer({ startTime }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const hp = pad(h);
  const mp = pad(m);
  const sp = pad(s);

  const elapsedLabel =
    h > 0 ? `${h}h ${m}m elapsed` : `${Math.floor(elapsed / 60)}m elapsed`;

  return (
    <View className="mx-4 mb-3 bg-white border border-slate-100 rounded-[20px] px-5 py-4 flex-row items-center justify-between">
      {/* Left — pulse + label */}
      <View className="flex-row items-center gap-3">
        <PulsingDot />
        <View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 2,
            }}
          >
            Session duration
          </Text>
          <Text style={{ fontSize: 11, color: "#94a3b8" }}>{elapsedLabel}</Text>
        </View>
      </View>

      {/* Right — animated digits */}
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 2 }}>
        {h > 0 && (
          <>
            <View style={{ flexDirection: "row" }}>
              <AnimatedDigit value={hp[0]} />
              <AnimatedDigit value={hp[1]} />
            </View>
            <BlinkingColon />
          </>
        )}
        <View style={{ flexDirection: "row" }}>
          <AnimatedDigit value={mp[0]} />
          <AnimatedDigit value={mp[1]} />
        </View>
        <BlinkingColon />
        <View style={{ flexDirection: "row" }}>
          <AnimatedDigit value={sp[0]} />
          <AnimatedDigit value={sp[1]} />
        </View>
      </View>
    </View>
  );
}
