export const copy = {
  en: {
    appTitle: "AccessAI",
    tagline: "The Web for Everyone",
    hero: "AI-powered accessibility for users with visual, motor, and cognitive challenges.",
    readPage: "Read Page",
    stopReading: "Stop Reading",
    startVoice: "Start Voice Navigation",
    stopVoice: "Stop Voice Navigation",
    smartVision: "Smart Vision",
    adaptive: "Adaptive Mode",
    highContrast: "High Contrast",
    loginHelp: "Help me login",
    onboardingTitle: "Welcome to AccessAI",
    onboardingBody: "Use voice commands, ask the AI assistant, or enable Smart Vision to navigate faster.",
    voiceUnsupported: "Voice navigation is not supported in this browser.",
    languageSwitched: "Language updated successfully.",
    smartVisionRecovered: "Smart Vision is active with safe mode enabled.",
    aiGuideHint: "AI Guide: You can click the highlighted area to continue.",
  },
  hi: {
    appTitle: "AccessAI",
    tagline: "सबके लिए वेब",
    hero: "दृष्टि, मोटर और संज्ञानात्मक चुनौतियों वाले उपयोगकर्ताओं के लिए AI आधारित एक्सेसिबिलिटी।",
    readPage: "पेज पढ़ें",
    stopReading: "पढ़ना बंद करें",
    startVoice: "वॉइस नेविगेशन शुरू करें",
    stopVoice: "वॉइस नेविगेशन बंद करें",
    smartVision: "स्मार्ट विज़न",
    adaptive: "एडाप्टिव मोड",
    highContrast: "हाई कॉन्ट्रास्ट",
    loginHelp: "मुझे लॉगिन में मदद करें",
    onboardingTitle: "AccessAI में आपका स्वागत है",
    onboardingBody: "वॉइस कमांड, AI असिस्टेंट और स्मार्ट विज़न से तेज़ नेविगेशन करें।",
    voiceUnsupported: "इस ब्राउज़र में वॉइस नेविगेशन समर्थित नहीं है।",
    languageSwitched: "भाषा सफलतापूर्वक बदल गई है।",
    smartVisionRecovered: "स्मार्ट विज़न सुरक्षित मोड के साथ सक्रिय है।",
    aiGuideHint: "AI गाइड: आगे बढ़ने के लिए हाइलाइट किए गए भाग पर क्लिक करें।",
  },
};

export function getCopy(language) {
  return copy[language] || copy.en;
}
