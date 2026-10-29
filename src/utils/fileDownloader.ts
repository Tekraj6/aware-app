import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

interface SaveOrShareOptions {
  filename: string;
  data: string; // text string or base64 data URL
  mimeType: string;
  isBase64?: boolean;
  title: string;
}

export async function saveOrShareFile(options: SaveOrShareOptions): Promise<void> {
  const { filename, data, mimeType, isBase64, title } = options;

  // 1. Native Mobile Device execution (Android APK via Capacitor)
  if (Capacitor.isNativePlatform()) {
    try {
      let writeData = data;
      if (isBase64 && data.includes(',')) {
        writeData = data.split(',')[1];
      }

      // Write directly to app cache directory (no external storage permissions required on Android 10-15)
      const fileResult = await Filesystem.writeFile({
        path: filename,
        data: writeData,
        directory: Directory.Cache,
      });

      // Present native Android Share Sheet (Save to Downloads, Drive, Files, WhatsApp, Email, etc.)
      await Share.share({
        title,
        text: `Here is your ${title} from Aware`,
        url: fileResult.uri,
        dialogTitle: `Export ${filename}`,
      });
      return;
    } catch (nativeErr) {
      console.warn('Native Capacitor filesystem/share failed, falling back:', nativeErr);
    }
  }

  // 2. Web Share API fallback (if supported on mobile browsers)
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      let file: File;
      if (isBase64) {
        const rawBase64 = data.includes(',') ? data.split(',')[1] : data;
        const byteCharacters = atob(rawBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        file = new File([blob], filename, { type: mimeType });
      } else {
        const blob = new Blob([data], { type: mimeType });
        file = new File([blob], filename, { type: mimeType });
      }

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
          text: `Your ${title} from Aware`,
        });
        return;
      }
    } catch (webShareErr) {
      console.warn('Web Share API error, using direct download link:', webShareErr);
    }
  }

  // 3. Desktop Web Fallback: Standard <a> download link
  let url: string;
  let shouldRevoke = false;

  if (isBase64) {
    url = data.startsWith('data:') ? data : `data:${mimeType};base64,${data}`;
  } else {
    const blob = new Blob([data], { type: mimeType });
    url = URL.createObjectURL(blob);
    shouldRevoke = true;
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (shouldRevoke) {
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}
