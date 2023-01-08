import { Card, Grid, Image, SimpleGrid, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { text } from 'stream/consumers';
import { categoriesList } from '../../constants/categories';

const Categories = () => {
    const renderCategories = useMemo(() => {
        return categoriesList.map((c) => {
            return (
                <Link href={`/category?name=${c.name}`}>
                    <Card
                        align={'center'}
                        justify='center'
                        bg='white'
                        key={c.name}
                        overflow='hidden'
                    >
                        <Image
                            src={c.icon}
                            objectFit='contain'
                            width={'100%'}
                            height={200}
                            bg='orange.50'
                            p={4}
                        />
                        <Text p={2}>{c.name}</Text>
                    </Card>
                </Link>
            );
        });
    }, [categoriesList]);

    return (
        <Grid
            gap={5}
            p={10}
            maxW={600}
            m='auto'
            gridTemplateColumns='1fr 1fr'
            alignItems='flex-start'
        >
            {renderCategories}
        </Grid>
    );
};

export default Categories;
