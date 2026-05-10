'use client'
import React from 'react'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\studio\[[...tool]]\page.jsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'
import {zhHantLocale} from '@sanity/locale-zh-hant'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    zhHantLocale(), // 啟用繁體中文語系
  ],
  tools: (prev) => [
    ...prev,
    {
      name: 'data-ingestion',
      title: '📡 數據監控',
      component: () => (
        <div style={{ height: '100%', width: '100%' }}>
          <iframe 
            src="/admin/sources" 
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      ),
    }
  ]
})
