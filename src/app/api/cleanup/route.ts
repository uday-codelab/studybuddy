import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  // Delete guest chunks older than 24 hours
  const deleted = await sql`
    DELETE FROM document_chunks
    WHERE user_id = 'guest'
    AND created_at < NOW() - INTERVAL '24 hours'
    RETURNING id
  `;
  
  return NextResponse.json({ 
    deleted: deleted.length 
  });
}