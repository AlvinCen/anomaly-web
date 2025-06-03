import React from 'react'
import { CChart } from '@coreui/react-chartjs'

const DoughnutChartQty = ({ data }) => {
  // Sort data berdasarkan qty terbesar
  const sorted = [...data].sort((a, b) => b.qty - a.qty)

  // Ambil hanya item dengan qty > 0
  const filtered = sorted.filter(item => item.qty > 0)

  const labels = filtered.map(item => item.name)
  const quantities = filtered.map(item => item.qty)

  // Optional: buat warna otomatis
  const backgroundColors = filtered.map((_, i) =>
    `hsl(${(i * 360) / filtered.length}, 70%, 60%)`
  )

  return (
    <CChart
      type="doughnut"
      data={{
        labels: labels,
        datasets: [
          {
            label: 'Qty',
            backgroundColor: backgroundColors,
            data: quantities,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      }}
    />
  )
}

export default DoughnutChartQty