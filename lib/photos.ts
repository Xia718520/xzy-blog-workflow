export interface Photo {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn?: string
  src: string
  width: number
  height: number
  date: string
  location?: string
  camera?: string
}

export const photos: Photo[] = [
  {
    id: 'wechat-20261112-01',
    title: '微信照片 01',
    titleEn: 'WeChat Photo 01',
    description: '2026-11-12 从微信保存的个人照片。',
    descriptionEn: 'Personal photo saved from WeChat on 2026-11-12.',
    src: '/images/photos/wechat-20261112-01.jpg',
    width: 1086,
    height: 1448,
    date: '2026-11-12',
  },
  {
    id: 'wechat-20261112-02',
    title: '微信照片 02',
    titleEn: 'WeChat Photo 02',
    description: '2026-11-12 从微信保存的个人照片。',
    descriptionEn: 'Personal photo saved from WeChat on 2026-11-12.',
    src: '/images/photos/wechat-20261112-02.jpg',
    width: 1280,
    height: 1707,
    date: '2026-11-12',
  },
  {
    id: 'wechat-20261112-03',
    title: '微信照片 03',
    titleEn: 'WeChat Photo 03',
    description: '2026-11-12 从微信保存的个人照片。',
    descriptionEn: 'Personal photo saved from WeChat on 2026-11-12.',
    src: '/images/photos/wechat-20261112-03.jpg',
    width: 1370,
    height: 1280,
    date: '2026-11-12',
  },
]
