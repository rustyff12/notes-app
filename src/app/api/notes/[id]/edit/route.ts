import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  await prisma.note.update({
    where: { id: Number(params.id) },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return NextResponse.json({ success: true });
}
