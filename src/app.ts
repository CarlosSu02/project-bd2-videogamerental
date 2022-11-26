 
import express, { json } from 'express';
import cors from 'cors';

const app = express();

app.use(json());
app.use(cors());

export const listen = (PORT: number) => {

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}, \nhttp://localhost:${PORT}/`)
    });

};

