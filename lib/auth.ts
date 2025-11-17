import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export interface Session {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  expiresAt: number
}

export function createSession(user: any): Session {
  // Session expires in 24 hours
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000
  return {
    user: {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    expiresAt,
  }
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null

  const sessionData = localStorage.getItem("session")
  if (!sessionData) return null

  try {
    const session: Session = JSON.parse(sessionData)

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem("session")
      return null
    }

    return session
  } catch {
    localStorage.removeItem("session")
    return null
  }
}

export function setSession(session: Session): void {
  localStorage.setItem("session", JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem("session")
  // Also clear old user data if it exists
  localStorage.removeItem("user")
}

export function validateSession(requiredRole?: string): boolean {
  const session = getSession()

  if (!session) return false

  if (requiredRole && session.user.role !== requiredRole) {
    return false
  }

  return true
}
