import { CloseIcon, DownloadIcon } from '@chakra-ui/icons';
import {
    Button,
    Card,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Image,
    Select,
    Text,
    VStack,
} from '@chakra-ui/react';
import {
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getFirestore,
    query,
    QueryDocumentSnapshot,
    updateDoc,
    where,
} from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { updateDo } from 'typescript';
import { categoriesList } from '../../constants/categories';
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
                doc.data().extension &&
                (doc.data().extension.includes('.jpg') ||
                    doc.data().extension.includes('.jpeg'))
            ) {
                return <Image src={doc.data().url}></Image>;
            } else if (
                doc.data().extension &&
                doc.data().extension.includes('oga')
            ) {
                return (
                    <audio controls>
                        <source src={doc.data().url}></source>
                    </audio>
                );
            } else if (
                doc.data().extension &&
                doc.data().extension.includes('mp4')
            ) {
                return (
                    <video
                        style={{
                            maxHeight: '60vh',
                        }}
                        controls
                    >
                        <source src={doc.data().url}></source>
                    </video>
                );
            } else if (doc.data) {
                return (
                    <Button
                        fontSize={'sm'}
                        fontWeight={300}
                        bg='white'
                        borderColor={'gray.100'}
                        borderWidth={1}
                        mr='auto!'
                    >
                        <a href={doc.data().url} target='_blank'>
                            <HStack>
                                <Text>{doc.data().filename}</Text>
                                <DownloadIcon />
                            </HStack>
                        </a>
                    </Button>
                );
            }
        },
        []
    );

    const renderCategories = useMemo(() => {
        return ['Не выбрано']
            .concat(categoriesList.map((c) => c.name))
            .map((c, i) => {
                return <option>{c}</option>;
            });
    }, [categoriesList]);

    const changeCategoryHandler = useCallback(
        async (e: any) => {
            updateDoc(doc(getFirestore(firebaseApp), 'questions', String(id)), {
                category: e.target.value !== 'Не выбрано' ? e.target.value : '',
            });
        },
        [id]
    );

    const deleteAnswerHandler = useCallback((id: string) => {
        deleteDoc(doc(getFirestore(firebaseApp), 'answers', id));
    }, []);

    return (
        <VStack maxW={600} m='auto' p={5}>
            <Button
                mr={'auto!'}
                size='sm'
                onClick={() => {
                    window.history.go(-1);
                }}
            >
                К списку вопросов
            </Button>
            <Heading fontSize='20px' mr='auto!'>
                Вопрос
            </Heading>
            <Card w='full' bg='white' p={4}>
                <Text>{question?.data()?.text}</Text>
            </Card>
            <Card p={2} bg='white' w='full'>
                <FormControl>
                    <FormLabel>Категория</FormLabel>
                    <Select onChange={changeCategoryHandler}>
                        {renderCategories}
                    </Select>
                </FormControl>
            </Card>
            <Heading fontSize='20px' mr='auto!' mt={'8!'}>
                Ответы
            </Heading>
            {answers?.docs.length === 0 && (
                <Text mb={'4!'} mr={'auto!'} color={'gray.600'}>
                    Ответов нет, будьте первым
                </Text>
            )}
            {answers?.docs
                .sort((a, b) => {
                    if (a.data().created_at < b.data().created_at) return -1;
                    if (a.data().created_at === b.data().created_at) return 0;
                    if (a.data().created_at > b.data().created_at) return 1;
                    return 0;
                })
                .filter((doc) => doc.data().text || doc.data().url)
                .map((doc, index) => {
                    return (
                        <Card
                            w='full'
                            bg='white'
                            p={4}
                            key={doc.id}
                            position='relative'
                        >
                            {/* <CloseIcon
                            cursor='pointer'
                            _hover={{
                                bg: 'gray.400',
                            }}
                            onClick={() => deleteAnswerHandler(doc.id)}
                            position={'absolute'}
                            top='-2px'
                            right='-2px'
                            w={6}
                            h={6}
                            color='white'
                            borderRadius='lg'
                            p={1.5}
                            bg='gray.500'
                        /> */}
                            {renderAnswer(doc)}
                        </Card>
                    );
                })}
            <AddAnswer />
        </VStack>
    );
};

export default Question;
