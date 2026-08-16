import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs';

async function main() {
    try {
        console.log("Removing background...");
        const blob = await removeBackground('./public/photo.png');
        const buffer = await blob.arrayBuffer();
        fs.writeFileSync('./public/photo-front.png', Buffer.from(buffer));
        console.log("Success! Saved to public/photo-front.png");
    } catch (e) {
        console.error("Error:", e);
    }
}
main();
