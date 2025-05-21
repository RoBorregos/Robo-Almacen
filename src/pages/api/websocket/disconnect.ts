import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "rbgs/server/db";

async function removeConnectionId(connectionId: string) {
  try {
    await prisma.connection.delete({
      where: { connectionId },
    });
    console.log("Connection ID removed:", connectionId);
  } catch (error) {
    console.error("Error removing connection ID:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { connectionId } = req.body as { connectionId: string };

  if (!connectionId) {
    return res.status(400).json({ message: "Missing connectionId" });
  }

  await removeConnectionId(connectionId);
  6;

  return res.status(200).json({ message: "Disconnected!" });
}
