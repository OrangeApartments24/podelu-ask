import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { signIn } from '../store/slice/basicSlice';

const LoginPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { loginCode } = router.query;

    useEffect(() => {
        if (!loginCode) return;

        if (loginCode === 'sda7fity12iu34yuaskdjf') {
            dispatch(signIn());
        }
        router.replace('/');
    }, [loginCode]);

    return null;
};

export default LoginPage;
