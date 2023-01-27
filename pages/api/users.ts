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

    const getUsers = async () => {
        const result = await client.invoke(
            new Api.channels.GetParticipants({
                channel: -1001866133787,
                filter: new Api.ChannelParticipantsRecent({}),
                offset: 0,
                limit: 1000,
                hash: BigInt('-4156887774564'),
            })
        );
        return result;
    };

    const data = await getUsers();

    res.status(200).json({
        users: data.users.map((u: any) => ({ id: u.id, username: u.username })),
    });
}
