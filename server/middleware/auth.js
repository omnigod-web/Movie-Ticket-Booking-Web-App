// import { clerkClient } from "@clerk/express";

// export const protectAdmin = async (req, res, next) => {
//     try {
//         const { userId } = req.auth();

//         const user = await clerkClient.users.getUser(userId);
        
//         if (user.privateMetadata.role !== 'admin') {
//             return res.status(403).json({ success: false, message: 'Access denied' });
//         }

//         next();
//     } catch (error) {
//         console.error('Error in protectAdmin middleware:', error);
//         return res.status(500).json({ success: false, message: "not authorized" });
//     }
// }

import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try {
        const auth = req.auth?.(); // safe access
        const userId = auth?.userId;

        if (!userId) {
            return res.json({ success: false , message: "Unauthorized" });
        }

        const user = await clerkClient.users.getUser(userId);

        if (user.privateMetadata.role !== 'admin') {
            return res.json({ success: false, message: "Access denied" });
        }

        next();
    } catch (error) {
        console.error('Error in protectAdmin middleware:', error);
        return res.json({ success: false, message: "Not authorized" });
    }
};
