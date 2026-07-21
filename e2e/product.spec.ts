import { test, expect } from '@playwright/test'

test.describe('Manajemen Produk E2E', () => {
    test('harus login, membuat produk baru, dan memastikan produk muncul di list', async ({ page }) => {
        // 1. Login
        await page.goto('http://localhost:3000/login')
        await page.getByLabel('Email').fill('erick@gmail.com')
        await page.getByLabel('Password').fill('password')
        await page.getByRole('button', { name: 'Sign In' }).click()

        // Pastikan redirect berhasil
        await expect(page).toHaveURL(/.*\/dashboard/)

        // 2. Navigasi ke Create Product
        await page.goto('http://localhost:3000/dashboard/products/create')

        // 3. Data Unik
        const uniqueId = Date.now()
        const productName = `Produk Test ${uniqueId}`

        // 4. Isi Form
        await page.getByLabel('Name').fill(productName)
        await page.getByLabel('Slug').fill(`produk-test-${uniqueId}`)
        await page.getByLabel('Description').fill('Deskripsi produk test')
        await page.getByLabel('Price').fill('150000')

        // 5. Interaksi Dropdown Category
        const categoryTrigger = page.getByRole('combobox', { name: 'Category' });
        await categoryTrigger.click();
        await page.getByRole('option', { name: 'After Effect', exact: true }).click();

        // Pastikan dropdown tertutup
        await page.keyboard.press('Escape');

        await page.click('button[type="submit"]')
        await expect(page).toHaveURL("http://localhost:3000/dashboard/products/create");
    })
})