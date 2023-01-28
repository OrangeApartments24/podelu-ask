import { RepeatIcon, StarIcon } from '@chakra-ui/icons';
import {
    Box,
    Heading,
    HStack,
    Input,
    Progress,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import { collection, getFirestore } from 'firebase/firestore';
import { has } from 'immer/dist/internal';
import moment, { now } from 'moment';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useUsers } from '../../hooks/useUsers';
import { firebaseApp } from '../../pages/_app';

export const numberWithSpaces = (x: number | undefined) => {
    if (!x) return '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const numWord = (value: number, words: string[]) => {
    let val = value;
    val = Math.abs(val) % 100;
    var num = val % 10;
    if (val > 10 && val < 20) return words[2];
    if (num > 1 && num < 5) return words[1];
    if (num == 1) return words[0];
    return words[2];
};

const admins = [
    '5743349386',
    '2076857189',
    '5967579234',
    '1285270117',
    '814923921',
    '5814853133',
    '1092884561',
    '1089673911',
    '641427689',
    '644578695',
    '872066338',
    '1076478366',
    '5981826317',
];

const autopays: string[] = [
    '566459651',
    '329717056',
    '1277891385',
    '51944396',
    '721896363',
];

const mentors: string[] = ['337113679'];

// ['товар', 'товара', 'товаров']

const UsersContent = () => {
    const [data, loading, error] = useCollection(
        collection(getFirestore(firebaseApp), 'payments'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [users, setUsers] = useState<
        { username: string; id: number; firstname: string; lastname: string }[]
    >([]);
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

    useEffect(() => {
        fetch('/api/users')
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((data) => {
                setUsers(data.users);
            });
    }, []);

    const goodUsers = useMemo(() => {
        if (!users || !data) return 0;

        return users
            .filter((u) => !admins.includes(String(u.id as any)))
            .filter((a) => {
                const userPayments = data?.docs.filter(
                    (d) => parseInt(d.data().from) === parseInt(a.id as any)
                );

                const isProlong =
                    parseInt(moment().format('DD')) >= 25 &&
                    userPayments.some((p) => {
                        return (
                            moment.unix(p.data().created_at.seconds).month() ===
                            moment().month()
                        );
                    });

                return (
                    isProlong ||
                    autopays.includes(String(a.id)) ||
                    mentors.includes(String(a.id))
                );
            }).length;
    }, [users, data]);

    const renderUsers = useMemo(() => {
        if (!users || !data) return null;
        return users
            .filter((u) => !admins.includes(String(u.id as any)))
            .sort((a) => {
                const userPayments = data?.docs.filter(
                    (d) => parseInt(d.data().from) === parseInt(a.id as any)
                );

                const isProlong =
                    parseInt(moment().format('DD')) >= 25 &&
                    userPayments.some((p) => {
                        return (
                            moment.unix(p.data().created_at.seconds).month() ===
                            moment().month()
                        );
                    });

                if (autopays.includes(String(a.id))) return -1;
                if (mentors.includes(String(a.id))) return -1;
                return !isProlong ? 1 : -1;
            })
            .map((u) => {
                const nick = u.username;
                const hasNick = !!nick;

                const userPayments = data?.docs.filter(
                    (d) => parseInt(d.data().from) === parseInt(u.id as any)
                );

                const paymentsCount = userPayments.length;

                const isProlong =
                    parseInt(moment().format('DD')) >= 25 &&
                    userPayments.some((p) => {
                        return (
                            moment.unix(p.data().created_at.seconds).month() ===
                            moment().month()
                        );
                    });

                return (
                    <Box
                        w='full'
                        borderWidth={1}
                        borderColor='gray.200'
                        borderRadius={'lg'}
                        key={u.id}
                        p={2}
                    >
                        <Heading size='sm'>
                            {u.firstname} {u.lastname ? u.lastname : ''}
                        </Heading>
                        <Text>
                            {hasNick ? (
                                <Link
                                    href={`tg://resolve?domain=${nick.replace(
                                        '@',
                                        ''
                                    )}`}
                                    style={{
                                        borderBottom: '1px solid #ccc',
                                    }}
                                >
                                    @{u.username}
                                </Link>
                            ) : (
                                <>Нет ника</>
                            )}
                        </Text>
                        <HStack justify={'space-between'}>
                            <Text>
                                {paymentsCount}{' '}
                                {numWord(parseInt(paymentsCount as any), [
                                    'платёж',
                                    'платежа',
                                    'платежей',
                                ])}
                            </Text>
                            <Text fontSize='xs' ml='auto!' opacity={0.5}>
                                {u.id}
                            </Text>
                            <Box
                                w={3}
                                h={3}
                                borderRadius={9}
                                bg={
                                    isProlong ||
                                    autopays.includes(String(u.id)) ||
                                    mentors.includes(String(u.id))
                                        ? 'green.400'
                                        : 'red.400'
                                }
                            ></Box>
                        </HStack>
                        {autopays.includes(String(u.id)) && (
                            <HStack align={'center'} opacity={0.5}>
                                <RepeatIcon
                                    w='3'
                                    position={'relative'}
                                    top={'0.5px'}
                                />
                                <Text fontSize={'sm'}>
                                    Подключен автоплатёж
                                </Text>
                            </HStack>
                        )}
                        {mentors.includes(String(u.id)) && (
                            <HStack align={'center'} opacity={0.5}>
                                <StarIcon
                                    w='3'
                                    position={'relative'}
                                    top={'0.5px'}
                                />
                                <Text fontSize={'sm'}>Наставничество</Text>
                            </HStack>
                        )}
                    </Box>
                );
            });
    }, [data, date, users, autopays]);

    return (
        <VStack
            maxW={'600px'}
            mx={'auto'}
            bg='white'
            maxHeight={'100vh'}
            p={4}
            spacing={1}
        >
            {loading || users.length === 0 ? (
                <Spinner />
            ) : (
                <>
                    <Heading size='md' mr={'auto'}>
                        Чат продлили
                    </Heading>
                    <Text mr={'auto'} w='full'>
                        {goodUsers} из{' '}
                        {
                            users.filter(
                                (u) => !admins.includes(String(u.id as any))
                            ).length
                        }
                    </Text>
                    <VStack mt={'4!'} w='full' overflow={'scroll'}>
                        {renderUsers}
                    </VStack>
                </>
            )}
        </VStack>
    );
};

export default UsersContent;
