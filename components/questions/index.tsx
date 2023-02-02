import {
    Avatar,
    Button,
    Card,
    Divider,
    HStack,
    Text,
    Textarea,
    VStack,
} from '@chakra-ui/react';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    Timestamp,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firebaseApp } from '../../pages/_app';
import moment from 'moment';

import Link from 'next/link';
import { useRouter } from 'next/router';

const Questions = () => {
    const [data, loading, error] = useCollection(
        collection(getFirestore(firebaseApp), 'questions'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const router = useRouter();
    const { name } = router.query;

    const [questionText, setQuestionText] = useState('');

    const questionChangeHandler = useCallback(
        (e: any) => {
            setQuestionText(e.target.value);
        },
        [questionText]
    );

    const addQuestionHandler = useCallback(async () => {
        await setDoc(
            doc(getFirestore(firebaseApp), 'questions', crypto.randomUUID()),
            {
                text: questionText,
                created_at: Timestamp.fromDate(new Date()),
            }
        );
        setQuestionText('');
    }, [questionText]);

    const renderQuestions = useMemo(() => {
        if (!data?.docs) return null;

        return (
            data.docs
                .sort((a, b) => {
                    if (a.data().created_at < b.data().created_at) return 1;
                    if (a.data().created_at === b.data().created_at) return 0;
                    if (a.data().created_at > b.data().created_at) return -1;
                    return 0;
                })
                // .filter((doc) => doc.data().category === name)
                .map((doc, index) => {
                    return (
                        // <Link
                        //     href={`/q/${doc.id}`}
                        //     key={doc.id}
                        //     style={{
                        //         width: '100%',
                        //     }}
                        // >
                        <Card
                            w='full'
                            bg='white'
                            p={4}
                            onClick={() => {
                                window.open(`/q/${doc.id}`, '_blank');
                            }}
                            _hover={{
                                cursor: 'pointer',
                                bg: 'gray.50',
                            }}
                        >
                            <VStack alignItems='flex-start'>
                                <HStack>
                                    <Avatar size='sm'></Avatar>
                                </HStack>
                                <Text
                                    whiteSpace={'pre-wrap'}
                                    wordBreak='break-word'
                                >
                                    {doc.data().text}
                                </Text>
                                <HStack>
                                    <Text fontSize='sm' opacity={0.5}>
                                        {moment
                                            .unix(doc.data().created_at)
                                            .format('DD MMMM YYYY')}
                                    </Text>
                                    {doc.data().category && (
                                        <Text fontSize='sm' opacity={0.5}>
                                            {doc.data().category}
                                        </Text>
                                    )}
                                </HStack>
                            </VStack>
                        </Card>
                        // </Link>
                    );
                })
        );
    }, [data, name]);

    return (
        <VStack minH={'100vh'} p={4} maxW={600} m='auto'>
            <Link
                href='/'
                style={{
                    width: '100%',
                }}
            >
                <Button mr={'auto!'} size='sm'>
                    К списку категорий
                </Button>
            </Link>
            {renderQuestions}
            <Divider mt={'5!'} />
            <Textarea
                onChange={questionChangeHandler}
                placeholder='Введите вопрос'
                bg='white'
                value={questionText}
            />
            <Button
                onClick={addQuestionHandler}
                w='full'
                colorScheme={'orange'}
            >
                Задать вопрос
            </Button>
        </VStack>
    );
};

export default Questions;
