import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";

const prisma = new PrismaClient();

type Context = {
  params: {
    id: string;
  };
};

export async function POST(req: NextRequest, { params }: Context) {
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
