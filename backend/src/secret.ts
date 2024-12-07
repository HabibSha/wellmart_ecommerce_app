const port = process.env.PORT || 5002;
const mongoUri =
  process.env.MongoDB_URI || "mongodb://127.0.0.1:27017/WellMartDB";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "jwtsecretaccesskey";
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "jwtsecretrefreshkey";

export { port, mongoUri, jwtAccessKey, jwtRefreshKey };
