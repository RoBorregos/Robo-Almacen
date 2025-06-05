import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  token?: string;
  error?: string;
};

// This is a mock implementation of the getRfid API route that simulates reading an RFID tag.
// To use it, change the RFID_SERVER environment variable to http://localhost:3000/api

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Mock RFID value for testing purposes
  const Mock_RFID = "";

  try {
    return res.status(200).json({
      token: Mock_RFID,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}
