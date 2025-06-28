import React from 'react'
import FeatureAssistants from './_components/FeatureAssistants'
import History from './_components/History'
import Feedback from './_components/Feedback'

function Dashboard() {
  return (
    <div>
      <FeatureAssistants />
      <div className="flex justify-center w-full mt-20">
        <History />
      </div>
    </div>
  )
}

export default Dashboard
