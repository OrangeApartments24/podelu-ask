import { AddIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Heading,
    HStack,
    Input,
    Progress,
    Select,
    SimpleGrid,
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
    useToast,
    VStack,
} from '@chakra-ui/react';
import {
    collection,
    doc,
    getFirestore,
    setDoc,
    Timestamp,
} from 'firebase/firestore';
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

    const [customUserId, setCustomUserId] = useState('');
    const [customType, setCustomType] = useState<
        'Robokassa' | 'Сбер Денис' | 'Сбер Коля' | 'Бонусы'
    >('Robokassa');
    const [customPrice, setCustomPrice] = useState('');
    const toast = useToast();

    const addPaymentHandler = useCallback(async () => {
        if (!customPrice || !customUserId) {
            toast({
                title: 'Заполните все поля',
                description: 'При добавлении платежа',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        await setDoc(
            doc(getFirestore(firebaseApp), 'payments', crypto.randomUUID()),
            {
                price: parseInt(customPrice),
                from: parseInt(customUserId),
                isCash:
                    customType === 'Сбер Коля' || customType === 'Сбер Денис',
                type: customType,
                created_at: Timestamp.fromDate(new Date(date)),
            }
        ).then(() => {
            toast({
                title: 'Платёж добавлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        });
    }, [customUserId, customPrice, date, customType]);

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
                        <HStack align={'center'} spacing={1} mt={3}>
                            <InfoOutlineIcon
                                position={'relative'}
                                top={'0px'}
                            />
                            <Text>{d.data().type || 'Robokassa'}</Text>
                        </HStack>
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

    const febrarySum = useMemo(() => {
        if (!data) return 0;
        return data.docs.reduce((res: any, current: any) => {
            const m = moment.unix(current.data().created_at.seconds);

            if (
                m.year() === 2023 &&
                m.month() === 1 &&
                m.isBefore(moment(date, 'YYYY-MM-DD').add(1, 'day'))
            ) {
                return (res += current.data().price);
            } else {
                return res;
            }
        }, 0);
    }, [data, date]);

    const sberSum = useMemo(() => {
        if (!data) return 0;
        return data.docs.reduce((res: any, current: any) => {
            const m = moment.unix(current.data().created_at.seconds);

            if (
                m.isBefore(moment(date, 'YYYY-MM-DD').add(1, 'day')) &&
                current.data().type === 'Сбер Коля'
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

    const telegramReportText = useMemo(() => {
        let paymentsText = `#отчёт ${moment(date, 'YYYY-MM-DD').format(
            'DD.MM.YY'
        )}\nСегодня пришло:\n\n`;

        data?.docs
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

                paymentsText += `Пришло ${d.data().price}₽ от ${nick} ${
                    d.data().type === 'Robokassa' || !d.data().type
                        ? ''
                        : ` — ${d.data().type}`
                } \n`;
            });

        paymentsText += `\n\nЗа сегодня: ${
            numberWithSpaces(todaySum) || 0
        } ₽\n`;

        paymentsText += `Октябрь: ${
            numberWithSpaces(159245 + octoberSum) || 0
        } ₽\n`;

        paymentsText += `Ноябрь: ${
            numberWithSpaces(784195 + novemberSum) || 0
        } ₽\n`;

        paymentsText += `Декабрь: ${
            numberWithSpaces(1054187 + decemberSum) || 0
        } ₽\n`;

        paymentsText += `Январь: ${
            numberWithSpaces(537190 + januarySum) || 0
        } ₽\n`;

        paymentsText += `Февраль: ${numberWithSpaces(0 + febrarySum) || 0} ₽\n`;

        paymentsText += `Сбербанк Николай: ${
            numberWithSpaces(71350 + sberSum) || 0
        } ₽\n`;

        paymentsText += `Итого: ${
            numberWithSpaces(2534817 + totalSum) || 0
        } ₽\n`;

        return paymentsText;
    }, [data, date]);

    useEffect(() => {
        console.log(telegramReportText);
    }, [telegramReportText]);

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
                    Октябрь:{' '}
                    <b>{numberWithSpaces(159245 + octoberSum) || 0} ₽</b>
                </Text>
                <Text>
                    Ноябрь:{' '}
                    <b>{numberWithSpaces(784195 + novemberSum) || 0} ₽</b>
                </Text>
                <Text>
                    Декабрь:{' '}
                    <b>{numberWithSpaces(1054187 + decemberSum) || 0} ₽</b>
                </Text>
                <Text>
                    Январь:{' '}
                    <b>{numberWithSpaces(537190 + januarySum) || 0} ₽</b>
                </Text>

                <Text>
                    Февраль: <b>{numberWithSpaces(0 + febrarySum) || 0} ₽</b>
                </Text>

                <Text>
                    Сбербанк Николай:{' '}
                    <b>{numberWithSpaces(71350 + sberSum) || 0} ₽</b>
                </Text>

                <Text>
                    Итого: <b>{numberWithSpaces(2534817 + totalSum) || 0} ₽</b>
                </Text>
                <Heading mt={4} size='sm'>
                    Добавить вручную
                </Heading>
                <SimpleGrid columns={2} mt={2} gap={2}>
                    <Input
                        value={customUserId}
                        onChange={(e) => setCustomUserId(e.target.value)}
                        size={'md'}
                        placeholder='ID'
                    />
                    <Input
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        size={'md'}
                        placeholder='Сумма'
                    />
                    <Select
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value as any)}
                        size={'md'}
                    >
                        <option>Robokassa</option>
                        <option>Сбер Денис</option>
                        <option>Сбер Коля</option>
                        <option>Бонусы</option>
                    </Select>
                    <Button onClick={addPaymentHandler} colorScheme={'orange'}>
                        <AddIcon />
                    </Button>
                    <Button
                        gridColumn={'-1/1'}
                        onClick={async () => {
                            await navigator.clipboard.writeText(
                                telegramReportText
                            );
                        }}
                    >
                        Скопировать отчёт
                    </Button>
                </SimpleGrid>
            </Box>
        </VStack>
    );
};

export default PaymentsContent;
