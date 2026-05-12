import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
  startTime: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function SessionTimer({ startTime }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const tick = () => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;

  return (
    <View className="mx-4 mb-4 bg-white border border-slate-100 rounded-[20px] px-6 py-5 items-center">
      <View className="flex-row items-center gap-2 mb-2">
        <Feather name="clock" size={11} color="#94a3b8" />
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">
          Session Duration
        </Text>
      </View>
      <Text
        className="text-4xl font-black text-slate-900"
        style={{ letterSpacing: -1, fontVariant: ["tabular-nums"] }}
      >
        {h > 0 ? `${pad(h)}:` : ""}
        {pad(m)}:{pad(s)}
      </Text>
    </View>
  );
}
