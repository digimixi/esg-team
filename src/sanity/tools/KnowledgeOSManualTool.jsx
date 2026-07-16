import React from 'react'
import { Box, Card, Heading, Text, Stack } from '@sanity/ui'

export function KnowledgeOSManualTool() {
  return (
    <Box padding={5} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Stack space={5}>
        <Stack space={3}>
          <Heading as="h1" size={5}>📚 Knowledge OS (知識中台) 操作手冊</Heading>
          <Text size={3} muted>
            所有教戰手冊與知識庫內容的建立與管理，都將直接在此進行。系統具備「動態欄位」技術，會根據您選擇的格式自動切換填寫項目。
          </Text>
        </Stack>
        
        <Card padding={4} radius={3} tone="default" border>
          <Stack space={4}>
            <Heading as="h2" size={4}>Step 1：建立「知識分類」 (Category)</Heading>
            <Text size={2}>首先建立分類，這樣知識卡片才能有歸屬：</Text>
            <Text size={2}>
              <ol style={{ paddingLeft: '1.5rem', margin: 0, lineHeight: 1.8 }}>
                <li>在左側選單找到 <strong>知識分類 (Knowledge Category)</strong>。</li>
                <li>點擊右上角的鉛筆圖示新增。</li>
                <li>填寫 <strong>分類名稱</strong> (例如：增碳劑推廣指南)。</li>
                <li>點擊網址代號旁的 <code>Generate</code> 按鈕。</li>
                <li><strong>可見角色</strong> 勾選 <code>協作夥伴 (Partner)</code>。</li>
                <li>點擊右下角的 <strong>Publish</strong>。</li>
              </ol>
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} tone="default" border>
          <Stack space={4}>
            <Heading as="h2" size={4}>Step 2：建立「知識卡片」 (Article)</Heading>
            <Text size={2}>
              <ol style={{ paddingLeft: '1.5rem', margin: 0, lineHeight: 1.8 }}>
                <li>在左側選單找到 <strong>知識卡片 (Knowledge Article)</strong>，點擊新增。</li>
                <li>填寫 <strong>卡片標題</strong> (例如：增碳劑破冰話術)。</li>
                <li><strong>所屬分類</strong> 選擇您剛剛建立的分類。</li>
                <li>在 <strong>內容格式</strong> 選擇：
                  <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                    <li><strong>教戰卡 (Playbook)</strong>：下方會自動展開「痛點」、「安全話術」、「禁止承諾」等專屬填寫框。</li>
                    <li><strong>問答 (FAQ)</strong>：下方會展開「常見問題」與「安全回答」。</li>
                    <li><strong>標準文章 (Standard)</strong>：下方會展開可自由排版的圖文編輯器。</li>
                  </ul>
                </li>
                <li>依據欄位提示貼上內容。</li>
                <li>點擊右下角的 <strong>Publish</strong>。</li>
              </ol>
            </Text>
          </Stack>
        </Card>

        <Card padding={4} radius={3} tone="positive" border>
          <Stack space={4}>
            <Heading as="h2" size={4}>🚀 Step 3：前台立刻生效</Heading>
            <Text size={2}>
              只要您在後台點下 Publish，前端的 Partner Academy (教戰手冊) 就會瞬間同步更新，長出精美的紅綠色警示卡片！
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}
