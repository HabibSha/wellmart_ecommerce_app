import jwt from "jsonwebtoken";

interface IToken {
  payload: object;
  secretKey: string;
  expiresIn?: string;
}

const generateToken = ({
  payload,
  secretKey,
  expiresIn = "12m",
}: IToken): string => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non-empty object");
  }
  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("Secret key must be a non-empty string");
  }
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error("Failed to sign the JWT: ", error);
    throw error;
  }
};

export default generateToken;
