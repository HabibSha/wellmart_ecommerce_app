// If any type define then it can be use

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return value;
};

// export const port = getEnv("PORT");
// export const mongoUri = getEnv("mongodb://127.0.0.1:27017/WellMartDB");
