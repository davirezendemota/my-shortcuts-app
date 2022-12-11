import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getShortcuts() {
  
  const shortcuts = await prisma.shortcut.findMany()

  return shortcuts
} 
