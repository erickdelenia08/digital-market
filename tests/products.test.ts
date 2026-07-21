import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProduct, updateProduct, getCategories, createCategory } from '@/app/actions/product-actions' // Sesuaikan path ini
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// 1. Mock Next.js cache
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

// 2. Mock Prisma (Asumsi setup di ./mocks/db sudah benar)
vi.mock('@/lib/db', async () => {
    const { mockPrisma } = await import('./mocks/db')
    return { prisma: mockPrisma }
})

describe('Product & Category Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createProduct', () => {
        it('should create a product successfully', async () => {

            vi.mocked(prisma.product.create).mockResolvedValue({ id: '1', name: 'Laptop' } as any)

            const result = await createProduct({
                name: 'Laptop',
                slug: 'laptop',
                description: 'Gaming laptop',
                price: 15000000,
                categoryId: 'cat-1',
                coverImage: 'image.jpg'
            })

            expect(prisma.product.create).toHaveBeenCalled()
            expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
            expect(result.success).toBe(true)
        })

        it('should return error if input is invalid', async () => {
            // Input tidak valid (misal: nama kosong, jika schema mewajibkannya)
            const result = await createProduct({ name: '', slug: '', description: '', price: 0, categoryId: '', coverImage: '' } as any)

            expect(result.success).toBe(false)
            expect(result.error).toBeDefined()
        })
    })

    describe('updateProduct', () => {
        it('should update a product successfully', async () => {
            vi.mocked(prisma.product.update).mockResolvedValue({ id: '1' } as any)

            const result = await updateProduct('1', {
                name: 'Laptop Baru',
                slug: 'laptop-baru',
                description: 'Desc',
                price: 16000000,
                categoryId: 'cat-1',
                coverImage: 'new-image.jpg'
            })

            expect(prisma.product.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: '1' } }))
            expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products')
            expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products/1/edit')
            expect(result.success).toBe(true)
        })
    })

    describe('getCategories', () => {
        it('should fetch all categories', async () => {
            vi.mocked(prisma.category.findMany).mockResolvedValue([{ id: '1', name: 'Electronics' }] as any)

            const result = await getCategories()

            expect(prisma.category.findMany).toHaveBeenCalled()
            expect(result.data).toHaveLength(1)
            expect(result.success).toBe(true)
        })
    })

    describe('createCategory', () => {
        it('should create a category successfully', async () => {
            vi.mocked(prisma.category.create).mockResolvedValue({ id: '1', name: 'Electronics' } as any)

            const result = await createCategory({ name: 'Electronics', slug: 'electronics' })

            expect(prisma.category.create).toHaveBeenCalled()
            expect(result.success).toBe(true)
        })
    })
})