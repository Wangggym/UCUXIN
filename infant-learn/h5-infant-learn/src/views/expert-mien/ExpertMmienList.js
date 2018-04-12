import React from 'react'
import { trainPlan } from '../../api'
import { LongListWrappedComp, LecturerListItem } from '../../components'
// import {hideMenu} from "../../utils/showAppMenu";

const ExpertMmienList = LongListWrappedComp(trainPlan.getLecturerPages, { st: 0 })(LecturerListItem)
class Comp extends React.Component {
    render() {
        return (
            <ExpertMmienList useBodyScroll />
        )
    }
}
export default Comp
