import FingerprintJS from '@fingerprintjs/fingerprintjs';

let deviceId = '';

export async function initDeviceFingerprint() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  deviceId = result.visitorId;
}

export function getDeviceId() {
  return deviceId;
}
