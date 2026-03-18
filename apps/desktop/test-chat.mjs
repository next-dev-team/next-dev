/**
 * Test: non-streaming mode with PocketPaw + verify stream toggle exists
 */
import { _electron as electron } from 'playwright';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAIN_ENTRY = resolve(__dirname, 'out/main/index.js');
const OUT = resolve(__dirname, 'test-output');
mkdirSync(OUT, { recursive: true });

async function main() {
  console.log('Launching Electron...');
  const app = await electron.launch({
    args: [MAIN_ENTRY],
    env: { ...process.env, NODE_ENV: 'test' },
  });

  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  console.log('Title:', await window.title());

  // Capture console
  window.on('console', msg => {
    const t = msg.text();
    if (t.includes('[AI]') || t.includes('Error') || t.includes('error')) {
      console.log(`  [CONSOLE] ${t.substring(0, 300)}`);
    }
  });

  // Configure AI
  await window.getByRole('button', { name: 'AI Chat' }).click();
  await window.getByRole('button', { name: 'AI Settings' }).click();
  await window.waitForTimeout(500);
  await window.getByText('AI Provider').first().click();
  await window.waitForTimeout(300);
  await window.getByText('OpenAI / Local LLM', { exact: false }).first().click();
  await window.waitForTimeout(300);

  // Fill settings
  const baseUrl = window.locator('#settings-base-url');
  await baseUrl.fill('http://localhost:8888/api/v1/plugins/llama-cpp/proxy/v1');
  
  const model = window.locator('#settings-model');
  await model.fill('Qwen3.5-9B-Q4_K_M.gguf');

  // Check stream toggle exists
  const streamToggle = window.locator('#toggle-stream');
  const streamChecked = await streamToggle.isChecked();
  console.log(`Stream toggle exists: true, checked: ${streamChecked}`);

  // Take screenshot of settings with stream toggle
  await window.screenshot({ path: resolve(OUT, '01-settings-with-stream.png') });

  // Close settings
  await window.keyboard.press('Escape');
  await window.waitForTimeout(500);

  // Verify provider badge
  const badge = await window.locator('.chat-provider-badge').textContent();
  console.log(`Provider: ${badge}`);

  // Send message
  await window.locator('.chat-input').fill('Add a Button with text "Hello World"');
  await window.locator('.chat-send-btn').first().click();
  console.log('Sent message. Waiting for response...');

  // Wait for response (up to 30s)
  for (let i = 0; i < 30; i++) {
    await window.waitForTimeout(1000);
    // Check if there's an op-card or the response has text
    const assistantMsgs = await window.locator('.chat-message[data-role="assistant"]').count();
    const opCards = await window.locator('.op-card').count();
    if (opCards > 0) {
      console.log(`✅ Got ${opCards} operation cards after ${i+1}s!`);
      break;
    }
    if (i > 0 && assistantMsgs > 0) {
      const lastContent = await window.locator('.chat-message[data-role="assistant"]').last().textContent();
      if (lastContent && !lastContent.includes('Thinking') && lastContent.length > 20) {
        console.log(`Got response after ${i+1}s (${lastContent.length} chars)`);
        break;
      }
    }
    if (i % 5 === 0) console.log(`  ${i}s: waiting...`);
  }

  await window.screenshot({ path: resolve(OUT, '02-response.png') });

  // Final checks
  const opCards = await window.locator('.op-card').count();
  const acceptBtns = await window.locator('.op-accept').count();
  console.log(`Operation cards: ${opCards}`);
  console.log(`Accept buttons: ${acceptBtns}`);

  // Log assistant message
  const msgs = await window.locator('.chat-message[data-role="assistant"]').all();
  for (const msg of msgs) {
    const text = await msg.textContent();
    console.log(`Assistant: ${text?.substring(0, 300)}`);
  }

  // If we can accept, do it
  if (acceptBtns > 0) {
    await window.locator('.op-accept').first().click();
    console.log('✅ Accepted operations!');
    await window.waitForTimeout(1000);
    await window.screenshot({ path: resolve(OUT, '03-accepted.png') });
  }

  await app.close();
  console.log('✅ Done!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
