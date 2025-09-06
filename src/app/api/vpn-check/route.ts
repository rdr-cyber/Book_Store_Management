import { NextRequest, NextResponse } from 'next/server';
import { VPNDetector } from '@/services/vpn-detector';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAgent } = body;

    // Get client IP
    const userIP = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown';

    // Perform VPN detection
    const vpnResult = await VPNDetector.detectVPN(userIP);
    
    // Perform additional security checks
    const securityChecks = await VPNDetector.performSecurityChecks(userAgent);

    // Determine if payment should be blocked
    const shouldBlock = VPNDetector.shouldBlockPayment(vpnResult) || securityChecks.suspicious;

    return NextResponse.json({
      vpnDetected: vpnResult.isVPN,
      risk: vpnResult.risk,
      country: vpnResult.country,
      isp: vpnResult.isp,
      suspicious: securityChecks.suspicious,
      reasons: securityChecks.reasons,
      shouldBlock,
      message: shouldBlock 
        ? 'Security concerns detected. Please disable VPN and try again.' 
        : 'Security check passed'
    }, { status: 200 });

  } catch (error: any) {
    console.error('VPN check error:', error);
    return NextResponse.json(
      { 
        error: 'Security check failed',
        shouldBlock: true // Err on the side of caution
      },
      { status: 500 }
    );
  }
}