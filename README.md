# Firefox Addon dev notes

Notes for issues and gotchas encountered when developing and testing Firefox extensions.

### Testing on AMO (addons.mozilla.org)
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

  #### `executeScript` and host types

  The permissions error `"Missing host permissions for the tab"` is present on `view-source`, PDF view (pdf.js), and reader view pages when trying to run `{scripting|tabs}.executeScript()`.
  
  The "missing host permissions" error has also been observed when using the `tabs` permission and loading `executeScript` on a local file (`file://`) URI.
  
  Using the `activeTab` manifest permission instead of `tabs` was found to fix host permissions errors on `file://` pages.
  
 **Takeaway:** `activeTab` is preferred, but view-source, PDF viewer, and reader view pages still won't load `executeScript` behaviors.
