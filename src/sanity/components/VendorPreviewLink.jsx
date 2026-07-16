import { Card, Text, Flex } from '@sanity/ui'
import { useFormValue } from 'sanity'

export function VendorPreviewLink() {
  const slug = useFormValue(['slug', 'current'])
  const url = slug ? `/suppliers/${slug}` : null

  return (
    <Card padding={4} radius={2} shadow={1} tone="primary">
      <Flex align="center" justify="space-between">
        <Text size={2} weight="bold">🔍 企業專屬展示頁面</Text>
        {url ? (
          <Text size={2}>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
              開啟前台預覽 ↗
            </a>
          </Text>
        ) : (
          <Text size={2} muted>請先產生上方的網址代號 (Slug)</Text>
        )}
      </Flex>
    </Card>
  )
}
