
/**
 * Shared AI Manager for Key Rotation and Rate-Limit Handling
 * Supports both Next.js (Edge/Server) and Node.js (Worker)
 */
export class AIManager {
    private keys: string[] = [];
    private currentIndex = 0;
    private disabledUntil: Record<string, number> = {};

    constructor(providedKeys?: string[]) {
        if (providedKeys && providedKeys.length > 0) {
            this.keys = providedKeys;
        } else {
            // Auto-discover from process.env
            const potentialKeys = [
                process.env.AI_API_KEY,
                process.env.AI_API_KEY_2
            ];
            this.keys = potentialKeys.filter(k => !!k) as string[];
        }
    }

    private getNextKey(): string | null {
        const now = Date.now();
        // Priority Mode: Always try the first available key in the list
        for (const key of this.keys) {
            if (!this.disabledUntil[key] || now > this.disabledUntil[key]) {
                return key;
            }
        }
        return null;
    }

    /**
     * Returns the total number of configured keys
     */
    public getKeyCount(): number {
        return this.keys.length;
    }

    async call(payload: any): Promise<any> {
        let attempts = 0;
        const maxAttempts = Math.max(1, this.keys.length);

        if (this.keys.length === 0) {
            throw new Error('No AI API keys available in environment.');
        }

        while (attempts < maxAttempts) {
            const key = this.getNextKey();
            if (!key) {
                // All keys are currently disabled, wait briefly or fail
                throw new Error('All AI keys are currently rate-limited. Please try again in 60s.');
            }

            try {
                // Keeping AI endpoint as the backend provider for now
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.status === 429) {
                    this.disabledUntil[key] = Date.now() + 60000;
                    attempts++;
                    continue;
                }

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error?.message || 'AI API error');
                }

                return await response.json();
            } catch (err: any) {
                if (err.message.includes('rate-limited')) throw err;
                
                attempts++;
                this.disabledUntil[key] = Date.now() + 10000;
                if (attempts >= maxAttempts) throw err;
            }
        }
        throw new Error('AI calls failed across all available keys.');
    }
}

// Specialized Singletons for Strategic Priority
// Onboarding/Config uses Key 1 as primary
export const onboardingAi = new AIManager([
    process.env.AI_API_KEY, 
    process.env.AI_API_KEY_2
].filter(Boolean) as string[]);

// Replies uses Key 2 as primary to isolate traffic
export const repliesAi = new AIManager([
    process.env.AI_API_KEY_2, 
    process.env.AI_API_KEY
].filter(Boolean) as string[]);

// Legacy singleton for backwards compatibility
export const ai = onboardingAi;
