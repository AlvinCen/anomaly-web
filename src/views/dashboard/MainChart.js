import React, { useEffect, useRef, useState } from 'react'

import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import moment from 'moment'

const MainChart = ({ activeBtn, data, startDate, endDate }) => {
  const chartRef = useRef(null)
  const [label, setLabel] = useState([])

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef])

  // useEffect(() => {
  //   if (activeBtn === 'Day') {
  //     const start = moment(moment(startDate), 'YYYY-MM-DD');
  //     const end = moment(moment(endDate), 'YYYY-MM-DD');
  //     const days = [];
  //     const cash = [];
  //     const qris = [];
  //     const voit = [];
  //     const promo = [];

  //     if (moment(start).isValid() && moment(end).isValid()) {
  //       while (start.isSameOrBefore(end, 'days')) {
  //         var tmpCash = data.filter((data) => {
  //           return moment(start).isSame(moment(data?.createdAt), "days") && (data?.paymentMethod === "cash" || data?.paymentMethod === undefined)
  //         }).reduce((total, data) => {
  //           return total + data?.harga
  //         }, 0)
  //         var tmpQris = data.filter((data) => {
  //           return moment(start).isSame(moment(data?.createdAt), "days") && data?.paymentMethod === "qris"
  //         }).reduce((total, data) => {
  //           return total + data?.harga
  //         }, 0)
  //         var tmpVoid = data.filter((data) => {
  //           return moment(start).isSame(moment(data?.createdAt), "days")
  //         }).reduce((total, data) => {
  //           return Number(total) + (data?.hargaNormal && data?.hargaVoid ? (Number(data?.hargaNormal) - Number(data?.hargaVoid)) : 0)
  //         }, 0)
  //         var tmpPromo = data
  //           .flatMap((data) => data?.item.filter((item) => item?.isPromo && moment(start).isSame(moment(data?.createdAt), "days")))
  //           .reduce((total, item) => {
  //             return Number(total) + (Number(item?.harga) * Number(item?.qty))
  //           }, 0)

  //         cash.push(tmpCash)
  //         qris.push(tmpQris)
  //         voit.push(tmpVoid)
  //         promo.push(tmpPromo)
  //         days.push(start.format('YYYY-MM-DD'));
  //         start.add(1, 'days');
  //       }
  //       // var cash = data.filter((data) => {
  //       //   return data?.paymentMethod === "cash" || data?.paymentMethod === undefined
  //       // }).map(item => item.harga);
  //       // // console.log(cash)

  //       // var qris = data.filter((data) => {
  //       //   return data?.paymentMethod === "qris"
  //       // }).map(item => item.harga);

  //       // var totalVoid = data.map((data) =>
  //       //   data?.hargaNormal && data?.hargaVoid ? (Number(data?.hargaNormal) - Number(data?.hargaVoid)) : 0
  //       // )

  //       // var promo = data
  //       //   .flatMap((data) => data?.item.filter((item) => item?.isPromo))
  //       //   .map(item => item?.harga * item?.qty);

  //       // console.log(promo)
  //       setCash(cash)
  //       setQris(qris)
  //       setVoit(voit)
  //       setPromo(promo)
  //       setLabel(days)
  //     }
  //   } else {
  //     const start = moment(moment(startDate, 'MMMM'), 'YYYY-MM');
  //     const end = moment(moment(endDate, 'MMMM'), 'YYYY-MM');
  //     const months = [];
  //     const cash = [];
  //     const qris = [];
  //     const voit = [];
  //     const promo = [];

  //     if (moment(start).isValid() && moment(end).isValid()) {
  //       while (start.isSameOrBefore(end, 'month')) {
  //         var tmpCash = data.filter((data) => {
  //           return moment(data?.createdAt).isBetween(moment(start).startOf('month'), moment(start).endOf('month')) && (data?.paymentMethod === "cash" || data?.paymentMethod === undefined)
  //         }).reduce((total, data) => {
  //           return total + data?.harga
  //         }, 0)
  //         var tmpQris = data.filter((data) => {
  //           return moment(data?.createdAt).isBetween(moment(start).startOf('month'), moment(end).endOf('month')) && data?.paymentMethod === "qris"
  //         }).reduce((total, data) => {
  //           return total + data?.harga
  //         }, 0)
  //         var tmpVoid = data.filter((data) => {
  //           return moment(data?.createdAt).isBetween(moment(start).startOf('month'), moment(end).endOf('month'))
  //         }).reduce((total, data) => {
  //           return Number(total) + (data?.hargaNormal && data?.hargaVoid ? (Number(data?.hargaNormal) - Number(data?.hargaVoid)) : 0)
  //         }, 0)
  //         var tmpPromo = data
  //           .flatMap((data) => data?.item.filter((item) => item?.isPromo && moment(data?.createdAt).isBetween(moment(start).startOf('month'), moment(end).endOf('month'))))
  //           .reduce((total, item) => {
  //             return Number(total) + (Number(item?.harga) * Number(item?.qty))
  //           }, 0)

  //         // console.log(tmpCash)
  //         // console.log(tmpQris)
  //         // console.log(tmpVoid)
  //         // console.log(tmpPromo)
  //         cash.push(tmpCash)
  //         qris.push(tmpQris)
  //         voit.push(tmpVoid)
  //         promo.push(tmpPromo)
  //         months.push(start.format('YYYY-MM'));
  //         start.add(1, 'month');
  //       }
  //       setCash(cash)
  //       setQris(qris)
  //       setVoit(voit)
  //       setPromo(promo)
  //       setLabel(months)
  //     }
  //   }
  // }, [data, activeBtn, startDate, endDate])
  useEffect(() => {
    // Buat label dummy 7 hari terakhir
    const labels = Array.from({ length: data.length }).map((_, i) =>
      moment().subtract(data.length - i - 1, 'days').format('DD-MMMM-YYYY')
    )
    setLabel(labels)
  }, [data])

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{
          labels: label,
          datasets: [
            {
              label: 'Net Sales',
              backgroundColor: `rgba(${getStyle('--cui-success-rgb')}, .1)`,
              borderColor: getStyle('--cui-success'),
              pointBackgroundColor: getStyle('--cui-success'),
              borderWidth: 2,
              data: data,
              fill: true,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              ticks: {
                color: getStyle('--cui-body-color'),
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              // max: 2000000,
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 10,
              },
            },
          },
        }}
      />
    </>
  )
}

export default MainChart
