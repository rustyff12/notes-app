import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const url = req.nextUrl;
  const id = url.pathname.split("/").filter(Boolean).at(-2);

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await req.json();
  const sanitizedTitle = sanitizeHtml(body.title);
  const sanitizedContent = sanitizeHtml(body.content);

  await prisma.note.update({
    where: { id: Number(id) },
    data: { title: sanitizedTitle, content: sanitizedContent },
  });

  return NextResponse.json({ success: true });
}
