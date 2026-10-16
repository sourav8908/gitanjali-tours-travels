/**
 * DEMO sign-in only.
 *
 * The site has no server, so this check runs in the browser and anyone can
 * read these credentials in the page source. That's acceptable for the demo
 * because admin edits are saved only in the editor's own browser and never
 * change the live site. Replace with real authentication when a backend
 * (database + API) is added.
 */
export const DEMO_USERNAME = 'admin';
export const DEMO_PASSWORD = 'gitanjali@5602';

const SESSION_KEY = 'gitanjali-tours:admin-session';

export function isSignedIn(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function signIn(username: string, password: string): boolean {
  if (username.trim().toLowerCase() !== DEMO_USERNAME || password !== DEMO_PASSWORD) return false;
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Storage blocked: stay signed in for this page view only
  }
  return true;
}

export function signOut(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear
  }
}
