import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "rbgs/server/db";

async function saveConnectionId(connectionId: string) {
  try {
    await prisma.connection.create({
      data: {
        connectionId,
      },
    });
    console.log("Connection ID saved:", connectionId);
  } catch (error) {
    console.error("Error saving connection ID:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { connectionId } = req.body;

  if (!connectionId) {
    return res.status(400).json({ message: "Missing connectionId" });
  }

  saveConnectionId(connectionId as string);

  res.status(200).json({ message: "Connection succeeded!" });
}
