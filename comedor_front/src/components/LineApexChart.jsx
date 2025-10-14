import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineApexChart = ({precios}) => {
    const insumo = precios.length > 0? precios[0].producto : "---";
    const data = useMemo(() => {
            return precios.map(p => ({
                x: new Date(p.fecha_desde).getTime(),
                y: Number(p.precio_unitario)
            }))
    }, [precios]);

     const options = {
        chart: {
            type: "area",
            stacked: false,
            height: 350,
            zoom: { type: "x", enabled: true, autoScaleYaxis: true },
            toolbar: { autoSelected: "zoom" }
        },
        dataLabels: { enabled: false },
        markers: { size: 4 },
        title: { text: `Evolución de precios (${insumo})`, align: "left" },
        fill: {
            type: "gradient",
            gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
            }
        },
        yaxis: {
            title: { text: "Precio" },
            labels: {
            formatter: val => val.toFixed(2)
            }
        },
        xaxis: {
            type: "datetime",
            labels: {
            datetimeFormatter: { year: "yyyy", month: "MMM yyyy", day: "dd MMM" }
            }
        },
        tooltip: {
            shared: false,
            x: { format: "dd MMM yyyy HH:mm:ss" },
            y: {
            formatter: val => `$${val.toFixed(2)}`
            }
        }
    };

    return (
        <div id="chart">
            <ReactApexChart options={options} series={[{ name: insumo, data }]} type="area" height={350} />
        </div>
    )
}

export default LineApexChart;