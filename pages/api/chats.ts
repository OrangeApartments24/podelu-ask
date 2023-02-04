import type { NextApiRequest, NextApiResponse } from 'next';

const { Api, TelegramClient } = require('telegram');
const dotenv = require('dotenv');
const { StringSession } = require('telegram/sessions');

dotenv.config();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const apiId = parseInt(process.env.API_ID as any);
    const apiHash = process.env.API_HASH;

    const session = new StringSession(process.env.SESSION_STRING); // You should put your string session here
    const client = new TelegramClient(session, apiId, apiHash, {});

    await client.connect();

    const result = await client.invoke(
        new Api.messages.GetDialogs({
            offsetDate: 0,
            offsetId: 0,
            offsetPeer: 'username',
            limit: 100,
            hash: BigInt('-4156887774564'),
            excludePinned: true,
        })
    );

    res.status(200).json({
        data: result,
    });
}
