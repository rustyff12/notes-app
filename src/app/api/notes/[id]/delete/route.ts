import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const noteId = Number(id);

  if (isNaN(noteId)) {
    return new Response("Invalid ID", { status: 400 });
  }

  try {
    await prisma.note.delete({
      where: { id: noteId },
    });

    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    console.error("Delete error:", error);
    return new Response("Server error", { status: 500 });
  }
}
