/**
 * Undo / Redo & Delete — verifies history and destructive operations
 * behave correctly in the design editor.
 */
import { test, expect } from './fixtures';

test.describe('Undo, Redo & Delete', () => {
  test('undo reverses adding an element', async ({ window }) => {
    const canvasBefore = await window.locator('.canvas-element').count();

    // Add an element
    await window.locator('.palette-item').first().click();
    const canvasAfterAdd = await window.locator('.canvas-element').count();
    expect(canvasAfterAdd).toBeGreaterThan(canvasBefore);

    // Undo via toolbar button
    const undoBtn = window.locator('.toolbar-btn[title*="Undo"]');
    await expect(undoBtn).toBeEnabled();
    await undoBtn.click();

    // Element count should revert
    const canvasAfterUndo = await window.locator('.canvas-element').count();
    expect(canvasAfterUndo).toBe(canvasBefore);
  });

  test('redo restores an undone element', async ({ window }) => {
    // Add an element
    await window.locator('.palette-item').first().click();
    const canvasAfterAdd = await window.locator('.canvas-element').count();

    // Undo
    await window.locator('.toolbar-btn[title*="Undo"]').click();

    // Redo via toolbar button
    const redoBtn = window.locator('.toolbar-btn[title*="Redo"]');
    await expect(redoBtn).toBeEnabled();
    await redoBtn.click();

    // Element should be back
    const canvasAfterRedo = await window.locator('.canvas-element').count();
    expect(canvasAfterRedo).toBe(canvasAfterAdd);
  });

  test('Ctrl+Z undoes and Ctrl+Shift+Z redoes', async ({ window }) => {
    const canvasBefore = await window.locator('.canvas-element').count();

    // Add an element
    await window.locator('.palette-item').first().click();
    expect(await window.locator('.canvas-element').count()).toBeGreaterThan(canvasBefore);

    // Ctrl+Z to undo
    await window.keyboard.press('Control+z');
    expect(await window.locator('.canvas-element').count()).toBe(canvasBefore);

    // Ctrl+Shift+Z to redo
    await window.keyboard.press('Control+Shift+z');
    expect(await window.locator('.canvas-element').count()).toBeGreaterThan(canvasBefore);
  });

  test('Delete key removes selected element', async ({ window }) => {
    // Add an element
    await window.locator('.palette-item').first().click();
    const canvasAfterAdd = await window.locator('.canvas-element').count();

    // Select it
    await window.locator('.canvas-element').last().click();

    // Press Delete
    await window.keyboard.press('Delete');

    // Element count should decrease
    const canvasAfterDelete = await window.locator('.canvas-element').count();
    expect(canvasAfterDelete).toBeLessThan(canvasAfterAdd);
  });

  test('toolbar delete button removes selected element', async ({ window }) => {
    // Add an element
    await window.locator('.palette-item').first().click();
    const canvasAfterAdd = await window.locator('.canvas-element').count();

    // Select it
    await window.locator('.canvas-element').last().click();

    // Click toolbar Delete button
    const deleteBtn = window.locator('.toolbar-btn[title="Delete"]');
    await expect(deleteBtn).toBeEnabled();
    await deleteBtn.click();

    const canvasAfterDelete = await window.locator('.canvas-element').count();
    expect(canvasAfterDelete).toBeLessThan(canvasAfterAdd);
  });
});
