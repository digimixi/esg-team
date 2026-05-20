import { marketIndex } from './marketIndex'
import { product } from './product'
import { insight } from './insight'
import { siteSettings } from './siteSettings'
import { sourceBookmark } from './sourceBookmark'
import hub from './hub'
import partner from './partner'
import solution from './solution'

import eduPage from './eduPage'
import industryBenchmark from './industryBenchmark'
import { company } from './company'
import { emissionFactor } from './emissionFactor'
import { inventoryEntry } from './inventoryEntry'
import { systemTech } from './systemTech'
import { scope3Transaction } from './scope3Transaction'

export const schema = {
  types: [
    siteSettings, 
    hub, 
    partner, 
    marketIndex, 
    product, 
    insight, 
    sourceBookmark, 
    solution,
    eduPage,
    industryBenchmark,
    company,
    emissionFactor,
    inventoryEntry,
    systemTech,
    scope3Transaction
  ],
}
