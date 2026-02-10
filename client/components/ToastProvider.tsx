import React, { createContext, useContext, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";

// 1. Define the Types
type ToastType = "success" | "error" | "info" | "warning";

type ToastContextType = {
  showToast: (title: string, message?: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 2. The Hook to use anywhere
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

// 3. The Provider Component
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<{
    visible: boolean;
    title: string;
    message?: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback(
    (title: string, message?: string, type: ToastType = "info") => {
      setToast({ visible: true, title, message, type });

      // Auto hide after 3 seconds
      setTimeout(() => {
        setToast((prev) => (prev ? { ...prev, visible: false } : null));
      }, 3000);
    },
    [],
  );

  // Helper to get colors/icons based on type
  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-500",
          icon: "check-circle",
          text: "text-white",
        };
      case "error":
        return { bg: "bg-rose-500", icon: "alert-circle", text: "text-white" };
      case "warning":
        return {
          bg: "bg-amber-500",
          icon: "alert-triangle",
          text: "text-white",
        };
      default:
        return { bg: "bg-slate-800", icon: "info", text: "text-white" };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* GLOBAL TOAST COMPONENT */}
      <AnimatePresence>
        {toast?.visible && (
          <View className="absolute top-0 left-0 right-0 z-50 items-center justify-center pt-12 pointer-events-none">
            {/* Dynamic Island Style Container */}
            <MotiView
              from={{ opacity: 0, translateY: -100, scale: 0.9 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              exit={{ opacity: 0, translateY: -100, scale: 0.9 }}
              transition={{ type: "spring", damping: 15 }}
              className={`flex-row items-center px-4 py-3 rounded-full shadow-xl ${getStyles(toast.type).bg}`}
              style={{ minWidth: "90%", maxWidth: "95%" }}
            >
              {/* Icon */}
              <View className="bg-white/20 p-2 rounded-full mr-3">
                <Feather
                  name={getStyles(toast.type).icon as any}
                  size={20}
                  color="white"
                />
              </View>

              {/* Text Content */}
              <View className="flex-1">
                <Text className="text-white font-bold text-base">
                  {toast.title}
                </Text>
                {toast.message && (
                  <Text className="text-white/90 text-xs font-medium mt-0.5">
                    {toast.message}
                  </Text>
                )}
              </View>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
