/**
 * Ishara Comprehensive Automated Test Suite Runner
 * Runs both unit tests and full-stack integration tests.
 */

import { runBusinessRulesTests } from './business-rules.test';

async function main() {
  console.log('\n======================================================');
  console.log('🧪 ISHARA AUTOMATED TEST SUITE');
  console.log('======================================================');

  try {
    // 1. Run Unit / Business Rules Tests
    runBusinessRulesTests();

    // 2. Run Integration Tests
    console.log('\nStarting API & Security Integration Tests...');
    const { execSync } = await import('child_process');
    execSync('npx tsx src/tests/integration.test.ts', { stdio: 'inherit' });

    console.log('\n✨ ALL TESTS EXECUTED AND PASSED SUCCESSFULLY! ✨\n');
  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
    process.exit(1);
  }
}

main();
