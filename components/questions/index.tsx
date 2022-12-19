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

        return data.docs.map((doc, index) => {
            return (
                <Card w='full' bg='white' key={doc.id} p={4}>
                    <VStack alignItems='flex-start'>
                        <HStack>
                            <Avatar size='sm'></Avatar>
                        </HStack>
                        <Text>{doc.data().text}</Text>
                        <Text fontSize='sm' opacity={0.5}>
                            {moment
                                .unix(doc.data().created_at.seconds)
                                .format('DD MMMM YYYY')}
                        </Text>
                    </VStack>
                </Card>
            );
        });
    }, [data]);

    return (
        <VStack bg='gray.100' minH={'100vh'} p={4}>
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
