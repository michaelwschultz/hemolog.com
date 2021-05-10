import React from 'react'
import {
  XYPlot,
  VerticalBarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
} from 'react-vis'
import useInfusions from 'lib/hooks/useInfusions'

export default function Chart(): JSX.Element {
  const { data, status, error } = useInfusions()

  if (!data) {
    return <></>
  }

  const bleeds = data.filter((entry) => entry.type === 'BLEED' && entry.date)
  const preventative = data.filter((entry) => entry.type === 'PREVENTATIVE')
  const prophy = data.filter((entry) => entry.type === 'PROPHY')

  console.log(bleeds)

  return (
    <XYPlot height={400} width={1024} animation xType='ordinal' stackBy='y'>
      {/* <VerticalGridLines />
        <HorizontalGridLines /> */}
      <VerticalBarSeries
        color='#FF062C'
        barWidth={0.5}
        data={[
          { x: 'Jan', y: 1 },
          { x: 'Feb', y: 1 },
          { x: 'Mar', y: 6 },
          { x: 'Apr', y: 8 },
          { x: 'May', y: 4 },
          { x: 'Jun', y: 1 },
          { x: 'Jul', y: 0 },
          { x: 'Aug', y: 0 },
          { x: 'Sep', y: 4 },
          { x: 'Oct', y: 1 },
          { x: 'Nov', y: 0 },
          { x: 'Dec', y: 0 },
        ]}
        style={{}}
      />
      <VerticalBarSeries
        color='#48BB78'
        barWidth={0.5}
        data={[
          { x: 'Jan', y: 1 },
          { x: 'Feb', y: 1 },
          { x: 'Mar', y: 6 },
          { x: 'Apr', y: 8 },
          { x: 'May', y: 4 },
          { x: 'Jun', y: 1 },
          { x: 'Jul', y: 0 },
          { x: 'Aug', y: 0 },
          { x: 'Sep', y: 4 },
          { x: 'Oct', y: 1 },
          { x: 'Nov', y: 0 },
          { x: 'Dec', y: 0 },
        ]}
        style={{}}
      />
      <VerticalBarSeries
        color='#0070F3'
        barWidth={0.5}
        data={[
          { x: 'Jan', y: 1 },
          { x: 'Feb', y: 1 },
          { x: 'Mar', y: 6 },
          { x: 'Apr', y: 8 },
          { x: 'May', y: 4 },
          { x: 'Jun', y: 1 },
          { x: 'Jul', y: 0 },
          { x: 'Aug', y: 0 },
          { x: 'Sep', y: 4 },
          { x: 'Oct', y: 1 },
          { x: 'Nov', y: 0 },
          { x: 'Dec', y: 0 },
        ]}
        style={{}}
      />
      <XAxis attr='x' attrAxis='y' orientation='bottom' />
      <YAxis attr='y' attrAxis='x' orientation='left' />
    </XYPlot>
  )
}
