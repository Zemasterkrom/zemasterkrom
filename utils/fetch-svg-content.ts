import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

export default async function fetchSvgContent(svgSrc: string): Promise<string> {
    if (svgSrc.startsWith('data:')) {
        const [, meta, data] = svgSrc.match(/^data:([^,]*),(.*)$/s) || [];
        if (!data) throw new Error('Invalid data URI');
        const isBase64 = (meta || '').includes(';base64');
        return isBase64 ? Buffer.from(data, 'base64').toString('utf8') : decodeURIComponent(data);
    }

    let resolved: URL;
    try {
        resolved = new URL(svgSrc);
    } catch {
        const absolute = path.resolve(process.cwd(), svgSrc);
        const content = await fs.readFile(absolute, 'utf8');
        return content;
    }

    if (resolved.protocol === 'file:') {
        const filePath = fileURLToPath(resolved);
        return fs.readFile(filePath, 'utf8');
    }

    if (resolved.protocol === 'http:' || resolved.protocol === 'https:') {
        const res = await axios.get(resolved.toString(), {
            timeout: 30000,
        });
        return res.data;
    }

    throw new Error(`Unsupported URL protocol: ${resolved.protocol}`);
}
