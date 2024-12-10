import ExpoModulesCore
import UIKit

public class UIPasteBoardModule: Module {
  public func definition() -> ModuleDefinition {
    Name("UIPasteBoardModule")
    Function("setText") { (text: String) -> Void in
      UIPasteboard.general.string = text
    }
  }
}