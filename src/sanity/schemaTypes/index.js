import { marketIndex } from './marketIndex'
import { product } from './product'
import { insight } from './insight'
import { siteSettings } from './siteSettings'
import { sourceBookmark } from './sourceBookmark'
import hub from './hub'
import partner from './partner'
import solution from './solution'
import lead from './lead'

import eduPage from './eduPage'
import industryBenchmark from './industryBenchmark'
import { company } from './company'
import { emissionFactor } from './emissionFactor'
import { inventoryEntry } from './inventoryEntry'
import { systemTech } from './systemTech'
import { scope3Transaction } from './scope3Transaction'
import { supplierInvitation } from './supplierInvitation'
import saasTool from './saasTool'
import { vendor } from './vendor'
import { broker } from './broker'
import { brokerCase } from './brokerCase'
import { rfq } from './rfq'
import { knowledgeCategory } from './knowledgeCategory'
import { knowledgeArticle } from './knowledgeArticle'
import techObservation from './techObservation'

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
    lead,
    eduPage,
    industryBenchmark,
    company,
    emissionFactor,
    inventoryEntry,
    systemTech,
    scope3Transaction,
    supplierInvitation,
    saasTool,
    vendor,
    broker,
    brokerCase,
    rfq,
    knowledgeCategory,
    knowledgeArticle,
    techObservation
  ],
}
