import { NextRequest, NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest, { params }: { params: Promise<{ file: string }> } ) {

    try {

        // Extract the file name from route parameters and construct the full path
        const { file } = await params
        const filePath = path.join(process.cwd(), 'public', 'uploads', file)

        //Check if file exist
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Requested image does not exist' }, { status: 404 })
        }

        // Read the image file from disk into a binary buffer
        const buffer = fs.readFileSync(filePath)

        // Extract the file extension
        const ext = path.extname(file).toLowerCase()

        // Map of supported file extensions to their corresponding MIME types
        const mimeMap: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }

        // Falls back to "application/octet-stream" if the extension is unknown
        const mimeType = mimeMap[ext] || 'application/octet-stream'

        // Return the image buffer as the HTTP response
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=3600'
            }
        })

    } catch(error) {
        console.error('Error while getting the image:', error);
        return NextResponse.json({ error: 'Failed to get image' }, { status: 500 });
    }
}