import { v4 as uuid } from 'uuid'
import type { Block, BlockType } from '../types'

export function createBlock(type: BlockType): Block {
  if (type === 'hero') {
    return {
      id: uuid(),
      type,
      title: 'Hero title',
      subtitle: 'Subtitle',
      buttonText: 'Button',
      buttonUrl: '#',
      backgroundColor: '#e5e7eb',
    }
  }

  if (type === 'text') {
    return {
      id: uuid(),
      type,
      title: 'Text title',
      body: 'Text body',
    }
  }

  return {
    id: uuid(),
    type: 'image',
    imageUrl: 'https://picsum.photos/800/400',
    caption: 'Caption',
  }
}
