import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MotiView, useAnimationState } from "moti";
import { Feather } from "@expo/vector-icons";

type FloatingInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;

  secure?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;

  error?: string;
  success?: boolean;
  loading?: boolean;
  disabled?: boolean;

  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
};

export default function FloatingInput({
  label,
  value,
  onChange,
  secure = false,
  leftIcon,
  rightIcon,
  onRightPress,
  error,
  success,
  loading,
  disabled,
  returnKeyType,
  onSubmitEditing,
}: FloatingInputProps) {
  // Shake animation for error
  const shake = useAnimationState({
    normal: { translateX: 0 },
    shake: {
      translateX: [-6, 6, -4, 4, 0],
    },
  });

  useEffect(() => {
    if (error) {
      shake.transitionTo("shake");
    }
  }, [error]);

  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <View className="mb-6">
      <MotiView state={shake}>
        <View className="relative">
          {/* Floating label */}
          <MotiView
            animate={{
              top: isActive ? -6 : 16,
              scale: isActive ? 0.85 : 1,
            }}
            transition={{ type: "timing", duration: 180 }}
            className="absolute left-4 z-10 bg-white px-1"
          >
            <Text
              className={`text-sm ${
                error
                  ? "text-red-500"
                  : success
                    ? "text-emerald-500"
                    : "text-slate-400"
              }`}
            >
              {label}
            </Text>
          </MotiView>

          {/* Input box */}
          <View
            className={`flex-row items-center h-14 rounded-2xl px-4 bg-white
              ${
                error
                  ? "border border-red-500"
                  : success
                    ? "border border-emerald-500"
                    : "border border-slate-200"
              }
              ${disabled ? "opacity-50" : ""}
            `}
          >
            {leftIcon && <View className="mr-3">{leftIcon}</View>}

            <TextInput
              value={value}
              onChangeText={onChange}
              secureTextEntry={secure}
              editable={!disabled}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 text-slate-900 text-base"
              textAlignVertical="center"
            />

            {loading && <ActivityIndicator size="small" className="ml-3" />}

            {!loading && success && (
              <Feather
                name="check-circle"
                size={18}
                color="#10b981"
                className="ml-3"
              />
            )}

            {!loading && rightIcon && (
              <Pressable onPress={onRightPress} className="ml-3">
                {rightIcon}
              </Pressable>
            )}
          </View>
        </View>
      </MotiView>

      {/* Error message */}
      {error && <Text className="text-xs text-red-500 mt-1 ml-2">{error}</Text>}
    </View>
  );
}
