import { Response } from "express";

//! Error Response

interface ResponseOptions {
  statusCode?: number;
  message?: string;
  payload?: object;
}

export const errorResponse = (
  res: Response,
  { statusCode = 500, message = "Internal server error!" }: ResponseOptions
) => {
  return res.status(statusCode).json({
    status: "Failed",
    message,
  });
};

//todo: Success Response

export const successResponse = (
  res: Response,
  { statusCode = 200, message = "Successful", payload = {} }: ResponseOptions
) => {
  return res.status(statusCode).json({
    status: "Success",
    message,
    payload,
  });
};
