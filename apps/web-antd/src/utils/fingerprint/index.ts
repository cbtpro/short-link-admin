import { generateDeviceId } from './device-id';

let deviceId = '';
export async function initDeviceFingerprint() {
  deviceId = await generateDeviceId();
}

export function getDeviceId() {
  return deviceId;
}
