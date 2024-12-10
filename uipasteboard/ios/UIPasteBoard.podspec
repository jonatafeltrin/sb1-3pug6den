require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'UIPasteBoard'
  s.version        = package['version']
  s.platform       = :ios, '13.0'
  s.summary        = 'appmaisarquitetura'
  s.description    = 'appmaisarquitetura'
  s.author         = 'portobello'
  s.source         = { :git => ''}
  s.homepage       = 'https://www.portobello.com.br/'
  s.source_files   = "**/*.swift"

  s.dependency 'ExpoModulesCore'
  s.static_framework = true
end
