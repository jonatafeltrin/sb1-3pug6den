import { requireNativeModule } from "expo-modules-core";
const RUIPasteBoard = requireNativeModule("UIPasteBoardModule");
export const UIPasteBoard = {
  setText: (text: string) => RUIPasteBoard.setText(text),
};
