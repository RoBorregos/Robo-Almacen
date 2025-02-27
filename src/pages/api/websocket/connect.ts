import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
    
) {
    console.log(req.body, "req")
    console.log(req.headers, "req")
    res.status(200).json({ message: 'Connection succeeded!' })
}