import React from 'react'
import { trainPlan } from '../../../api'
import { LecturerListItem,LongListWrappedComp } from '../../../components'
export default LongListWrappedComp(trainPlan.getLecturerPages)(LecturerListItem)
