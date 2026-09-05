import { selectBackend } from '../platform/index';
import { linuxClipboardBackend } from '../platform/linux/gtk-clipboard';
import * as macosClipboard from '../platform/macos/cocoa-clipboard';
import { windowsClipboardBackend } from '../platform/windows/windows-clipboard';
import { type NativeImage, nativeImage } from './native-image';

/**
 * System clipboard access — the drop-in equivalent of Electron's `clipboard`.
 *
 * Reads are async on every platform even though only GDK 4's read is async-only:
 * a deliberate uniform contract, so app code does not branch per OS.
 */

export type Clipboard = {
  /** `''` if the clipboard holds no text. */
  readText(): Promise<string>;
  writeText(text: string): void;
  /** `''` if the clipboard holds no HTML. */
  readHTML(): Promise<string>;
  writeHTML(markup: string): void;
  /** An empty {@link NativeImage} if the clipboard holds no image. */
  readImage(): Promise<NativeImage>;
  /** Written as PNG. */
  writeImage(image: NativeImage): void;
  /** MIME type names. */
  availableFormats(): string[];
  clear(): void;
};

export type ClipboardBackend = {
  readText(): string | Promise<string>;
  writeText(text: string): void;
  readHTML(): string | Promise<string>;
  writeHTML(markup: string): void;
  /** PNG bytes, or an empty array if the clipboard holds no image. */
  readImage(): Uint8Array | Promise<Uint8Array>;
  writeImage(bytes: Uint8Array): void;
  availableFormats(): string[];
  clear(): void;
};

const macosBackend: ClipboardBackend = {
  readText: () => macosClipboard.readText(),
  writeText: (text) => macosClipboard.writeText(text),
  readHTML: () => macosClipboard.readHTML(),
  writeHTML: (markup) => macosClipboard.writeHTML(markup),
  readImage: () => macosClipboard.readImage(),
  writeImage: (bytes) => macosClipboard.writeImage(bytes),
  availableFormats: () => macosClipboard.availableFormats(),
  clear: () => macosClipboard.clear(),
};

const { get: getBackend, setForTesting } = selectBackend<ClipboardBackend>('clipboard', {
  macos: () => macosBackend,
  linux: () => linuxClipboardBackend,
  windows: () => windowsClipboardBackend,
});

/** @internal */
export const setClipboardBackendForTesting = setForTesting;

export const clipboard: Clipboard = {
  // `Promise.resolve` flattens a sync string (macOS) or a Promise (Linux/macOS
  // wrapper) uniformly into the async contract without double-wrapping.
  readText() {
    return Promise.resolve(getBackend().readText());
  },
  writeText(text) {
    getBackend().writeText(text);
  },
  readHTML() {
    return Promise.resolve(getBackend().readHTML());
  },
  writeHTML(markup) {
    getBackend().writeHTML(markup);
  },
  readImage() {
    return Promise.resolve(getBackend().readImage()).then((png) =>
      png.length === 0 ? nativeImage.createEmpty() : nativeImage.createFromBuffer(png),
    );
  },
  writeImage(image) {
    getBackend().writeImage(image.toPNG());
  },
  availableFormats() {
    return getBackend().availableFormats();
  },
  clear() {
    getBackend().clear();
  },
};
