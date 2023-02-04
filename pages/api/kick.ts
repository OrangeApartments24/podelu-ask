// 1650124815
// 1815543727
// 1721744105
// 1403473308
// 1890970908
// 1832925571
// 1645197822
// 1798860479
// 1533171897
// 1594368001
// 1677948277
// 1865914374
// -1001866133787

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

    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1650124815,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1815543727,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1721744105,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1403473308,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1890970908,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1832925571,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1645197822,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1798860479,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1533171897,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1594368001,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1677948277,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    await client.invoke(
        new Api.messages.DeleteChatUser({
            chatId: 1865914374,
            userId: '@natasha_kharchenko',
        })
    );
    console.log(1);
    // await client.invoke(
    //     new Api.messages.DeleteChatUser({
    //         chatId: -1001866133787,
    //         userId: '@natasha_kharchenko',
    //     })
    // );

    res.status(200).json({
        data: 'done',
    });
}
