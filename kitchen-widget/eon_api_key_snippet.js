// E.ON Next API key helper - paste into the browser console on
// https://www.eonnext.com while you are logged in (Chrome: View > Developer >
// JavaScript Console). It never sends your key anywhere except E.ON's own API.
// It only CREATES a key if your account has none, so it will not break
// another app that already uses one.
(async () => {
  let tok = null;
  for (const k of Object.keys(localStorage)) {
    if (!k.startsWith("@@auth0spajs@@")) continue;
    try { const v = JSON.parse(localStorage.getItem(k)); tok = tok || (v.body && v.body.id_token) || v.id_token; } catch (e) {}
  }
  if (!tok) { console.log("No E.ON login found. Sign in at eonnext.com in this tab, then run this again."); return; }
  const gql = async (query) => {
    const r = await fetch("https://api.eonnext-kraken.energy/v1/graphql/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + tok },
      body: JSON.stringify({ query }),
    });
    return r.json();
  };
  const v = await gql("{ viewer { liveSecretKey } }");
  if (v.errors) { console.log("E.ON said:", v.errors.map((e) => e.message).join("; ")); return; }
  let key = v.data.viewer.liveSecretKey;
  if (!key) {
    const r = await gql("mutation { regenerateSecretKey { key } }");
    if (r.errors) { console.log("E.ON said:", r.errors.map((e) => e.message).join("; ")); return; }
    key = r.data.regenerateSecretKey.key;
    console.log("Created a new API key for your account.");
  } else {
    console.log("Your account already had an API key - using it.");
  }
  try { copy(key); console.log("Key copied to the clipboard. Paste it into the kitchen board setup."); }
  catch (e) { console.log("Your key:", key); }
})();
