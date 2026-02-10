import React, { createContext, useContext, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MotiView } from "moti";

// 1. Define Types
type AlertButton = {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
};

type AlertContextType = {
  showAlert: (title: string, message: string, buttons: AlertButton[]) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context)
    throw new Error("useAlert must be used within an AlertProvider");
  return context;
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    message: "",
    buttons: [] as AlertButton[],
  });

  const showAlert = useCallback(
    (title: string, message: string, buttons: AlertButton[] = []) => {
      setConfig({ title, message, buttons });
      setVisible(true);
    },
    [],
  );

  const hideAlert = useCallback(() => setVisible(false), []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      {/* THE MODAL OVERLAY */}
      <Modal transparent visible={visible} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          {/* Animated Card */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl"
          >
            {/* Title & Message */}
            <View className="mb-6 items-center">
              <Text className="text-xl font-bold text-slate-900 text-center">
                {config.title}
              </Text>
              <Text className="mt-2 text-center text-sm font-medium text-slate-500 leading-5">
                {config.message}
              </Text>
            </View>

            {/* Buttons Stack */}
            <View className="gap-y-3">
              {config.buttons.map((btn, index) => {
                const isDestructive = btn.style === "destructive";
                const isCancel = btn.style === "cancel";

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => {
                      hideAlert(); // Close modal first
                      if (btn.onPress) btn.onPress(); // Then run action
                    }}
                    className={`w-full items-center justify-center rounded-xl py-3.5 
                      ${isDestructive ? "bg-red-50" : isCancel ? "bg-slate-100" : "bg-indigo-600"}
                    `}
                  >
                    <Text
                      className={`text-base font-bold 
                        ${isDestructive ? "text-red-600" : isCancel ? "text-slate-700" : "text-white"}
                      `}
                    >
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </MotiView>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};
