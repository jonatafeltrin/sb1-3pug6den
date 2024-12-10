import { Skeleton } from 'native-base';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { Bar, BarGreenLine, BarGreyLine, Card } from './styles';

import { maskValueBRL } from '@/utils/maskValue';
interface ICategory {
  category: any;
}

const Category = ({ category }: ICategory) => {
  return (
    <Card>
      <Skeleton.Text isLoaded={category?.category?.current_category} lines={8}>
        <Text style={{ fontWeight: '700', fontSize: 24, color: '#121A78' }}>
          Categoria {category?.category?.current_category}
        </Text>

        <Text style={{ fontWeight: '600', fontSize: 18, color: '#4B4B4B', marginTop: 24 }}>
          Próxima categoria
        </Text>
        <Text style={{ fontWeight: '600', fontSize: 14, color: '#393939', marginTop: 20 }}>
          Pedidos Faturados
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <Text style={{ fontWeight: '400', fontSize: 16, color: '#757575' }}>
            Faturamento atual
          </Text>
          <Text style={{ fontWeight: '400', fontSize: 16, color: '#757575' }}>Próximo nível</Text>
        </View>
        {category?.statistic?.invoice && <ProgressLine category={category?.statistic?.invoice} />}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <Text style={{ fontWeight: '600', fontSize: 14, color: '#4D4D4D' }}>
            {category?.statistic?.invoice?.current == 0
              ? 'R$ 0,00'
              : maskValueBRL(category?.statistic?.invoice?.current)}
          </Text>
          <Text style={{ fontWeight: '600', fontSize: 14, color: '#4D4D4D' }}>
            {maskValueBRL(category?.statistic?.invoice?.toNextCategory)}
          </Text>
        </View>
        <Text style={{ fontWeight: '600', fontSize: 14, color: '#4D4D4D', marginTop: 20 }}>
          Pedidos por clientes diferentes
        </Text>
        <Text style={{ fontWeight: '400', fontSize: 14, color: '#727272', marginTop: 12 }}>
          {category?.statistic?.orders?.current == null ? 0 : category?.statistic?.orders?.current}{' '}
          de{' '}
          {category?.statistic?.orders?.toNextCategory == null
            ? 0
            : category?.statistic?.orders?.toNextCategory}
        </Text>
        {category?.statistic?.orders && <ProgressBar orders={category?.statistic?.orders} />}
      </Skeleton.Text>
    </Card>
  );
};

export default Category;

function ProgressLine({ category }: any) {
  const { current, toNextCategory } = category;

  const convergencePercentage = (current / toNextCategory) * 100;

  return (
    <View>
      {category?.current < 0 ? (
        <BarGreyLine />
      ) : (
        <View style={{ flexDirection: 'row', overflow: 'hidden' }}>
          <BarGreenLine width={convergencePercentage} />
          <BarGreyLine />
        </View>
      )}
    </View>
  );
}

function ProgressBar({ orders }: any) {
  const total = orders?.toNextCategory;
  const [boox, setBoox] = useState<{ background: string }[]>([]);

  useEffect(() => {
    const box: any = [];
    for (let i = 0; i < total; i++) {
      if (i <= total - 1) {
        if (i <= orders?.current - 1) {
          box.push({ background: '#6ED8AA' });
        } else {
          box.push({ background: '#333' });
        }
      }
    }
    setBoox(box);
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 4,
        marginBottom: 8,
      }}>
      {boox?.map((item: any, index) => {
        if (index <= total) {
          return <Bar key={index} background={item.background} />;
        }
      })}
    </View>
  );
}
