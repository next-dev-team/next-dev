import { hello, helloAsync } from '@rnr/utils';

// Test the hello function
console.log('Testing hello function:');
console.log('Input: hello("World")');
console.log('Output:', hello('World'));

// Test the helloAsync function
console.log('\nTesting helloAsync function:');
helloAsync('React Native').then(result => {
  console.log('Input: await helloAsync("React Native")');
  console.log('Output:', result);
});