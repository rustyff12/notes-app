import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const noteId = Number(params.id);
  if (isNaN(noteId)) {
    return new Response("Invalid ID", { status: 400 });
  }

  await prisma.note.delete({
    where: { id: noteId },
  });

  return new Response(null, { status: 204 }); // No Content
}
