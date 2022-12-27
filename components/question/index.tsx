import { Button, Card, Heading, Image, Text, VStack } from '@chakra-ui/react';
import {
    collection,
    doc,
    DocumentData,
    getFirestore,
    query,
    QueryDocumentSnapshot,
    where,
} from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { firebaseApp } from '../../pages/_app';
import AddAnswer from '../addAnswer';

const Question = () => {
    const router = useRouter();
    const { id } = router.query;

    const [question, loading, error] = useDocument(
        doc(getFirestore(firebaseApp), 'questions', String(id)),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [answers, answersLoading, answersError] = useCollection(
        query(
            collection(getFirestore(firebaseApp), 'answers'),
            where('question', '==', String(id))
        ),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const renderAnswer = useCallback(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
            if (doc.data().text) return <Text>{doc.data().text}</Text>;
            if (
                doc.data().url &&
                (doc.data().url.includes('.jpg') ||
                    doc.data().url.includes('.jpeg'))
            ) {
                return <Image src={doc.data().url}></Image>;
            } else if (doc.data().url && doc.data().url.includes('.ogg')) {
                return (
                    <audio controls>
                        <source src={doc.data().url}></source>
                    </audio>
                );
            }
        },
        []
    );

    return (
        <VStack maxW={600} m='auto' p={5}>
            <Link
                href='/'
                style={{
                    width: '100%',
                }}
            >
                <Button mr={'auto!'} size='sm'>
                    К списку вопросов
                </Button>
            </Link>
            <Heading fontSize='20px' mr='auto!'>
                Вопрос
            </Heading>
            <Card w='full' bg='white' p={4}>
                <Text>{question?.data()?.text}</Text>
            </Card>
            <Heading fontSize='20px' mr='auto!' mt={'8!'}>
                Ответы
            </Heading>
            {answers?.docs.length === 0 && (
                <Text mb={'4!'} mr={'auto!'} color={'gray.600'}>
                    Ответов нет, будьте первым
                </Text>
            )}
            {answers?.docs.map((doc, index) => {
                return (
                    <Card w='full' bg='white' p={4} key={doc.id}>
                        {renderAnswer(doc)}
                    </Card>
                );
            })}
            <AddAnswer />
        </VStack>
    );
};

export default Question;
