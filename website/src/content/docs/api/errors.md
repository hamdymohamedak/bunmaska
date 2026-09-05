---
title: "Errors & platform helpers"
description: "What bunmaska exports for error handling and platform checks: the BunmaskaError family, currentPlatform / isSupported, BUNMASKA_VERSION, and the option types."
order: 25
---

Process: Main

Beyond the Electron-shaped modules, the `bunmaska` barrel exports a small set of helpers you will reach for when an API throws or when you branch per platform. None of these exist in Electron; they are Bunmaska's own.

## Errors

Every error Bunmaska throws is a `BunmaskaError`. Branch on `instanceof` and on the stable `code` field, never on message text.

| Class | `code` | Thrown when |
| --- | --- | --- |
| `BunmaskaError` | `undefined` on the base class | Base class for everything below. |
| `UnsupportedPlatformError` | `ERR_UNSUPPORTED_PLATFORM` | An API is called on a platform that does not support it (e.g. `sendInputEvent` off Windows). |
| `InvalidArgumentError` | `ERR_INVALID_ARGUMENT` | An argument violates a documented contract - an unknown `app.getPath` name, a raw ESM preload handed to `BrowserWindow`. |
| `FFIError` | `ERR_FFI` | A native library or symbol cannot be loaded or resolved through `bun:ffi`. |

```ts
import { app, InvalidArgumentError, UnsupportedPlatformError } from 'bunmaska';

try {
  app.getPath('nope');
} catch (err) {
  if (err instanceof InvalidArgumentError) console.error(err.code, err.message);
}
```

## Platform checks

- `currentPlatform()` - returns `'macos' | 'linux' | 'windows'` (the `Platform` type is exported too).
- `isSupported(platform)` - `true` for the platforms Bunmaska runs on.
- `BUNMASKA_VERSION` - the framework version string, for logs and about panels.

```ts
import { currentPlatform, isSupported, BUNMASKA_VERSION } from 'bunmaska';

console.log(`bunmaska ${BUNMASKA_VERSION} on ${currentPlatform()}`, isSupported(currentPlatform()));
```

## Option types

The option shapes the main-process APIs take are exported for your own signatures: `WebPreferences` (the `BrowserWindow` `webPreferences` bag), `LoadFileOptions` (`webContents.loadFile`), `MenuPopupOptions` (`menu.popup`), and `MouseInputEvent` / `KeyboardInputEvent` (`webContents.sendInputEvent`).

```ts
import type { MenuPopupOptions, WebPreferences } from 'bunmaska';
```
