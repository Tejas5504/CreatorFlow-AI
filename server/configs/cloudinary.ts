import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

const url = process.env.CLOUDINARY_URL || "";

if (!url) {
    console.error("[Cloudinary] ❌ CLOUDINARY_URL is not set in .env");
} else {
    try {
        // Format: cloudinary://api_key:api_secret@cloud_name
        const withoutProtocol = url.replace("cloudinary://", "");
        const atIndex = withoutProtocol.lastIndexOf("@");
        const cloud_name = withoutProtocol.substring(atIndex + 1);
        const credentials = withoutProtocol.substring(0, atIndex);
        const colonIndex = credentials.indexOf(":");
        const api_key = credentials.substring(0, colonIndex);
        const api_secret = credentials.substring(colonIndex + 1);

        cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
        console.log(`[Cloudinary] ✅ Configured — cloud: ${cloud_name}, key: ${api_key}`);
    } catch (e) {
        console.error("[Cloudinary] ❌ Failed to parse CLOUDINARY_URL:", url, e);
    }
}

export default cloudinary;
