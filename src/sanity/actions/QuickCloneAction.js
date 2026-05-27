import { useState, useCallback } from 'react'
import { useClient } from 'sanity'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'sanity/router'

export function QuickCloneAction(props) {
  const { type, draft, published, id } = props
  const [isCloning, setIsCloning] = useState(false)
  const client = useClient({ apiVersion: '2024-01-01' })
  const router = useRouter()

  // Only apply to product
  if (type !== 'product') {
    return null
  }

  const doc = draft || published

  // If there's no document to copy (e.g., brand new unsaved doc), disable button
  if (!doc) {
    return null
  }

  return {
    label: isCloning ? '複製中...' : '🌟 一鍵快速複製 (Clone)',
    onHandle: async () => {
      setIsCloning(true)
      try {
        const newId = uuidv4()
        
        // Remove system fields to ensure it creates a fresh document
        const { _id, _createdAt, _updatedAt, _rev, slug, title, ...docData } = doc
        
        // Create the new document as a draft
        const newDoc = {
          ...docData,
          _id: `drafts.${newId}`,
          _type: type,
          title: `${title || '無標題'} - (複製副本)`,
          // We intentionally omit slug so they are forced to generate a new one
        }

        await client.create(newDoc)
        
        // Manually force the browser to navigate to the new document
        window.location.href = `/studio/structure/industrial_data_center;product;${newId}`
        
      } catch (err) {
        console.error("複製失敗", err)
      } finally {
        setIsCloning(false)
      }
    }
  }
}
