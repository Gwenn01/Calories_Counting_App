import { Tabs } from "expo-router";
import { View, Platform, Animated, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import * as Haptics from "expo-haptics";

export default function TabsLayout() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 88 : 70,
          position: "absolute",
          bottom: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 15,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="macros"
        options={{
          title: "Macros",
          tabBarIcon: ({ color }) => (
            <Feather name="pie-chart" size={22} color={color} />
          ),
        }}
      />

      {/* --- ADD BUTTON SECTION --- */}
      <Tabs.Screen
        name="add-food"
        options={{
          title: "",
          tabBarButton: (props) => (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Pressable
                onPress={props.onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                // This styling ensures the hit-area is correct
                style={{ top: -20 }}
              >
                <Animated.View
                  style={{
                    transform: [{ scale: scaleAnim }],
                    width: 60,
                    height: 60,
                    backgroundColor: "#10b981",
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 4,
                    borderColor: "white",
                    elevation: 10,
                    shadowColor: "#10b981",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }}
                >
                  <Feather name="plus" size={32} color="white" />
                </Animated.View>
              </Pressable>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Feather name="clock" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
