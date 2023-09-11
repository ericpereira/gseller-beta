const IS_DEV = process.env.APP_ENV === "dev";
const PORT = process.env.APP_PORT || 3001;

export const apiOptions = {
    port: PORT,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    ...(IS_DEV ? {
        adminApiPlayground: {
            settings: { 'request.credentials': 'include' } as any,
        },
        adminApiDebug: true,
        shopApiPlayground: {
            settings: { 'request.credentials': 'include' } as any,
        },
        shopApiDebug: true,
    } : {}),
}