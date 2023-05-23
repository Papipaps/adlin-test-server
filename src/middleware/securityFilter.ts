import { Request, Response, NextFunction } from "express";

function securityFilter(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Token");
  const API_TOKEN = process.env.API_TOKEN;

  if (!token || token !== API_TOKEN) {
    return res.status(401).json({ message: "Not authorized" });
  }
  //récupération des rôles des utilisateurs et vérification des autorisations selon la route

  next();
}

export default securityFilter;
