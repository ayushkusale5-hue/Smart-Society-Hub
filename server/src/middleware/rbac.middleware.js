import { errorResponse } from "../utils/response.utils.js";

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Authentication required", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Required roles: ${allowedRoles.join(", ")}`,
        403,
      );
    }

    next();
  };
}

export function requireEmailVerified(req, res, next) {
  if (!req.user?.is_email_verified) {
    return errorResponse(res, "Please verify your email address first", 403);
  }
  next();
}

export function isSelfOrCommittee(req, res, next) {
  const { id } = req.params;
  if (req.user.id === id || req.user.role === "committee") {
    return next();
  }
  return errorResponse(res, "Access denied", 403);
}
