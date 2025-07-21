export async function generateDeviceId(): Promise<string> {
  const navigatorInfo = window.navigator;
  const screenInfo = window.screen;

  const rawData = [
    navigatorInfo.userAgent,
    navigatorInfo.language,
    navigatorInfo.platform,
    screenInfo.width,
    screenInfo.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join('||');

  if (window.crypto?.subtle?.digest) {
    const encoder = new TextEncoder();
    const data = encoder.encode(rawData);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hex;
  } else {
    // fallback: 简单 hash（不安全，但兜底）
    let hash = 0;
    for (let i = 0; i < rawData.length; i++) {
      const chr = rawData.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return `fallback-${Math.abs(hash)}`;
  }
}
