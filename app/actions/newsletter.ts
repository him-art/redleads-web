'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import WelcomeEmail from '@/lib/email-templates/WelcomeEmail';

// Schema for validation
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  websiteUrl: z.string().url('Please enter a valid URL (e.g., https://example.com)'),
});

type FormState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    websiteUrl?: string[];
  };
};

export async function subscribeToNewsletter(prevState: FormState, formData: FormData): Promise<FormState> {
  // 1. Validate Input
  const validatedFields = formSchema.safeParse({
    email: formData.get('email'),
    websiteUrl: formData.get('websiteUrl'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, websiteUrl } = validatedFields.data;

  // 2. Initialize Clients
  const supabase = await createClient(); // Ensure this matches your project's supabase client creator
  
  // NOTE: Ensure RESEND_API_KEY is in your .env.local
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('RESEND_API_KEY is missing');
    return { success: false, message: 'System configuration error. Please try again later.' };
  }
  const resend = new Resend(resendApiKey);

  try {
    // 3. Save to Supabase
    // Check for existing text to avoid unique constraint race conditions if possible, 
    // or just let the DB handle it. We'll try to insert.
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, website_url: websiteUrl, status: 'active' });

    if (dbError) {
      if (dbError.code === '23505') { // Unique violation
        return { success: true, message: 'You are already subscribed!' };
      }
      console.error('Database error:', dbError);
      return { success: false, message: 'Failed to save subscription. Please try again.' };
    }

    // 4. Send Welcome Email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'RedLeads <onboarding@resend.dev>', // Update this to your verified domain later
      to: [email],
      subject: 'Welcome to RedLeads! Your weekly Reddit leads are coming.',
      react: WelcomeEmail({ websiteUrl }),
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      // We still consider it a success for the user since DB save worked, 
      // but might want to alert admin.
    }

    return { 
      success: true, 
      message: 'Success! specific check your inbox for the welcome email.' 
    };

  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
