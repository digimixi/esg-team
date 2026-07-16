import React, { useState, useEffect, useCallback } from 'react';
import { useClient } from 'sanity';
import { Card, Stack, Text, Checkbox, Flex, Box, TextInput } from '@sanity/ui';
import { set, unset } from 'sanity';
import imageUrlBuilder from '@sanity/image-url';

export function ProductCheckboxList(props) {
  const { value = [], onChange } = props;
  const client = useClient({ apiVersion: '2023-05-01' });
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  // 初始化圖片產生器
  const builder = imageUrlBuilder(client);
  function urlFor(source) {
    return builder.image(source);
  }

  // 取得所有產品資料 (抓取原生的 image 結構，避免 GROQ ->url 解析失敗)
  useEffect(() => {
    client.fetch(`*[_type == "product" && !(_id in path("drafts.**"))]{_id, title, subtitle, image} | order(title asc)`)
      .then(res => setProducts(res));
  }, [client]);

  const selectedIds = value.map(item => item._ref);

  const handleToggle = useCallback((productId) => {
    const isSelected = selectedIds.includes(productId);
    
    let newValue;
    if (isSelected) {
      newValue = value.filter(item => item._ref !== productId);
    } else {
      // 在陣列中新增一筆 reference，必須包含 _key
      newValue = [...value, { _type: 'reference', _ref: productId, _key: productId }];
    }

    if (newValue.length === 0) {
      onChange(unset());
    } else {
      onChange(set(newValue));
    }
  }, [value, selectedIds, onChange]);

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.subtitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card padding={4} border radius={2}>
      <Stack space={4}>
        <TextInput 
          placeholder="🔍 搜尋產品名稱..." 
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Box style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
          <Stack space={4}>
            {filteredProducts.map(product => (
              <Flex align="center" key={product._id} style={{ gap: '12px', padding: '8px', borderRadius: '6px', ':hover': { backgroundColor: '#f9f9f9' } }}>
                <Checkbox 
                  id={product._id} 
                  checked={selectedIds.includes(product._id)}
                  onChange={() => handleToggle(product._id)}
                  style={{ cursor: 'pointer' }}
                />
                
                {product.image && product.image.asset ? (
                  <Box style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                    <img src={urlFor(product.image).width(80).height(80).url()} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ) : (
                  <Box style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Text size={1} muted>無圖</Text>
                  </Box>
                )}

                <Box flex={1}>
                  <label htmlFor={product._id} style={{ display: 'block', cursor: 'pointer', userSelect: 'none' }}>
                    <Text size={2} weight="medium">{product.title}</Text>
                    {product.subtitle && (
                      <Text size={1} muted style={{ marginTop: '4px' }}>{product.subtitle}</Text>
                    )}
                  </label>
                </Box>
              </Flex>
            ))}
            {filteredProducts.length === 0 && (
              <Text size={2} muted align="center" style={{ padding: '20px' }}>
                找不到符合的產品
              </Text>
            )}
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
