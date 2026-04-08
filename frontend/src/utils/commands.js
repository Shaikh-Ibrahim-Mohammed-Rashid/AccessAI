const commandDefinitions = [
  // Navigation Commands
  {
    intent: "openDashboard",
    rules: [/(open|go\s+to|show|switch\s+to)\s+(the\s+)?dashboard/i],
    keywords: ["dashboard", "open"],
  },
  {
    intent: "goToProfile",
    rules: [/(open|go\s+to|show|switch\s+to)\s+(my\s+)?profile/i],
    keywords: ["profile"],
  },
  {
    intent: "goToSettings",
    rules: [/(open|go\s+to|show|switch\s+to)\s+(the\s+)?settings/i],
    keywords: ["settings"],
  },
  {
    intent: "goToHelp",
    rules: [/(open|go\s+to|show|switch\s+to)\s+(the\s+)?help/i],
    keywords: ["help"],
  },
  {
    intent: "goBack",
    rules: [/(go\s+back|back\s+page|previous|previous\s+page|step\s+back)/i],
    keywords: ["back"],
  },
  {
    intent: "goForward",
    rules: [/(go\s+forward|forward\s+page|next\s+page|step\s+forward)/i],
    keywords: ["forward"],
  },

  // Scroll Commands
  {
    intent: "scrollDown",
    rules: [
      /(scroll\s+(down|little\s+down|more|further)|move\s+down|go\s+down|page\s+down)/i,
    ],
    keywords: ["down", "scroll"],
  },
  {
    intent: "scrollUp",
    rules: [/(scroll\s+(up|little\s+up|back)|move\s+up|go\s+up|page\s+up)/i],
    keywords: ["up", "scroll"],
  },
  {
    intent: "scrollTop",
    rules: [/(scroll\s+to\s+top|go\s+to\s+top|top\s+of\s+page|scroll\s+top)/i],
    keywords: ["top", "scroll"],
  },
  {
    intent: "scrollBottom",
    rules: [
      /(scroll\s+to\s+bottom|go\s+to\s+bottom|bottom\s+of\s+page|scroll\s+bottom|end\s+of\s+page)/i,
    ],
    keywords: ["bottom", "scroll"],
  },

  // Interaction Commands
  {
    intent: "clickLoginButton",
    rules: [/(click|press|tap)\s+(the\s+)?login\s+button|submit\s+login/i],
    keywords: ["login", "click"],
  },
  {
    intent: "submitForm",
    rules: [/(submit|send|click)\s+(the\s+)?form|submit\s+now/i],
    keywords: ["submit", "form"],
  },
  {
    intent: "fillUsername",
    rules: [/(fill|enter|type)\s+(username|name)/i],
    keywords: ["fill", "username"],
  },
  {
    intent: "fillPassword",
    rules: [/(fill|enter|type)\s+password/i],
    keywords: ["password"],
  },
  {
    intent: "clearForm",
    rules: [/(clear|reset|empty)\s+(the\s+)?form|clear\s+fields/i],
    keywords: ["clear", "form"],
  },
  {
    intent: "selectDropdown",
    rules: [/(select|click|open)\s+(the\s+)?dropdown|choose\s+option/i],
    keywords: ["select", "dropdown"],
  },

  // Tab Commands (Virtual Tab System)
  {
    intent: "switchToDashboardTab",
    rules: [/(switch|go|open)\s+(to\s+)?dashboard\s+tab/i],
    keywords: ["dashboard", "tab"],
  },
  {
    intent: "switchToProfileTab",
    rules: [/(switch|go|open)\s+(to\s+)?(my\s+)?profile\s+tab/i],
    keywords: ["profile", "tab"],
  },
  {
    intent: "switchToSettingsTab",
    rules: [/(switch|go|open)\s+(to\s+)?settings\s+tab/i],
    keywords: ["settings", "tab"],
  },
  {
    intent: "switchToHelpTab",
    rules: [/(switch|go|open)\s+(to\s+)?help\s+tab/i],
    keywords: ["help", "tab"],
  },
  {
    intent: "openNewTab",
    rules: [/(open|new)\s+(a\s+)?new\s+tab|new\s+tab|open\s+tab/i],
    keywords: ["new", "tab"],
  },
  {
    intent: "closeTab",
    rules: [/(close|shut)\s+(this\s+)?(tab|current\s+tab)|close\s+window/i],
    keywords: ["close", "tab"],
  },

  // Accessibility Commands
  {
    intent: "enableAccessibility",
    rules: [/(enable|turn\s+on|activate)\s+accessibility/i],
    keywords: ["enable", "accessibility"],
  },
  {
    intent: "increaseFontSize",
    rules: [/(increase|make\s+bigger|large)\s+(font|text|size)|zoom\s+in/i],
    keywords: ["increase", "font"],
  },
  {
    intent: "decreaseFontSize",
    rules: [/(decrease|make\s+smaller|small)\s+(font|text|size)|zoom\s+out/i],
    keywords: ["decrease", "font"],
  },
  {
    intent: "enableContrast",
    rules: [/(enable|turn\s+on|activate)\s+(high\s+)?contrast/i],
    keywords: ["enable", "contrast"],
  },
  {
    intent: "disableContrast",
    rules: [/(disable|turn\s+off|deactivate)\s+(high\s+)?contrast/i],
    keywords: ["disable", "contrast"],
  },
  {
    intent: "toggleContrast",
    rules: [/(toggle|switch)\s+(high\s+)?contrast/i],
    keywords: ["toggle", "contrast"],
  },
  {
    intent: "readPage",
    rules: [/(read|start\s+reading|read\s+aloud|read\s+out)\s+(this\s+)?page/i],
    keywords: ["read"],
  },
  {
    intent: "stopReading",
    rules: [/(stop|pause|mute|quit)\s+(reading|voice)/i],
    keywords: ["stop", "reading"],
  },

  // AI Assistant Commands
  {
    intent: "explainPage",
    rules: [/(explain|summarize|what\s+is)\s+(this\s+)?(page|content)|tell\s+me\s+about/i],
    keywords: ["explain"],
  },
  {
    intent: "suggestNextStep",
    rules: [/(what\s+should|what\s+can)\s+i\s+(do\s+)?next|suggest|guide\s+me/i],
    keywords: ["next", "step"],
  },
  {
    intent: "helpLogin",
    rules: [/(help|assist)\s+me\s+(with\s+)?login|how\s+to\s+login/i],
    keywords: ["help", "login"],
  },
  {
    intent: "stepByStepGuide",
    rules: [/(guide|walk|help)\s+me\s+step\s+by\s+step/i],
    keywords: ["step", "guide"],
  },
  {
    intent: "openAssistant",
    rules: [/(open|show|launch|activate)\s+(the\s+)?assistant/i],
    keywords: ["assistant"],
  },

  // System Commands
  {
    intent: "refreshPage",
    rules: [/(refresh|reload|restart)\s+(the\s+)?page|refresh\s+now/i],
    keywords: ["refresh"],
  },
  {
    intent: "zoomIn",
    rules: [/(zoom\s+in|make\s+bigger|enlarge|magnify)/i],
    keywords: ["zoom", "in"],
  },
  {
    intent: "zoomOut",
    rules: [/(zoom\s+out|make\s+smaller|shrink)/i],
    keywords: ["zoom", "out"],
  },
  {
    intent: "minimizePage",
    rules: [/(minimize|collapse|shrink)\s+(the\s+)?page|minimal\s+view/i],
    keywords: ["minimize"],
  },
  {
    intent: "maximizePage",
    rules: [/(maximize|expand|restore)\s+(the\s+)?page|full\s+view/i],
    keywords: ["maximize"],
  },

  // Old Legacy Commands (for backwards compatibility)
  {
    intent: "highlightLogin",
    rules: [/(help|find|where\s+is)\s+(the\s+)?login/i],
    keywords: ["login"],
  },
];

function normalizeTranscript(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function inferIntentDetails(transcript) {
  const normalized = normalizeTranscript(transcript);
  if (!normalized) {
    return { intent: null, confidence: 0 };
  }

  for (const definition of commandDefinitions) {
    if (definition.rules.some((rule) => rule.test(normalized))) {
      return { intent: definition.intent, confidence: 1 };
    }
  }

  let best = { intent: null, confidence: 0 };

  for (const definition of commandDefinitions) {
    const matched = definition.keywords.filter((keyword) => normalized.includes(keyword)).length;
    if (!definition.keywords.length) {
      continue;
    }

    const score = matched / definition.keywords.length;
    if (score > best.confidence && score >= 0.5) {
      best = { intent: definition.intent, confidence: score };
    }
  }

  return best;
}

export function inferIntent(transcript) {
  return inferIntentDetails(transcript).intent;
}
