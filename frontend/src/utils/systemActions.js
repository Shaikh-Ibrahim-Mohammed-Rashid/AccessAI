export function simulateSystemAction(intent) {
  try {
    switch (intent) {
      case "openNewTab":
        window.open(window.location.href, "_blank", "noopener,noreferrer");
        return "Opening new tab now.";

      case "closeTab": {
        const closed = window.close();
        if (!closed) {
          return "Cannot close this window (browser protection). Use the close button instead.";
        }
        return "Closing current tab.";
      }

      case "goBack":
        window.history.back();
        return "Going to previous page.";

      case "goForward":
        window.history.forward();
        return "Going to next page.";

      case "refreshPage":
        window.location.reload();
        return "Refreshing page now.";

      case "zoomIn": {
        const scale = Math.min(document.body.style.zoom || 1, 2);
        document.body.style.zoom = scale + 0.1;
        return "Zoomed in.";
      }

      case "zoomOut": {
        const scale = Math.max(document.body.style.zoom || 1, 0.5);
        document.body.style.zoom = scale - 0.1;
        return "Zoomed out.";
      }

      case "minimizePage":
        return "Minimize simulated. (Use accessibility mode for simplified interface)";

      case "maximizePage":
        return "Maximize simulated. (Full view restored)";

      default:
        return "Action recognized but not available right now.";
    }
  } catch (error) {
    return "Action could not be completed due to browser restrictions.";
  }
}

export function performInteractionAction(intent, value = "") {
  try {
    switch (intent) {
      case "clickLoginButton": {
        const btn = document.getElementById("login-btn");
        if (btn) {
          btn.click();
          return "Clicking login button now.";
        }
        return "Login button not found in current view.";
      }

      case "submitForm": {
        const forms = document.getElementsByTagName("form");
        if (forms.length > 0) {
          const firstForm = forms[0];
          const submitBtn = firstForm.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.click();
            return "Submitting form now.";
          }
        }
        return "No form found to submit.";
      }

      case "fillUsername": {
        const emailInput = document.querySelector('input[type="email"]');
        if (emailInput) {
          emailInput.value = value || "user@example.com";
          emailInput.dispatchEvent(new Event("input", { bubbles: true }));
          return `Username filled with: ${value || "user@example.com"}`;
        }
        return "Username field not found.";
      }

      case "fillPassword": {
        const passwordInput = document.querySelector('input[type="password"]');
        if (passwordInput) {
          passwordInput.value = value || "••••••••";
          passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
          return "Password field filled.";
        }
        return "Password field not found.";
      }

      case "clearForm": {
        const forms = document.getElementsByTagName("form");
        if (forms.length > 0) {
          forms[0].reset();
          return "Form cleared.";
        }
        return "No form found to clear.";
      }

      case "selectDropdown": {
        const selects = document.getElementsByTagName("select");
        if (selects.length > 0) {
          const select = selects[0];
          if (select.options.length > 1) {
            select.selectedIndex = 1;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            return `Selected: ${select.options[1].text}`;
          }
        }
        return "No dropdown found to select.";
      }

      default:
        return "Interaction action not available.";
    }
  } catch (error) {
    return "Could not complete interaction action.";
  }
}

export function performAccessibilityAction(intent) {
  try {
    switch (intent) {
      case "increaseFontSize": {
        const root = document.documentElement;
        const currentSize = parseFloat(window.getComputedStyle(root).fontSize);
        root.style.fontSize = currentSize + 2 + "px";
        return "Font size increased.";
      }

      case "decreaseFontSize": {
        const root = document.documentElement;
        const currentSize = parseFloat(window.getComputedStyle(root).fontSize);
        if (currentSize > 10) {
          root.style.fontSize = currentSize - 2 + "px";
          return "Font size decreased.";
        }
        return "Font size is already at minimum.";
      }

      case "enableAccessibility": {
        document.body.setAttribute("data-accessibility", "enabled");
        document.body.classList.add("accessibility-enhanced");
        return "Accessibility mode enabled.";
      }

      default:
        return "Accessibility action not available.";
    }
  } catch (error) {
    return "Could not complete accessibility adjustment.";
  }
}
