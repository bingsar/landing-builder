export type BlockType = 'hero' | 'text' | 'image'

export type HeroBlock = {
  id: string
  type: 'hero'
  title: string
  subtitle: string
  buttonText: string
  buttonUrl: string
  backgroundColor: string
}

export type TextBlock = {
  id: string
  type: 'text'
  title: string
  body: string
}

export type ImageBlock = {
  id: string
  type: 'image'
  imageUrl: string
  caption: string
}

export type Block = HeroBlock | TextBlock | ImageBlock

export type PageDoc = {
  id?: number
  slug?: string
  title?: string
  blocks: Block[]
}
