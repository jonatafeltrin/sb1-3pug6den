import { requireNativeModule } from "expo-modules-core";
const RUIPasteBoard = requireNativeModule("UIPasteBoardModule");
export const UIPasteBoard = {
    setText: (text) => RUIPasteBoard.setText(text),
};
//# sourceMappingURL=index.js.map