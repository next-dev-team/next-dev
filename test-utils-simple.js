// Simple test to verify utils work
import { hello, helloAsync } from '@rnr/utils';

console.log('=== Utils Test ===');
console.log('Testing hello function:');
console.log('Input: "World"');
console.log('Output:', hello('World'));

console.log('\nTesting helloAsync function:');
helloAsync('React Native').then(result => {
  console.log('Input: "React Native"');
  console.log('Output:', result);
  console.log('\n=== Test Complete ===');
});