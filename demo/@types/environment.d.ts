export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // GENERAL CONFIG
      APP_ENV: string;
      COOKIE_SECRET: string;
      SUPERADMIN_USERNAME: string;
      SUPERADMIN_PASSWORD: string;
      APP_PORT: number;
      // DATABASE CONFIG
      DB_HOST: string;
      DB_PORT: number;
      DB_NAME: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      KANGU_ENDPOINT: string;
      KANGU_TOKEN: string;
      // SMTP CONFIG
      SMTP_TYPE:
        | "none"
        | "file"
        | "smtp"
        | "sendmail"
        | "ses"
        | "testing"
        | undefined;
      SMTP_HOST: string;
      SMTP_USERNAME: string;
      SMTP_PORT: string;
      SMTP_PASSWORD: string;
      //HANDLEBARS CONFIG
      HANDLEBARS_FROM_ADDRESS: string;
      HANDLEBARS_CLIENT_NAME: string;
      HANDLEBARS_PASSWORD_RESET_URL: string;
      //VERCEL CONFIG
      VERCEL_URL: string;
      VERCEL_TEAM_ID: string;
      VERCEL_TOKEN: string;
      VERCEL_API_URL: string;
    }
  }
}
