import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  const { id, title, completed } = await request.json();
  const todo = await prisma.todo.create({
    data: { id, title, completed }
  });
  return NextResponse.json(todo);
}

export async function PUT(request: NextRequest) {
  const { id, ...updates } = await request.json();
  const todo = await prisma.todo.update({
    where: { id },
    data: updates
  });
  return NextResponse.json(todo);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ message: 'Todo deleted' });
}
