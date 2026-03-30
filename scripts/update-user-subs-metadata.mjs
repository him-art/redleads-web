import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const medicalSubreddits = [
  "medicine", "AgingParents", "eldercare", "ChronicIllness", 
  "ADHD", "bipolar", "AskDocs", "medical_advice", 
  "Biohackers", "Nootropics", "CaregiverSupport", "dementia", 
  "Alzheimers", "ChronicPain", "pharmacy", "Supplements"
];

async function updateUser() {
    console.log('--- Updating chrispterdanny@gmail.com Profile (user_metadata) ---');
    const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('user_metadata')
        .eq('email', 'chrispterdanny@gmail.com')
        .single();
    
    if (pError) {
        console.error('Error fetching profile:', pError);
        return;
    }

    const currentMetadata = profile.user_metadata || {};
    const currentSubs = currentMetadata.subreddits || [];
    const newSubs = Array.from(new Set([...currentSubs, ...medicalSubreddits]));

    const { error: uError } = await supabase
        .from('profiles')
        .update({ 
            user_metadata: {
                ...currentMetadata,
                subreddits: newSubs
            }
        })
        .eq('email', 'chrispterdanny@gmail.com');
    
    if (uError) {
        console.error('Error updating user metadata:', uError);
    } else {
        console.log('✅ Successfully moved 16 medical subreddits to user_metadata for Chris.');
    }
}

updateUser();
