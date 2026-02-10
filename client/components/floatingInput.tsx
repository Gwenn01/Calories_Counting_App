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
  isNumeric?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  // Parent props
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  success?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  containerStyle?: any;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  onSubmitEditing?: () => void;
};

export default function FloatingInput({
  label,
  value,
  onChange,
  secure = false,
  isNumeric = false,
  leftIcon,
  rightIcon,
  onFocus, // <--- Prop from parent
  onBlur, // <--- Prop from parent
  onRightPress,
  error,
  success,
  loading,
  disabled,
  returnKeyType,
  onSubmitEditing,
  style,
  containerStyle,
}: FloatingInputProps) {
  // 1. Setup Animation State
  const shake = useAnimationState({
    normal: { translateX: 0 },
    shake: { translateX: [-6, 6, -4, 4, 0] },
  });

  useEffect(() => {
    if (error) shake.transitionTo("shake");
  }, [error]);

  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  // 2. DEFINE HANDLE FOCUS HERE (Inside component, before return)
  const handleFocus = () => {
    setIsFocused(true); // Update local state for animation
    if (onFocus) onFocus(); // Notify parent
  };

  // 3. DEFINE HANDLE BLUR HERE (Inside component, before return)
  const handleBlur = () => {
    setIsFocused(false); // Update local state for animation
    if (onBlur) onBlur(); // Notify parent
  };

  // 4. Return JSX
  return (
    <View className="mb-6" style={containerStyle}>
      <MotiView state={shake}>
        <View className="relative">
          {/* Floating Label */}
          <MotiView
            animate={{
              top: isActive ? -10 : 16,
              scale: isActive ? 0.85 : 1,
            }}
            transition={{ type: "timing", duration: 180 }}
            className="absolute left-4 z-10 bg-white px-1"
          >
            <Text
              className={`text-sm font-medium ${
                error
                  ? "text-red-500"
                  : success
                    ? "text-emerald-500"
                    : isFocused
                      ? "text-blue-500"
                      : "text-slate-400"
              }`}
            >
              {label}
            </Text>
          </MotiView>

          {/* Input Container */}
          <View
            className={`flex-row items-center h-14 rounded-2xl px-4 bg-white
              ${
                error
                  ? "border-red-500 border"
                  : success
                    ? "border-emerald-500 border"
                    : "border-slate-200 border"
              }
              ${disabled ? "opacity-50" : ""}
            `}
          >
            {leftIcon && <View className="mr-3">{leftIcon}</View>}

            <TextInput
              value={value}
              onChangeText={onChange}
              secureTextEntry={secure}
              keyboardType={isNumeric ? "numeric" : "default"}
              editable={!disabled}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              // 5. USE HANDLERS HERE
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="flex-1 text-slate-900 text-base h-full"
              textAlignVertical="center"
              style={style}
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

      {error && <Text className="text-xs text-red-500 mt-1 ml-2">{error}</Text>}
    </View>
  );
}
