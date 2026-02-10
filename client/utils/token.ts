import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const TOKEN_KEY = "access_token";

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  const secureToken = await SecureStore.getItemAsync(TOKEN_KEY);
  const asyncToken = await AsyncStorage.getItem(TOKEN_KEY);

  return secureToken || asyncToken;
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await AsyncStorage.removeItem(TOKEN_KEY);
};
