import config from "config";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv-safe";
import logger from "./logger";
import { CustomException } from "./errors";
import { ICreateToken, IVerifyToken } from "../interfaces/token.interface";

dotenv.config();

const accessTokenSecret = config.get("jwt.accessTokenSecret") as string;
const refreshTokenSecret = config.get("jwt.refreshTokenSecret") as string;

export const signPasswordAccessToken = (payload: {
  email: string;
}): Promise<string | undefined> =>
  new Promise((resolve, _) => {
    jwt.sign(
      { payload },
      accessTokenSecret,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          logger.error(`signAccessToken Error: ${err.message}`);
          throw new (CustomException as any)(500, "Unsuccessful operation");
        }
        resolve(token);
      }
    );
  });

export const signAccessToken = (
  payload: ICreateToken
): Promise<string | undefined> =>
  new Promise((resolve, _) => {
    jwt.sign(
      { payload },
      payload.isRefreshToken ? refreshTokenSecret : accessTokenSecret,
      { expiresIn: payload.isRefreshToken ? "7d" : "1h" },
      (err, token) => {
        if (err) {
          logger.error(`signAccessToken Error: ${err.message}`);
          throw new (CustomException as any)(500, "Unsuccessful operation");
        }
        resolve(token);
      }
    );
  });

export const verifyAccessToken = (
  tokenData: IVerifyToken
): Promise<JwtPayload | undefined> =>
  new Promise((resolve, _) => {
    try {
      const jwtRespone = jwt.verify(
        tokenData.token,
        tokenData.isRefreshToken ? refreshTokenSecret : accessTokenSecret
      ) as JwtPayload;
      resolve(jwtRespone);
    } catch (err: any) {
      logger.error(`verifyAccessToken Error: ${err.message}`);
      throw new (CustomException as any)(500, err.message);
    }
  });
