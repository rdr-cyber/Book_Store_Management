
import { VPNDetectionResult } from '../lib/types';

/**
 * Enhanced VPN detection service for preventing fraudulent transactions
 * Uses multiple detection methods including IP analysis, geolocation, and behavioral patterns
 */

// VPN detection using IP geolocation and known VPN provider databases
export class VPNDetector {
  private static readonly VPN_DETECTION_API = 'https://proxycheck.io/v2/';
  private static readonly API_KEY = process.env.VPN_DETECTION_API_KEY;

  static async detectVPN(ip?: string): Promise<VPNDetectionResult> {
    try {
      // Get client IP if not provided
      const clientIP = ip || await this.getClientIP();
      
      if (!clientIP) {
        return {
          isVPN: false,
          risk: 'low'
        };
      }

      // Check against VPN detection service
      const response = await fetch(
        `${this.VPN_DETECTION_API}${clientIP}?key=${this.API_KEY}&vpn=1&asn=1&risk=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // Fallback to basic checks if API fails
        return this.basicVPNCheck(clientIP);
      }

      const data = await response.json();
      const ipData = data[clientIP];

      if (!ipData) {
        return {
          isVPN: false,
          risk: 'low'
        };
      }

      const isVPN = ipData.proxy === 'yes' || ipData.vpn === 'yes';
      const risk = this.calculateRisk(ipData);

      return {
        isVPN,
        country: ipData.country,
        isp: ipData.isp,
        risk
      };
    } catch (error) {
      // Handle VPN detection errors gracefully
      // Return safe default on error
      return {
        isVPN: true, // Err on the side of caution
        risk: 'high'
      };
    }
  }

  private static async getClientIP(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      // Handle IP retrieval error gracefully
      return null;
    }
  }

  private static basicVPNCheck(ip: string): VPNDetectionResult {
    // Basic checks for common VPN IP ranges
    const vpnProviders = [
      // Common VPN provider IP ranges (simplified)
      /^10\./,          // Private network
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Private network
      /^192\.168\./,    // Private network
      /^127\./,        // Localhost
    ];

    const isPrivateIP = vpnProviders.some(pattern => pattern.test(ip));
    
    return {
      isVPN: isPrivateIP,
      risk: isPrivateIP ? 'medium' : 'low'
    };
  }

  private static calculateRisk(ipData: any): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    // Check various risk factors
    if (ipData.proxy === 'yes') riskScore += 3;
    if (ipData.vpn === 'yes') riskScore += 3;
    if (ipData.tor === 'yes') riskScore += 4;
    if (ipData.risk && ipData.risk > 50) riskScore += 2;
    if (ipData.type === 'VPN') riskScore += 2;

    if (riskScore >= 5) return 'high';
    if (riskScore >= 3) return 'medium';
    return 'low';
  }

  // Check if payment should be blocked based on VPN detection
  static shouldBlockPayment(vpnResult: VPNDetectionResult): boolean {
    return vpnResult.isVPN && vpnResult.risk === 'high';
  }

  // Additional security checks
  static async performSecurityChecks(userAgent?: string, fingerprint?: string): Promise<{
    suspicious: boolean;
    reasons: string[];
  }> {
    const reasons: string[] = [];
    let suspicious = false;

    // Check user agent
    if (userAgent) {
      if (this.isSuspiciousUserAgent(userAgent)) {
        suspicious = true;
        reasons.push('Suspicious user agent detected');
      }
    }

    // Additional checks can be added here
    // - Device fingerprinting
    // - Behavioral analysis
    // - Geographic anomalies

    return { suspicious, reasons };
  }

  private static isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /phantom/i,
      /selenium/i,
      /headless/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }
}

// Legacy function for backward compatibility
export async function isVpnOrProxy(): Promise<boolean> {
  const result = await VPNDetector.detectVPN();
  return VPNDetector.shouldBlockPayment(result);
}
