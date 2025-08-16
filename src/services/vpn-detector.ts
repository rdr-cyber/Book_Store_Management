
'use client';

/**
 * @fileOverview A client-side service to detect potential VPN or proxy usage.
 *
 * This is a simplified check and may not be 100% accurate, but serves as a deterrent.
 * It works by checking for a large discrepancy between the user's browser timezone
 * and location data which can be an indicator of location masking.
 *
 * NOTE: This check has been found to be unreliable and can produce "false positives",
 * blocking legitimate users on their personal networks. It has been disabled by default
 * to prevent interrupting the checkout flow for valid customers.
 * A robust solution would likely require a server-side check with a dedicated third-party
 * IP intelligence service.
 */

export async function isVpnOrProxy(): Promise<boolean> {
    // This check has been disabled to prevent blocking legitimate users.
    return false;
}
