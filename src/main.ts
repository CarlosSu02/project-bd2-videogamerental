
import { listen } from "./app";
import 'dotenv/config';
import '../src/database/connection';

// const main = () => {

    listen(process.env.APP_PORT as unknown as number || 4000);

// };

// main();
