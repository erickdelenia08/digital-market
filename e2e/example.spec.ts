import { test, expect } from '@playwright/test'

test.describe('Manajemen Artikel E2E', () => {
  test('harus login admin, membuat artikel baru, dan menghapusnya kembali untuk cleanup', async ({ page }) => {
    // 1. Kunjungi halaman login (gunakan URL absolut karena baseURL default di-comment)
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000) // Jeda agar hidrasi React selesai sempurna

    // 2. Isi form login admin menggunakan locator yang direkomendasikan Playwright
    await page.getByLabel('Email').fill('erick@gmail.com')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Sign In' }).click()

    // await page.goto('http://localhost:3000/cart')

    // 3. Pastikan user berhasil dialihkan ke halaman dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard')

    // // 4. Buka halaman form pembuatan artikel baru
    await page.goto('http://localhost:3000/dashboard/users/create')
    // await page.goto('http://localhost:3000/dashboard/articles/create')
    await page.waitForTimeout(1000) // Tunggu Fast Refresh / HMR selesai re-render

    // // Buat data unik menggunakan timestamp untuk mencegah error duplikasi slug di database
    // const uniqueId = Date.now()
    // const articleTitle = `Artikel E2E Baru ${uniqueId}`
    // const articleSlug = `artikel-e2e-baru-${uniqueId}`

    const fullName = "testuser" + Date.now();
    const email = fullName + "@example.com";
    const password = "password";

    // // 5. Isi data artikel baru
    await page.fill('input[name="name"]', fullName)
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')
    // Menggunakan regex untuk mencocokkan pola URL
    await expect(page).toHaveURL(/\/dashboard\/users\/.*\/edit$/);
  })
})