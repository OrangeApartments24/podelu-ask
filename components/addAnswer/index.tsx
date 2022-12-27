import {
    Button,
    Card,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Textarea,
    VStack,
} from '@chakra-ui/react';
import { setDoc, doc, getFirestore, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { firebaseApp } from '../../pages/_app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddAnswer = () => {
    const router = useRouter();
    const { id } = router.query;
    const [text, setText] = useState('');
    const [file, setFile] = useState<any>(null);

    const addQuestionHandler = useCallback(async () => {
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
                url: fileURL || '',
                text,
                created_at: Timestamp.fromDate(new Date()),
            }
        );
        setText('');
    }, [text, id, file]);

    return (
        <Card bg='white' p={4} my={'2!'} w='full'>
            <VStack>
                <Heading size={'md'} mr='auto'>
                    {' '}
                    Добавить ответ
                </Heading>
                <FormControl>
                    <FormLabel>Текст ответа</FormLabel>
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Введите ответ'
                    ></Textarea>
                </FormControl>
                <FormControl>
                    <FormLabel>Прикрепить файл</FormLabel>
                    <Input
                        onChange={(e) => setFile(e.target.files as any)}
                        type={'file'}
                    />
                </FormControl>
                <Button
                    mr='auto!'
                    colorScheme={'blue'}
                    onClick={addQuestionHandler}
                >
                    Добавить
                </Button>
            </VStack>
        </Card>
    );
};

export default AddAnswer;
