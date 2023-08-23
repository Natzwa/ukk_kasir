import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistika = () => {
  let [detailTransaksi, setDetailTransaksi] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLogin") != "Login") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/transaksi`, {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("token") },
      })
      
      .then((res) => {
        console.log(res.data.detail_transaksi);
        setDetailTransaksi(res.data.detail_transaksi);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: ["mie", "steak", "es milo", "jus alpukat"],
      datasets: [
        {
          label: "Menu terjual",
          data: [3, 1, 2, 0],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgb(53, 162, 235, 0.4",
        },
      ],  
    });

    setChartOptions({
      plugin: {
        legend: {
          position: "top",
        },

        title: {
          display: true,
          text: "Menu",
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    });
  }, []);

  return (
    <div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />
      <main class="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <Header />

        <div class="main-content flex flex-col flex-grow p-4">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <footer class="footer px-4 py-2">
          <div class="footer-content">
            <p class="text-sm text-gray-600 text-center">
              © Brandname 2023. All rights reserved.{" "}
              <a href="https://twitter.com/iaminos">by Erairris</a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Statistika;