
/**
 * Shared Groq Manager for Key Rotation and Rate-Limit Handling
 * Supports both Next.js (Edge/Server) and Node.js (Worker)
 */
export class GroqManager {
    private keys: string[] = [];
    private currentIndex = 0;
    private disabledUntil: Record<string, number> = {};

    constructor(providedKeys?: string[]) {
        if (providedKeys && providedKeys.length > 0) {
            this.keys = providedKeys;
        } else {
            // Auto-discover from process.env
            const potentialKeys = [
                process.env.GROQ_API_KEY,
                process.env.GROQ_API_KEY_2,
                process.env.GROQ_API_KEY_3,
                process.env.GROQ_API_KEY_4,
                process.env.GROQ_API_KEY_5,
                process.env.GROQ_API_KEY_6
            ];
            this.keys = potentialKeys.filter(k => !!k) as string[];
        }
    }

    private getNextKey(): string | null {
        const now = Date.now();
        for (let i = 0; i < this.keys.length; i++) {
            const index = (this.currentIndex + i) % this.keys.length;
            const key = this.keys[index];
            
            if (!this.disabledUntil[key] || now > this.disabledUntil[key]) {
                this.currentIndex = (index + 1) % this.keys.length;
                return key;
            }
        }
        return null;
    }

    async call(payload: any): Promise<any> {
        let attempts = 0;
        const maxAttempts = Math.max(1, this.keys.length);

        if (this.keys.length === 0) {
            throw new Error('No Groq API keys available in environment.');
        }

        while (attempts < maxAttempts) {
            const key = this.getNextKey();
            if (!key) {
                // All keys are currently disabled, wait briefly or fail
                throw new Error('All Groq keys are currently rate-limited. Please try again in 60s.');
            }

            try {
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
                    throw new Error(error.error?.message || 'Groq API error');
                }

                return await response.json();
            } catch (err: any) {
                if (err.message.includes('rate-limited')) throw err;
                
                attempts++;
                this.disabledUntil[key] = Date.now() + 10000;
                if (attempts >= maxAttempts) throw err;
            }
        }
        throw new Error('Groq calls failed across all available keys.');
    }
}

// Singleton instance for easy import
export const groq = new GroqManager();
