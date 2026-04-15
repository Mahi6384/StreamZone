/**
 * Google Sign-In (GSI) must call initialize() once per client_id. Repeated
 * initialize + prompt() causes FedCM / navigator.credentials.get conflicts.
 */
const handlerRef = { fn: null };
let initializedForClientId = null;

export function ensureGoogleIdInitialized(clientId) {
  if (!clientId || !window.google?.accounts?.id) return false;
  if (initializedForClientId === clientId) return true;

  window.google.accounts.id.initialize({
    client_id: clientId,
    auto_select: false,
    use_fedcm_for_prompt: true,
    callback: (response) => {
      handlerRef.fn?.(response);
    },
  });
  initializedForClientId = clientId;
  return true;
}

/**
 * Shows One Tap / FedCM after a user gesture. Cancels any in-flight prompt first
 * so only one credentials.get runs at a time.
 */
export function requestGoogleOneTap(onCredential, { onPromptBlocked, onDismissed } = {}) {
  window.google.accounts.id.cancel();
  handlerRef.fn = onCredential;

  const runPrompt = () => {
    /** GSI may invoke this listener several times; only surface one user-facing error per click. */
    let blockedReported = false;
    const reportBlockedOnce = () => {
      if (blockedReported) return;
      blockedReported = true;
      onPromptBlocked?.();
    };

    window.google.accounts.id.prompt((notification) => {
      if (typeof notification.isDismissedMoment === "function" && notification.isDismissedMoment()) {
        onDismissed?.();
        return;
      }
      // Display / shown UI — not a failure (avoids false "blocked" toasts with FedCM).
      if (typeof notification.isDisplayMoment === "function" && notification.isDisplayMoment()) {
        return;
      }
      if (typeof notification.isDisplayed === "function" && notification.isDisplayed()) {
        return;
      }
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        reportBlockedOnce();
      }
    });
  };

  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => setTimeout(runPrompt, 0));
  } else {
    setTimeout(runPrompt, 0);
  }
}
