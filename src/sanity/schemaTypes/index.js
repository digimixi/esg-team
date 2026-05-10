import { marketIndex } from './marketIndex'
import { product } from './product'
import { insight } from './insight'
import { siteSettings } from './siteSettings'
import { sourceBookmark } from './sourceBookmark'
import hub from './hub'
import partner from './partner'

export const schema = {
  types: [siteSettings, hub, partner, marketIndex, product, insight, sourceBookmark],
}
