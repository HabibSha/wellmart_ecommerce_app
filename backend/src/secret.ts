export const port = process.env.PORT || 5002;
export const mongoUri =
  process.env.MongoDB_URI || "mongodb://127.0.0.1:27017/WellMartDB";
export const jwtAccessKey = process.env.JWT_ACCESS_KEY || "jwtsecretaccesskey";
export const jwtRefreshKey =
  process.env.JWT_REFRESH_KEY || "jwtsecretrefreshkey";
