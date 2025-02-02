import configDev from "./configDev";

let enviLoad = {};

if (process.env.REACT_APP_ENV === 'dev') {
    enviLoad = { ...configDev };
} else {
    throw new Error(`Unsupported environment: ${process.env.REACT_APP_ENV}`);
}

export default enviLoad;
