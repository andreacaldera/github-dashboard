import React from 'react'
import { ProjectDashboard } from './project-dashboard'

const App: React.FunctionComponent = () => {
  return (
    <div className="App">
      <ProjectDashboard organisation="andreacaldera" project="eastendcc-www" />
      <ProjectDashboard organisation="andreacaldera" project="eastendcc-api" />
    </div>
  )
}

export default App
