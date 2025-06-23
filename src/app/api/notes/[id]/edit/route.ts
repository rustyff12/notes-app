import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const sanitizedTitle = sanitizeHtml(body.title);
  const sanitizedContent = sanitizeHtml(body.content);

  await prisma.note.update({
    where: { id: Number(params.id) },
    data: {
      title: sanitizedTitle,
      content: sanitizedContent,
    },
  });
  return NextResponse.json({ success: true });
}
