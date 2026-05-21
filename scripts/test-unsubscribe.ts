import { getUnsubscribeToken, verifyUnsubscribeToken, getUnsubscribeUrl, getOneClickUrl } from '../lib/unsubscribe';

async function test() {
  console.log("=== Running Unsubscribe Verification Test ===");
  const testEmail = "test@Example.com "; // mixed case and trailing space
  
  const token = getUnsubscribeToken(testEmail);
  console.log(`Generated Token: ${token}`);
  
  // Verification with exact match
  const verifiedExact = verifyUnsubscribeToken(testEmail, token);
  console.log(`Verified exact match: ${verifiedExact}`);
  
  // Verification with normalized match (simulating case variations)
  const verifiedNormalized = verifyUnsubscribeToken("TEST@example.com", token);
  console.log(`Verified normalized match: ${verifiedNormalized}`);
  
  // Verification with wrong token
  const verifiedWrong = verifyUnsubscribeToken(testEmail, "wrong-token");
  console.log(`Verified wrong token (should be false): ${verifiedWrong}`);
  
  // URL Generation
  const unsubUrl = getUnsubscribeUrl(testEmail);
  const oneClickUrl = getOneClickUrl(testEmail);
  console.log(`Unsubscribe URL: ${unsubUrl}`);
  console.log(`One-Click URL: ${oneClickUrl}`);
  
  const isOk = verifiedExact && verifiedNormalized && !verifiedWrong && 
               unsubUrl.includes("email=test%40example.com") && 
               oneClickUrl.includes("api/unsubscribe");

  if (isOk) {
    console.log("✅ All verification tests passed successfully!");
  } else {
    console.error("❌ Verification tests failed!");
    process.exit(1);
  }
}

test().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
