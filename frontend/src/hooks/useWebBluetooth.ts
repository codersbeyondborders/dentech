import { useState, useCallback } from 'react';

// Standard UUIDs for Bluetooth
const HR_SERVICE = 0x180D;
const HR_MEASUREMENT = 0x2A37;
const HEALTH_THERM_SERVICE = 0x1809;
const TEMP_MEASUREMENT = 0x2A1C;

export function useWebBluetooth() {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [skinTemp, setSkinTemp] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Request device with Heart Rate and Health Thermometer services
      const btDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: [HR_SERVICE] }],
        optionalServices: [HEALTH_THERM_SERVICE]
      });

      setDevice(btDevice);

      const server = await btDevice.gatt?.connect();
      if (!server) throw new Error("Could not connect to GATT Server");

      // Heart Rate Service
      const hrService = await server.getPrimaryService(HR_SERVICE);
      const hrChar = await hrService.getCharacteristic(HR_MEASUREMENT);
      await hrChar.startNotifications();
      hrChar.addEventListener('characteristicvaluechanged', (e: any) => {
        const value = e.target.value as DataView;
        const flags = value.getUint8(0);
        const format = flags & 0x01;
        let hr;
        if (format === 0) {
          hr = value.getUint8(1);
        } else {
          hr = value.getUint16(1, true);
        }
        setHeartRate(hr);
      });

      // Health Thermometer Service
      try {
        const tempService = await server.getPrimaryService(HEALTH_THERM_SERVICE);
        const tempChar = await tempService.getCharacteristic(TEMP_MEASUREMENT);
        await tempChar.startNotifications();
        tempChar.addEventListener('characteristicvaluechanged', (e: any) => {
            const value = e.target.value as DataView;
            // Decode typical IEEE-11073 32-bit FLOAT for temperature
            const tempFlags = value.getUint8(0); // If bit 0 is 0 we have C, if 1 we have F
            const inFahrenheit = (tempFlags & 0x01) === 1;
            
            // Simplified decoding of Mantissa + Exponent (In prod, use a proper IEEE-11073 decoder)
            const mantissa = value.getUint32(1, true) & 0x00FFFFFF; 
            const exponent = value.getInt8(4);
            const val = mantissa * Math.pow(10, exponent);
            
            setSkinTemp(inFahrenheit ? val : Number(((val * 9/5) + 32).toFixed(1))); 
        });
      } catch (err) {
        console.warn("Health Thermometer service missing or failed:", err);
      }

      btDevice.addEventListener('gattserverdisconnected', () => {
        setDevice(null);
        setHeartRate(null);
        setSkinTemp(null);
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to Bluetooth device");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (device && device.gatt?.connected) {
      device.gatt.disconnect();
    }
    setDevice(null);
    setHeartRate(null);
    setSkinTemp(null);
  }, [device]);

  return { device, heartRate, skinTemp, isConnecting, error, connect, disconnect };
}
