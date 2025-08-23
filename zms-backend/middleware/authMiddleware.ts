import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

export function authMiddleware(req:Request, res:Response, next:NextFunction){


    if(!req.headers.authorization?.startsWith("Bearer ")){
        res.status(401).json({ message: "Please provide a bearer token" });
        return;
    }

    const token = req.headers.authorization?.split(" ")[1];
    
    if(!token){
         res.status(401).json({ message: "Unauthorized" });
         return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };

    req.user = decoded;

    next();
};

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {

    const admin = req.user.role === "ADMIN";

    if(!admin){
        return res.status(401).json({ message: "You are not authorized to access or modify this resource" });
    }
    
    next();
}
