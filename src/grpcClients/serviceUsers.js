import path from 'path';
import { loadSync } from '@grpc/proto-loader';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';

const { SERVICE_USERS_HOST } = process.env;


const packageDefinition = loadSync(
    path.resolve('./src/protos/users.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    },
);

const { users } = loadPackageDefinition(packageDefinition);

const client = new users.Users(SERVICE_USERS_HOST, credentials.createInsecure());

const generator = async (handlerName, payload) => new Promise((resolve, reject) => client[handlerName](payload, (err, data) => {
    if (data) resolve(data);
    else reject(err);
}));

export default generator;