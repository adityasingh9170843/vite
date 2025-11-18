import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { Navigate } from "react-router-dom";
import { UserContext } from "./context/userContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(UserContext);
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/auth/dashboard", { withCredentials: true });
        const { metrics, chart, table } = res.data;
        setMetrics(metrics);
        setChartData({ labels: chart.labels, datasets: [{ label: "Sales", data: chart.data, backgroundColor: "rgba(99,102,241,0.5)", borderColor: "rgba(99,102,241,1)", tension: 0.3 }] });
        setTableRows(table);
      } catch (err) {
        console.error("Error fetching dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (authLoading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;

  if (loading) return <div style={{ padding: 24 }}>Loading dashboard...</div>;

  return (
    <div className="page-center">
      <div className="container">
        <h2 style={{ marginBottom: 12 }}>Dashboard</h2>

        <div className="cards">
          <div className="card card-primary">
            <div className="card-title">Total Sales</div>
            <div className="card-value">${metrics?.totalSales ?? 0}</div>
          </div>
          <div className="card card-accent">
            <div className="card-title">Total Orders</div>
            <div className="card-value">{metrics?.totalOrders ?? 0}</div>
          </div>
          <div className="card card-muted">
            <div className="card-title">Inventory Count</div>
            <div className="card-value">{metrics?.inventoryCount ?? 0}</div>
          </div>
        </div>

        <div className="chart">
          {chartData && (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  tooltip: { enabled: true },
                  title: { display: false, text: "Sales by Month" },
                },
              }}
              height={200}
            />
          )}
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.date}</td>
                  <td>{r.product}</td>
                  <td>{r.category}</td>
                  <td>${r.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
