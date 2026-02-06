import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import PremiumOnboardingEmail from '@/lib/email-templates/PremiumOnboardingEmail';
import * as React from 'react';

export async function GET() {
    try {
        // Joined Today: Feb 6, 2026.
        // Trial Expiry: Feb 9, 2026.
        const trialExpiryDate = "February 9th";
        
        const result = await sendEmail({
            to: 'hjayaswar@gmail.com',
            subject: 'Step 1 to your first 100 leads.',
            react: React.createElement(PremiumOnboardingEmail, {
                fullName: "H Jayaswar",
                websiteUrl: "redleads.app",
                trialExpiryDate: trialExpiryDate,
                daysLeft: 3,
                step: "welcome"
            })
        });

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error });
        }

        return NextResponse.json({ success: true, data: result.data });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
