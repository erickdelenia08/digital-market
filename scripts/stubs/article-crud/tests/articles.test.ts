import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createArticle, updateArticle, deleteArticle, getArticles } from '@/app/actions/article'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { Article } from '@prisma/client'

import { Session } from 'next-auth'

vi.mock('@/lib/db', async () => {
  const { mockPrisma } = await import('./mocks/db')
  return { prisma: mockPrisma }
})
vi.mock('@/lib/auth')
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Article Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue({ 
      user: { id: 'admin-1', role: 'ADMIN', email: 'admin@test.com', name: 'Admin' },
      expires: '' 
    } as Session)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'admin-1',
      name: 'Admin',
      email: 'admin@test.com',
    } as any)
  })

  it('should get all articles', async () => {
    vi.mocked(prisma.article.findMany).mockResolvedValue([{ id: '1', title: 'Test' } as Article])
    
    const result = await getArticles()
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Test')
  })

  it('should create an article', async () => {
    vi.mocked(prisma.article.create).mockResolvedValue({ id: '1' } as Article)
    
    const result = await createArticle({
      title: 'New Article',
      content: 'Content',
      slug: 'new-article',
      published: true
    })
    
    expect(prisma.article.create).toHaveBeenCalled()
    expect(result.success).toBeDefined()
  })

  it('should update an article', async () => {
    vi.mocked(prisma.article.update).mockResolvedValue({ id: '1' } as Article)
    
    const result = await updateArticle('1', {
      title: 'Updated Title',
      content: 'Updated Content',
      slug: 'updated-title',
      published: true
    })
    
    expect(prisma.article.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: expect.objectContaining({ title: 'Updated Title' })
    })
    expect(result.success).toBeDefined()
  })

  it('should delete an article', async () => {
    vi.mocked(prisma.article.delete).mockResolvedValue({ id: '1' } as Article)
    
    const result = await deleteArticle('1')
    
    expect(prisma.article.delete).toHaveBeenCalledWith({
      where: { id: '1' }
    })
    expect(result.success).toBeDefined()
  })
})
