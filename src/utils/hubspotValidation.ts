import CryptoJS from 'crypto-js';

export interface ValidationOptions {
  method: string;
  uri: string;
  body?: any;
  timestamp: string;
  signature: string;
  clientSecret: string;
}

export class HubSpotValidator {
  private static readonly MAX_TIMESTAMP_AGE = 300000; // 5 minutes in milliseconds

  static validateTimestamp(timestamp: string): boolean {
    const currentTime = Date.now();
    const requestTime = parseInt(timestamp, 10);
    return currentTime - requestTime <= this.MAX_TIMESTAMP_AGE;
  }

  static validateSignatureV3({
    method,
    uri,
    body,
    timestamp,
    signature,
    clientSecret
  }: ValidationOptions): boolean {
    try {
      // Decode URI components that need to be decoded
      const decodedUri = this.decodeUri(uri);

      // Concatenate request components
      const sourceString = `${method}${decodedUri}${
        body ? JSON.stringify(body) : ''
      }${timestamp}`;

      // Create HMAC SHA-256 hash
      const hmac = CryptoJS.HmacSHA256(sourceString, clientSecret);
      const computedSignature = CryptoJS.enc.Base64.stringify(hmac);

      // Use timing-safe comparison
      return this.timingSafeEqual(computedSignature, signature);
    } catch (error) {
      console.error('Error validating signature:', error);
      return false;
    }
  }

  private static decodeUri(uri: string): string {
    const decodingMap: Record<string, string> = {
      '%3A': ':',
      '%2F': '/',
      '%3F': '?',
      '%40': '@',
      '%21': '!',
      '%24': '$',
      '%27': "'",
      '%28': '(',
      '%29': ')',
      '%2A': '*',
      '%2C': ',',
      '%3B': ';'
    };

    return Object.entries(decodingMap).reduce(
      (decoded, [encoded, char]) => decoded.replace(new RegExp(encoded, 'g'), char),
      uri
    );
  }

  private static timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
}