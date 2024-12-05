import { Response } from "express";

const setAccessTokenCookie = (res: Response, accessToken: string) => {
  res.cookie("accessToken", accessToken, {
    maxAge: 5 * 60 * 1000, // 5 min
    httpOnly: true,
    // secure: true,
    sameSite: "none",
  });
};

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    httpOnly: true,
    // secure: true,
    sameSite: "none",
  });
};

export { setAccessTokenCookie, setRefreshTokenCookie };
