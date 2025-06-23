import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import sanitizeHtml from "sanitize-html";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const body = await req.json();
  const sanitizedTitle = sanitizeHtml(body.title);
  const sanitizedContent = sanitizeHtml(body.content);

  await prisma.note.update({
    where: { id: Number(id) },
    data: {
      title: sanitizedTitle,
      content: sanitizedContent,
    },
  });

  return NextResponse.json({ success: true });
}
