import {
    Button,
    Card,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Text,
    Textarea,
    VStack,
} from '@chakra-ui/react';
import { setDoc, doc, getFirestore, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { firebaseApp } from '../../pages/_app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AttachmentIcon } from '@chakra-ui/icons';

const AddAnswer = () => {
    const router = useRouter();
    const { id } = router.query;
    const [text, setText] = useState('');
    const [file, setFile] = useState<any>(null);
    const [isLoading, setLoading] = useState(false);

    const addQuestionHandler = useCallback(async () => {
        setLoading(true);
        let fileURL;
        if (file && file[0]) {
            const extanstion = file[0].name.split('.').slice(-1).pop();
            const storage = getStorage();
            const storageRef = ref(
                storage,
                `answers/${crypto.randomUUID()}.${extanstion}`
            );
            const url = await uploadBytes(storageRef, file[0]).then(
                async (snapshot) => {
                    return await getDownloadURL(snapshot.ref).then(
                        (url) => url
                    );
                }
            );
            fileURL = url;
        }

        if (!text && !fileURL) return;
        await setDoc(
            doc(getFirestore(firebaseApp), 'answers', crypto.randomUUID()),
            {
                question: id,
                filename: file ? file[0]?.name : '',
                url: fileURL || '',
                text,
                created_at: Timestamp.fromDate(new Date()),
            }
        );
        setLoading(false);
        setText('');
        setFile(null);
    }, [text, id, file]);

    return (
        <Card bg='white' p={4} my={'2!'} w='full'>
            <VStack>
                <FormControl>
                    <FormLabel>Текст ответа</FormLabel>
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Введите ответ'
                    ></Textarea>
                </FormControl>
                <HStack w='full'>
                    <VStack spacing={0.5}>
                        <FormControl
                            width={'max-content'}
                            mr='auto'
                            cursor={'pointer'}
                            _hover={{
                                opacity: 0.5,
                            }}
                        >
                            <FormLabel
                                htmlFor='answer-attachment-file'
                                borderWidth={1}
                                borderColor='gray.300'
                                p={2}
                                px={4}
                                m={'0!'}
                                borderRadius='lg'
                                textAlign={'center'}
                            >
                                <HStack>
                                    <AttachmentIcon />
                                    <Text opacity={0.5} fontWeight='300'>
                                        Прикрепить файл
                                    </Text>
                                </HStack>
                            </FormLabel>
                            <Input
                                position={'absolute'}
                                visibility='hidden'
                                id='answer-attachment-file'
                                onChange={(e) => setFile(e.target.files as any)}
                                type={'file'}
                            />
                        </FormControl>
                        {file && file[0] && (
                            <Text fontSize={'xs'}>{file[0].name}</Text>
                        )}
                    </VStack>
                    <Button
                        colorScheme={'blue'}
                        onClick={addQuestionHandler}
                        px={7}
                        mb={'auto!'}
                        ml='auto!'
                    >
                        Отправить
                    </Button>
                </HStack>
            </VStack>
        </Card>
    );
};

export default AddAnswer;
