import path from 'path';
import { loadSync } from '@grpc/proto-loader';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';

const { SERVICE_BOOKS_HOST } = process.env;

// console.log(SERVICE_BOOKS_HOST, 22222)

const packageDefinition = loadSync(
    path.resolve('./src/protos/books.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    },
);

const { books } = loadPackageDefinition(packageDefinition);

const client = new books.Books(SERVICE_BOOKS_HOST, credentials.createInsecure());

const generator = async (handlerName, payload) => new Promise((resolve, reject) => client[handlerName](payload, (err, data) => {
    if (data) resolve(data);
    else reject(err);
}));

export default generator;