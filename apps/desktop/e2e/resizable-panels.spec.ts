import { test, expect } from './fixtures';

test('left and right panels are resizable via drag handles', async ({ window }) => {
  await window.waitForSelector('.editor-layout', { timeout: 15000 });

  // Verify resize handles exist
  const leftHandle = window.locator('.resize-handle--left');
  const rightHandle = window.locator('.resize-handle--right');
  await expect(leftHandle).toBeVisible();
  await expect(rightHandle).toBeVisible();

  // Get initial left panel width
  const leftPanel = window.locator('.editor-left-panel');
  const initialLeftWidth = await leftPanel.evaluate((el) => el.getBoundingClientRect().width);

  // Drag left handle to the right to widen the left panel
  const leftBox = await leftHandle.boundingBox();
  if (!leftBox) throw new Error('Left handle not found');
  await window.mouse.move(leftBox.x + leftBox.width / 2, leftBox.y + leftBox.height / 2);
  await window.mouse.down();
  await window.mouse.move(leftBox.x + 100, leftBox.y + leftBox.height / 2, { steps: 5 });
  await window.mouse.up();

  // Verify left panel got wider
  const newLeftWidth = await leftPanel.evaluate((el) => el.getBoundingClientRect().width);
  expect(newLeftWidth).toBeGreaterThan(initialLeftWidth);

  // Get initial right panel width
  const rightPanel = window.locator('.editor-right-panel');
  const initialRightWidth = await rightPanel.evaluate((el) => el.getBoundingClientRect().width);

  // Drag right handle to the left to widen the right panel
  const rightBox = await rightHandle.boundingBox();
  if (!rightBox) throw new Error('Right handle not found');
  await window.mouse.move(rightBox.x + rightBox.width / 2, rightBox.y + rightBox.height / 2);
  await window.mouse.down();
  await window.mouse.move(rightBox.x - 100, rightBox.y + rightBox.height / 2, { steps: 5 });
  await window.mouse.up();

  // Verify right panel got wider
  const newRightWidth = await rightPanel.evaluate((el) => el.getBoundingClientRect().width);
  expect(newRightWidth).toBeGreaterThan(initialRightWidth);

  // Take screenshot of resized layout
  await window.screenshot({ path: 'test-results/resizable-panels.png', fullPage: false });
});
