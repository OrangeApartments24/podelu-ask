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
import moment from 'moment';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useUsers } from '../../hooks/useUsers';
import { firebaseApp } from '../../pages/_app';

export const numberWithSpaces = (x: number | undefined) => {
    if (!x) return '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const PaymentsContent = () => {
    const [data, loading, error] = useCollection(
        collection(getFirestore(firebaseApp), 'payments'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [users, setUsers] = useState<{ username: string; id: number }[]>([]);
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

    const getNick = useCallback(
        (id: string) => {
            const currentUser = users.find(
                (u: any) => parseInt(u.id) === parseInt(id)
            );
            console.log(id);
            if (currentUser) return `@${currentUser.username}`;
            return 'Нет ника';
        },
        [users]
    );

    const renderPayments = useMemo(() => {
        return data?.docs
            .sort((a: any, b: any) => {
                if (a.data().created_at.seconds < b.data().created_at.seconds)
                    return 1;
                if (a.data().created_at.seconds === b.data().created_at.seconds)
                    return 0;
                if (a.data().created_at.seconds > b.data().created_at.seconds)
                    return -1;
                return 0;
            })
            .filter((d) => {
                return moment
                    .unix(d.data().created_at.seconds)
                    .isSame(date, 'day');
            })
            .map((d) => {
                const nick = getNick(d.data().from);
                const hasNick = nick.includes('@');
                return (
                    <Box
                        w='full'
                        borderWidth={1}
                        borderColor='gray.200'
                        borderRadius={'lg'}
                        key={d.id}
                        p={2}
                    >
                        <HStack w='full' justifyContent={'space-between'}>
                            <Heading size='md'>{d.data().price} ₽</Heading>
                            <Text>
                                {moment
                                    .unix(d.data().created_at.seconds)
                                    .format('DD MMMM YYYY')}
                            </Text>
                        </HStack>
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
                                    {getNick(d.data().from)}
                                </Link>
                            ) : (
                                <>Нет ника</>
                            )}
                        </Text>
                    </Box>
                );
            });
    }, [data, date, users]);

    const todaySum = useMemo(() => {
        if (!data) return 0;
        return data.docs.reduce((res: any, current: any) => {
            const m = moment.unix(current.data().created_at.seconds);

            if (m.isSame(date, 'day')) {
                return (res += current.data().price);
            } else {
                return res;
            }
        }, 0);
    }, [data, date]);

    const octoberSum = useMemo(() => {
        if (!data) return 0;
        return data.docs.reduce((res: any, current: any) => {
            const m = moment.unix(current.data().created_at.seconds);

            if (
                m.year() === 2022 &&
                m.month() === 9 &&
                m.isBefore(moment(date, 'YYYY-MM-DD').add(1, 'day'))
            ) {
                return (res += current.data().price);
            } else {
                return res;
            }
        }, 0);
    }, [data, date]);

    const novemberSum = useMemo(() => {
        if (!data) return 0;
        return data.docs.reduce((res: any, current: any) => {
            const m = moment.unix(current.data().created_at.seconds);

            if (
                m.year() === 2022 &&
                m.month() === 10 &&
                m.isBefore(moment(date, 'YYYY-MM-DD').add(1, 'day'))
            ) {
                return (res += current.data().price);
            } else {
                return res;
            }
        }, 0);
    }, [data, date]);

    const decemberSum = useMemo(() => {
        if (!data) return 0;
        return data.docs.reduce((res: any, current: any) => {
            const m = moment.unix(current.data().created_at.seconds);

            if (
                m.year() === 2022 &&
                m.month() === 11 &&
                m.isBefore(moment(date, 'YYYY-MM-DD').add(1, 'day'))
            ) {
                return (res += current.data().price);
            } else {
                return res;
            }
        }, 0);
    }, [data, date]);

    const januarySum = useMemo(() => {
        if (!data) return 0;
        return data.docs.reduce((res: any, current: any) => {
            const m = moment.unix(current.data().created_at.seconds);

            if (
                m.year() === 2023 &&
                m.month() === 0 &&
                m.isBefore(moment(date, 'YYYY-MM-DD').add(1, 'day'))
            ) {
                return (res += current.data().price);
            } else {
                return res;
            }
        }, 0);
    }, [data, date]);

    const totalSum = useMemo(() => {
        if (!data) return 0;
        return data.docs.reduce((res: any, current: any) => {
            const m = moment.unix(current.data().created_at.seconds);
            if (m.isBefore(moment(date, 'YYYY-MM-DD').add(1, 'day'))) {
                return (res += current.data().price);
            } else {
                return res;
            }
        }, 0);
    }, [data, date]);

    return (
        <VStack
            maxW={'600px'}
            mx={'auto'}
            bg='white'
            maxHeight={'calc(100vh - 100px)'}
            p={4}
            overflow='hidden'
            spacing={4}
        >
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <Heading size={'md'} mr='auto'>
                        Платежи
                    </Heading>

                    <Input
                        type='date'
                        onChange={(e) => {
                            setDate(e.target.value);
                        }}
                        value={date}
                    />

                    <VStack w='full' overflow={'scroll'}>
                        {renderPayments}
                    </VStack>
                </>
            )}
            <Box
                w='full'
                flexGrow={1}
                display={'block'}
                py={4}
                borderTopWidth={1}
                borderTopColor='gray.200'
            >
                <Text>
                    За сегодня: <b>{numberWithSpaces(todaySum) || 0} ₽</b>
                </Text>

                <Text>
                    Октябрь: <b>{numberWithSpaces(octoberSum) || 0} ₽</b>
                </Text>
                <Text>
                    Ноябрь: <b>{numberWithSpaces(novemberSum) || 0} ₽</b>
                </Text>
                <Text>
                    Декабрь: <b>{numberWithSpaces(decemberSum) || 0} ₽</b>
                </Text>
                <Text>
                    Январь: <b>{numberWithSpaces(januarySum) || 0} ₽</b>
                </Text>

                <Text>
                    Итого: <b>{numberWithSpaces(totalSum) || 0} ₽</b>
                </Text>
            </Box>
        </VStack>
    );
};

export default PaymentsContent;
