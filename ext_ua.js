var manifest = browser.runtime.getManifest();
const FXVER = /rv:([0-9.]+)/.exec(navigator.userAgent)[1];
const USRAG = `Mozilla/5.0 (Firefox; rv:${FXVER}) Gecko/20100101 WebExtension/${manifest.browser_specific_settings.gecko.id}`;
