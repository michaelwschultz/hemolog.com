import React from 'react'
import RadialBarChart from '@bit/recharts.recharts.radial-bar-chart'
import RadialBar from '@bit/recharts.recharts.radial-bar'

// This chart shows number of infusions by month going from inside to
// out of the circle. The first data entry just sets the max for what 100%
// represents. This chart doesn't use real data. Using the date key
// this could pull data from the /api/infusions endpoint.

const data = [
  {
    name: 'Max',
    infusions: 12,
    fill: 'none',
  },
  {
    name: 'Jan',
    infusions: 1,
    fill: '#8884d8',
  },
  {
    name: 'Feb',
    infusions: 3,
    fill: '#83a6ed',
  },
  {
    name: 'March',
    infusions: 3,
    fill: '#8dd1e1',
  },
  {
    name: 'Apr',
    infusions: 0,
    fill: '#82ca9d',
  },
  {
    name: 'May',
    infusions: 2,
    fill: '#a4de6c',
  },
  {
    name: 'Jun',
    infusions: 5,
    fill: '#d0ed57',
  },
  {
    name: 'July',
    infusions: 3,
    fill: '#ffc658',
  },
  {
    name: 'Aug',
    infusions: 3,
    fill: '#8884d8',
  },
  {
    name: 'Sep',
    infusions: 2,
    fill: '#83a6ed',
  },
  {
    name: 'Oct',
    infusions: 4,
    fill: '#8dd1e1',
  },
  {
    name: 'Nov',
    infusions: 0,
    fill: '#a4de6c',
  },
  {
    name: 'Dec',
    infusions: 0,
    fill: '#d0ed57',
  },
]

export default function Chart(): JSX.Element {
  return (
    <RadialBarChart
      width={500}
      height={300}
      cx={150}
      cy={150}
      innerRadius={80}
      outerRadius={140}
      barSize={4}
      data={data}
    >
      <RadialBar
        minAngle={15}
        // label={{ position: 'insideStart', fill: '#fff' }}
        background
        clockWise // this doesn't seem to work
        dataKey='infusions'
      />
    </RadialBarChart>
  )
}
