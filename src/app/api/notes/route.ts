import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notes);
}

// export async function GET() {
//   return Response.json([{ id: 1, title: "Test", content: "This is a test." }]);
// }

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Missing title or content" },
      { status: 400 }
    );
  }

  const note = await prisma.note.create({
    data: {
      title,
      content,
    },
  });

  return NextResponse.json(note);
}
