/**
 * Detects if third-party cookies are supported and enabled
 */
export async function detectThirdPartyCookieSupport() {
  try {
    // Create a test iframe to check third-party cookie support
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src =
      'data:text/html,<script>try{document.cookie="test=1";parent.postMessage(document.cookie.includes("test=1"),"*")}catch(e){parent.postMessage(false,"*")}</script>';

    document.body.appendChild(iframe);

    return new Promise((resolve) => {
      let resolved = false;

      const messageHandler = (event) => {
        if (!resolved) {
          resolved = true;
          document.body.removeChild(iframe);
          window.removeEventListener("message", messageHandler);

          const canSetThirdParty = event.data === true;
          resolve({
            isSupported: canSetThirdParty,
            isBlocked: !canSetThirdParty,
            canSetThirdParty,
          });
        }
      };

      window.addEventListener("message", messageHandler);

      // Fallback timeout
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          document.body.removeChild(iframe);
          window.removeEventListener("message", messageHandler);
          resolve({
            isSupported: false,
            isBlocked: true,
            canSetThirdParty: false,
          });
        }
      }, 2000);
    });
  } catch (error) {
    return {
      isSupported: false,
      isBlocked: true,
      canSetThirdParty: false,
    };
  }
}

/**
 * Gets the current cookie consent state
 */
export function getCookieConsent() {
  try {
    const consentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookie-consent="))
      ?.split("=")[1];

    if (!consentCookie) return null;

    return JSON.parse(decodeURIComponent(consentCookie));
  } catch (error) {
    return null;
  }
}

/**
 * Sets the cookie consent preferences
 */
export function setCookieConsent(consent) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const consentString = encodeURIComponent(JSON.stringify(consent));

  document.cookie = `cookie-consent=${consentString}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

  // Trigger custom event for other parts of the app to listen to
  window.dispatchEvent(
    new CustomEvent("cookieConsentUpdate", { detail: consent })
  );
}

/**
 * Loads third-party scripts based on consent
 */
export function loadThirdPartyScripts(consent) {
  if (consent.thirdParty) {
    // Load third-party scripts
    console.log("Loading third-party scripts...");
  }
}

/**
 * Checks if consent is needed (no existing consent or expired)
 */
export function isConsentNeeded() {
  const consent = getCookieConsent();
  return consent === null;
}

/**
 * Provides instructions for enabling third-party cookies
 */
export function getThirdPartyCookieInstructions() {
  return {
    Chrome: [
      "Click the three dots menu (⋮) in the top right",
      "Go to Settings > Privacy and security > Cookies and other site data",
      'Select "Allow all cookies" or "Block third-party cookies in Incognito"',
    ],
    Firefox: [
      "Click the menu button (☰) in the top right",
      "Go to Settings > Privacy & Security",
      'Under Cookies and Site Data, uncheck "Delete cookies and site data when Firefox is closed"',
    ],
    Safari: [
      "Go to Safari > Preferences > Privacy",
      'Uncheck "Prevent cross-site tracking"',
      'Uncheck "Block all cookies"',
    ],
    Edge: [
      "Click the three dots menu (...) in the top right",
      "Go to Settings > Cookies and site permissions > Cookies and site data",
      'Select "Allow all cookies"',
    ],
  };
}
