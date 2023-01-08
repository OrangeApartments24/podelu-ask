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
import 'moment/locale/ru';
import Link from 'next/link';

const Questions = () => {
    const [data, loading, error] = useCollection(
        collection(getFirestore(firebaseApp), 'questions'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

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

        return data.docs
            .sort((a, b) => {
                if (a.data().created_at < b.data().created_at) return 1;
                if (a.data().created_at === b.data().created_at) return 0;
                if (a.data().created_at > b.data().created_at) return -1;
                return 0;
            })
            .map((doc, index) => {
                return (
                    <Link
                        href={`/q/${doc.id}`}
                        key={doc.id}
                        style={{
                            width: '100%',
                        }}
                    >
                        <Card
                            w='full'
                            bg='white'
                            key={doc.id}
                            p={4}
                            _hover={{
                                cursor: 'pointer',
                                bg: 'gray.50',
                            }}
                        >
                            <VStack alignItems='flex-start'>
                                <HStack>
                                    <Avatar size='sm'></Avatar>
                                </HStack>
                                <Text>{doc.data().text}</Text>
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
                    </Link>
                );
            });
    }, [data]);

    return (
        <VStack minH={'100vh'} p={4} maxW={600} m='auto'>
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
