export function getApiBaseUrl(): string {
  // If the user entered an IP on the Patient Connect screen, use it.
  // Otherwise default to localhost for the Dentist Hub.
  const storedIp = localStorage.getItem('dentech_hub_ip');
  
  if (storedIp) {
    // Basic check if they typed a port, if not append :8000
    if (storedIp.includes(':')) {
      return `http://${storedIp}`;
    }
    return `http://${storedIp}:8000`;
  }
  
  // Default for Dentist Hub running locally
  return 'http://127.0.0.1:8000';
}

export function getWsBaseUrl(): string {
  const storedIp = localStorage.getItem('dentech_hub_ip');
  if (storedIp) {
    if (storedIp.includes(':')) {
      return `ws://${storedIp}`;
    }
    return `ws://${storedIp}:8000`;
  }
  return 'ws://127.0.0.1:8000';
}
