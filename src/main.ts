
import { listen } from "./app";
import 'dotenv/config';
import '../src/database/connection';

listen(process.env.APP_PORT as unknown as number || 4000);
