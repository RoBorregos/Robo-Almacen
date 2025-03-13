// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//     try {
//         //Get body and destructure
//         const body = await req.json();
//         console.log(body, "body");
//         return new NextResponse("Registration successful", { status: 200 });

//     } catch (error: any) {
//         console.log(error, "Registration error");
//         return new NextResponse("Registration error", { status: 500 });
//     }
// }