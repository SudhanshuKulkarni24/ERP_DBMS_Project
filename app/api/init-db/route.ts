import { NextResponse } from 'next/server'
import { initDb } from "@/lib/init-db"

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log("Starting database initialization...")
  
  try {
    // Log environment variable presence (but not the actual value)
    console.log("NEON_DATABASE_URL present:", !!process.env.NEON_DATABASE_URL)
    console.log("NEXTAUTH_URL present:", !!process.env.NEXTAUTH_URL)
    console.log("NEXTAUTH_SECRET present:", !!process.env.NEXTAUTH_SECRET)
    console.log("GOOGLE_CLIENT_ID present:", !!process.env.GOOGLE_CLIENT_ID)
    console.log("GOOGLE_CLIENT_SECRET present:", !!process.env.GOOGLE_CLIENT_SECRET)

    await initDb()
    console.log("Database initialization completed successfully")
    return NextResponse.json({ 
      message: "Database initialized successfully",
      env_check: {
        has_db_url: !!process.env.NEON_DATABASE_URL,
        has_nextauth_url: !!process.env.NEXTAUTH_URL,
        has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
        has_google_id: !!process.env.GOOGLE_CLIENT_ID,
        has_google_secret: !!process.env.GOOGLE_CLIENT_SECRET
      }
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ 
      error: "Failed to initialize database", 
      details: error instanceof Error ? error.message : "Unknown error",
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

