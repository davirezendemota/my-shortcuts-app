import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  log: ['query']
})

export default async function handler(req, res) {

  const { method, body } = req

  if (method === 'POST') {

    const { name, link } = body

    await prisma.shortcut.create({
      data: {
        name,
        link
      }
    })

    const shortcuts = await prisma.shortcut.findMany()

    res.status(200).json({ data: shortcuts })

  } else if (method === 'GET') {

    const shortcuts = await prisma.shortcut.findMany()

    res.status(200).json({ data: shortcuts })

  } else if (method === 'DELETE') {
    
    await prisma.shortcut.delete({
      where: {
        id: body.id
      }
    })

    res.status(200).json({id: body.id})
  }
}