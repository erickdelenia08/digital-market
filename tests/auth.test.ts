import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from '@/app/actions/auth/login'
import { registerUser } from '@/app/actions/auth/register'
import { prisma } from '@/lib/db'
import { signIn } from '@/lib/auth'
import { User } from '@prisma/client'

vi.mock('@/lib/mail', () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/db', async () => {
  const { mockPrisma } = await import('./mocks/db')
  return { prisma: mockPrisma }
})
vi.mock('@/lib/auth')
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn().mockResolvedValue(true),
  },
  hash: vi.fn().mockResolvedValue('hashed_password'),
  compare: vi.fn().mockResolvedValue(true),
}))

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      vi.mocked(signIn).mockResolvedValue(undefined)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password'
      } as User)

      await login({
        email: 'test@example.com',
        password: 'password',
      })

      expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
        email: 'test@example.com',
        password: 'password',
      }))
    })
  })

  describe('register', () => {
    it('should create a new user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.user.create).mockResolvedValue({ id: '1' } as User)

      const result = await registerUser({
        name: 'Test User',
        email: 'new@example.com',
        password: 'password123',
      })

      expect(prisma.user.create).toHaveBeenCalled()
      expect(result.success).toBeDefined()
    })

    it('should fail if email already exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: '1' } as User)

      const result = await registerUser({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      })

      expect(result.error).toBe('Email already in use')
    })
  })
})
