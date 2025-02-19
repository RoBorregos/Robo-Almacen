export type UserRole = "USER" | "MEMBER" | "ADMIN";

export const allowedRole = ({
  role,
  allowed,
}: {
  role: string | undefined | null;
  allowed: string[];
}) => {
  if (!role) role = "USER";
  return allowed.indexOf(role) > -1;
};
