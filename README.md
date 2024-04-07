# Firefox Addon dev notes

Notes for issues and gotchas encountered when developing and testing Firefox extensions.

## Testing on AMO (addons.mozilla.org)
  - If the test machine does not have the correct time set, attempting to install a recent version of an extension from addons.mozilla.org may show an error "this addon may be corrupt" and won't install it even if the addon does work and installs successfully from the debugging menu. 
  
 **Takeaway:** Take care to make sure the time is synced correctly in VM snapshots when testing.

## WebExtensions API

### Context Menu Extensions

#### Legacy Compatibility

##### `browser.menus` vs. `chrome.contextMenus`:
  - There are three main ways of creating context menus: 
    - `menus` manifest permission and `browser.menus.create({})` + `activeTab` permission ([Example: hashzilla 0.1.6](https://github.com/wesinator/HashZilla/blob/0b597dd97acd6d217645d9bec07b5c4fbf939dc8/src/background.js#L27))
    - `contextMenus` permission and `chrome.contextMenus.create({})` + `activeTab` permission ([Example: hashzilla 0.2.0](https://github.com/wesinator/HashZilla/blob/037a19c604eb0a0c343228c371441e0b09bc9c8b/src/background.js#L27))
    - `contextMenus` permission and `browser.contextMenus.create({})` + `tabs` permission ([Example: open-in-cyberchef-firefox](https://github.com/maurermj08/open-in-cyber-chef-firefox/blob/a96b31b872c5ff62b4beb1b004780c7724ee4939/main.js#L16))

  The last two constructs have examples that are tested and working in older versions of Firefox, like 48.0 (the minimum for WebExtensions support) and 52esr. 

  The first construct works in recent (mv2) versions of Firefox, but not earlier versions like 48.0 and 52: `browser.menus is undefined`

 **Takeaway:** use of `chrome.contextMenus.create` is preferred, and [also works with mv3 chrome extensions](https://github.com/wesinator/example-mv3-contextmenu-executescript).

### `executeScript` and host types

  The permissions error `"Missing host permissions for the tab"` is present on `view-source`, PDF view (pdf.js), and reader view pages when trying to run `{scripting|tabs}.executeScript()`.
  
  The "missing host permissions" error has also been observed when using the `tabs` permission and loading `executeScript` on a local file (`file://`) URI.
  
  Using the `activeTab` manifest permission instead of `tabs` was found to fix host permissions errors on `file://` pages.
  
 **Takeaway:** `activeTab` is preferred, but view-source, PDF viewer, and reader view pages still won't load `executeScript` behaviors.

## Manifest V3 migration

### Permissions and host access in MV3
In MV3, [`host_permissions` access is "optional"](https://bugzilla.mozilla.org/show_bug.cgi?id=1745818), meaning host permissions do not run by default, and must be set by the user, [requested by the addon](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions) or enabled using `activeTab` with a user input handler.
`<all_urls>` host_permission has no effect, whether or not this is by design.

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/host_permissions#requested_permissions_and_user_prompts

https://stackoverflow.com/questions/76083327/firefox-extension-manifest-v3-request-permission-to-access-your-data-for-all

`permissions.request` cannot be called via `chrome.runtime.onInstalled.AddListener`, and must be called from a user input handler.

Ex: https://github.com/ipfs/ipfs-companion/blob/7ca6433418909d43ec8801f27e417514614a164c/add-on/src/lib/on-installed.js#L24
