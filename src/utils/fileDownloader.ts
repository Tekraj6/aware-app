import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FileOpener } from '@capacitor-community/file-opener';

export interface FileExportOptions {
  filename: string;
  data: string; // text string or base64 data URL
  mimeType: string;
  isBase64?: boolean;
  title: string;
}

export interface ExportResult {
  success: boolean;
  filename: string;
  uri: string;
  mimeType: string;
  title: string;
  isNative: boolean;
  data: string;
  isBase64?: boolean;
}

/**
 * Downloads/saves the file directly onto the device filesystem.
 * On Native Android (APK): Saves to Documents directory (with Cache fallback).
 * On Web: Triggers standard browser file download.
 */
export async function downloadFileToDevice(options: FileExportOptions): Promise<ExportResult> {
  const { filename, data, mimeType, isBase64, title } = options;

  let cleanData = data;
  if (isBase64 && data.includes(',')) {
    cleanData = data.split(',')[1];
  }

  // 1. Native Mobile Execution (Android APK)
  if (Capacitor.isNativePlatform()) {
    let savedUri = '';
    try {
      // First try saving directly to Documents folder (publicly accessible on phone)
      const docResult = await Filesystem.writeFile({
        path: filename,
        data: cleanData,
        directory: Directory.Documents,
        recursive: true,
      });
      savedUri = docResult.uri;
    } catch {
      // Fallback to Cache directory if Documents has strict Scoped Storage on some Android builds
      const cacheResult = await Filesystem.writeFile({
        path: filename,
        data: cleanData,
        directory: Directory.Cache,
        recursive: true,
      });
      savedUri = cacheResult.uri;
    }

    return {
      success: true,
      filename,
      uri: savedUri,
      mimeType,
      title,
      isNative: true,
      data,
      isBase64,
    };
  }

  // 2. Web Browser Execution: Trigger browser download immediately
  let url: string;
  if (isBase64) {
    url = data.startsWith('data:') ? data : `data:${mimeType};base64,${data}`;
  } else {
    const blob = new Blob([data], { type: mimeType });
    url = URL.createObjectURL(blob);
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  return {
    success: true,
    filename,
    uri: url,
    mimeType,
    title,
    isNative: false,
    data,
    isBase64,
  };
}

/**
 * Directly opens the file using Android's native system viewer (PDF viewer / Text viewer)
 * or browser tab on web.
 */
export async function openDownloadedFile(result: ExportResult): Promise<void> {
  if (Capacitor.isNativePlatform() && result.uri) {
    try {
      await FileOpener.open({
        filePath: result.uri,
        contentType: result.mimeType,
      });
      return;
    } catch (openErr) {
      console.warn('Native FileOpener failed, falling back to Share sheet:', openErr);
      // Fallback to system share if no default app handler is found
      await shareDownloadedFile(result);
      return;
    }
  }

  // Web Browser fallback: Open file in a new tab
  if (result.uri) {
    const w = window.open(result.uri, '_blank');
    if (!w) {
      window.location.href = result.uri;
    }
  }
}

/**
 * Shares the file via Android's native Share Sheet.
 */
export async function shareDownloadedFile(result: ExportResult): Promise<void> {
  if (Capacitor.isNativePlatform() && result.uri) {
    try {
      await Share.share({
        title: result.title,
        text: `Here is your ${result.title} from Aware`,
        url: result.uri,
        dialogTitle: `Share ${result.filename}`,
      });
      return;
    } catch (shareErr) {
      console.warn('Capacitor Share failed:', shareErr);
    }
  }

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      let file: File;
      if (result.isBase64) {
        const raw = result.data.includes(',') ? result.data.split(',')[1] : result.data;
        const bytes = atob(raw);
        const arr = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
          arr[i] = bytes.charCodeAt(i);
        }
        file = new File([arr], result.filename, { type: result.mimeType });
      } else {
        file = new File([result.data], result.filename, { type: result.mimeType });
      }

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: result.title,
          text: `Your ${result.title} from Aware`,
        });
      }
    } catch (err) {
      console.warn('Web Share failed:', err);
    }
  }
}
