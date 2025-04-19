import { NextRequest } from "next/server"
import { executeQuery } from "@/lib/db"

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Try a simple query to check database connectivity
    const result = await executeQuery('SELECT NOW()')
    
    return Response.json({ 
      status: "healthy",
      database: "connected",
      timestamp: result.rows[0].now,
      env_check: {
        has_db_url: !!process.env.NEON_DATABASE_URL,
        has_nextauth_url: !!process.env.NEXTAUTH_URL,
        has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
        has_google_id: !!process.env.GOOGLE_CLIENT_ID,
        has_google_secret: !!process.env.GOOGLE_CLIENT_SECRET
      }
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return Response.json({ 
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      env_check: {
        has_db_url: !!process.env.NEON_DATABASE_URL,
        has_nextauth_url: !!process.env.NEXTAUTH_URL,
        has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
        has_google_id: !!process.env.GOOGLE_CLIENT_ID,
        has_google_secret: !!process.env.GOOGLE_CLIENT_SECRET
      }
    }, { status: 500 })
  }
} 