import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

type ResponseData = {
    status: string
    data?: any
}

const prisma = new PrismaClient()

async function getPrestamos() {
    try {
        // Directly query the Prestamo table using Prisma
        const prestamos = await prisma.prestamo.findMany({
            where: {
                returned: false,
                issued: false,
            },
            select: {
                User: {
                    select: {
                        name: true,
                    },
                },
                Item: {
                    select: {
                        name: true,
                    },
                },
                Celda: {
                    select: {
                        name: true,
                        column: true,
                        row: true,
                    },
                },
                id: true,
            },
        });
        console.log(prestamos, "prestamos");
        return prestamos;
    } catch (error) {
        console.error("Error fetching prestamos:", error);
        throw error;
    }
}

async function getIssuedPrestamos() {
    try {
        // Directly query the Prestamo table using Prisma
        const prestamos = await prisma.prestamo.findMany({
            where: {
                returned: false,
                issued: true,
            },
            select: {
                User: {
                    select: {
                        name: true,
                    },
                },
                Item: {
                    select: {
                        name: true,
                    },
                },
                Celda: {
                    select: {
                        name: true,
                        column: true,
                        row: true,
                    },
                },
                id: true,
            },
        });
        console.log(prestamos, "prestamos");
        return prestamos;
    } catch (error) {
        console.error("Error fetching prestamos:", error);
        throw error;
    }
}

async function issuePrestamo(data: string) {
    try {
        console.log("issue");
        // Parse the data to get the user and item IDs
        const [RFIDtoken, prestamoId] = data.split(",");
        if (!RFIDtoken || !prestamoId) {
            throw new Error("Invalid data format");
        }
        // Query the Prestamo table
        const prestamo = await prisma.prestamo.findUnique({
            where: {
                id: prestamoId,
            },
            select: {
                userId: true,
                returned: true,
                issued: true,
            },
        });
        if (!prestamo) {
            throw new Error("Prestamo not found");
        }
        // Query the User table
        const user = await prisma.user.findUnique({
            where: {
                id: prestamo.userId,
            },
            select: {
                RFIDtoken: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        // Check if the user's RFID token matches the token sent by the RFID reader
        if (user.RFIDtoken !== RFIDtoken) {
            throw new Error("Invalid RFID token");
        }
        // Check if the prestamo is already issued
        if (prestamo.issued) {
            throw new Error("Prestamo already issued");
        }
        // Update the prestamo to set the issued value to true
        await prisma.prestamo.update({
            where: {
                id: prestamoId,
            },
            data: {
                issued: true,
            },
        });
        return "Prestamo issued";
    } catch (error) {
        console.error("Error issuing prestamo:", error);
        throw error;
    }
}

async function returnPrestamo(data: string) {
    try {
        // Parse the data to get the user and item IDs
        const [RFIDtoken, prestamoId] = data.split(",");
        if (!RFIDtoken || !prestamoId) {
            throw new Error("Invalid data format");
        }
        // Query the Prestamo table
        const prestamo = await prisma.prestamo.findUnique({
            where: {
                id: prestamoId,
            },
            select: {
                userId: true,
                issued: true,
                quantity: true,
                itemId: true,
                Celda: {
                    select: {
                        CeldaItem: {
                            select: {
                                id: true,
                                itemId: true,
                            },
                        },
                    },
                }
            },
        });
        if (!prestamo) {
            throw new Error("Prestamo not found");
        }
        // Query the User table
        const user = await prisma.user.findUnique({
            where: {
                id: prestamo.userId,
            },
            select: {
                RFIDtoken: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        // Check if the user's RFID token matches the token sent by the RFID reader
        if (user.RFIDtoken !== RFIDtoken) {
            throw new Error("Invalid RFID token");
        }
        // Check if the prestamo is already issued
        if (!prestamo.issued) {
            console.log(prestamo, "prestamo")
            throw new Error("Prestamo is not yet issued");
        }
        // Update the prestamo to set the issued value to false and returned value to true
        await prisma.prestamo.update({
            where: {
                id: prestamoId,
            },
            data: {
                returned: true,
            },
        });
        console.log(prestamo.Celda.CeldaItem)
        // Update the quantity of the item in the CeldaItem table
        prestamo.Celda.CeldaItem.forEach(async (celdaItem) => {
            if (celdaItem.itemId === prestamo.itemId) {
                await prisma.celdaItem.update({
                    where: {
                        id: celdaItem.id,
                    },
                    data: {
                        quantity: {
                            increment: prestamo.quantity,
                        },
                    },
                });
            }
        });
    } catch (error) {
        console.error("Error returning prestamo:", error);
        throw error;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    console.log(req.body, "req")
    const { data, action, id } = req.body;

    switch (id) {
        case 'RFID':
            console.log('RFID:', action)
            switch (action) {
                case 'getPrestamos':
                    await getPrestamos()
                        .then((prestamos) => {
                            res.status(200).json({ status: 'Success', data: prestamos });
                        })
                        .catch((error) => {
                            res.status(500).json({ status: 'Failed', data: error.message });
                        })
                        .finally(async () => {
                            await prisma.$disconnect();
                        });
                    break;
                case 'getIssuedPrestamos':
                    await getIssuedPrestamos()
                        .then((prestamos) => {
                            res.status(200).json({ status: 'Success', data: prestamos });
                        })
                        .catch((error) => {
                            res.status(500).json({ status: 'Failed', data: error.message });
                        })
                        .finally(async () => {
                            await prisma.$disconnect();
                        });
                    break;
                case 'issuePrestamo':
                    await issuePrestamo(data)
                        .then((message) => {
                            res.status(200).json({ status: 'Success', data: message });
                        })
                        .catch((error) => {
                            res.status(400).json({ status: 'Failed', data: error.message });
                        })
                        .finally(async () => {
                            await prisma.$disconnect();
                        });
                    break;
                case 'returnPrestamo':
                    await returnPrestamo(data)
                        .then(() => {
                            res.status(200).json({ status: 'Success', data: 'Prestamo returned' });
                        })
                        .catch((error) => {
                            res.status(400).json({ status: 'Failed', data: error.message });
                        })
                        .finally(async () => {
                            await prisma.$disconnect();
                        });
                    break;
                default:
                    res.status(400).json({ status: 'Failed', data: 'Invalid Action' });
                    break;
            }
            break;
        default:
            res.status(400).json({ status: 'Failed', data: 'Invalid ID' });
    }
}