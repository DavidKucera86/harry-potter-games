import { test } from '@playwright/test';

export async function given(title: string, fn: () => Promise<void>) {
  await test.step(`Given: ${title}`, fn);
}

export async function when(title: string, fn: () => Promise<void>) {
  await test.step(`When: ${title}`, fn);
}

export async function then(title: string, fn: () => Promise<void>) {
  await test.step(`Then: ${title}`, fn);
}
