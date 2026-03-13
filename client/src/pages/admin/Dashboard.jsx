import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    certificates: 0,
    education: 0,
    messages: 0,
  });

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setPageLoading(true);

        const [projects, skills, certificates, education, messages] =
          await Promise.all([
            api.get("/projects"),
            api.get("/skills"),
            api.get("/certificates"),
            api.get("/education"),
            api.get("/messages"),
          ]);

        setStats({
          projects: projects.data.length,
          skills: skills.data.length,
          certificates: certificates.data.length,
          education: education.data.length,
          messages: messages.data.length,
        });
      } catch (error) {
        toast.error("Failed to fetch dashboard stats");
      } finally {
        setPageLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = {
    labels: ["Projects", "Skills", "Certificates", "Education", "Messages"],
    datasets: [
      {
        label: "Admin Data Count",
        data: [
          stats.projects,
          stats.skills,
          stats.certificates,
          stats.education,
          stats.messages,
        ],
        backgroundColor: [
          "rgba(34, 211, 238, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(234, 179, 8, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#e2e8f0",
        },
      },
      title: {
        display: true,
        text: "Portfolio Admin Overview",
        color: "#ffffff",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
        },
        grid: {
          color: "rgba(148, 163, 184, 0.15)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#cbd5e1",
          stepSize: 1,
        },
        grid: {
          color: "rgba(148, 163, 184, 0.15)",
        },
      },
    },
  };

  const cards = [
    { label: "Projects", value: stats.projects },
    { label: "Skills", value: stats.skills },
    { label: "Certificates", value: stats.certificates },
    { label: "Education", value: stats.education },
    { label: "Messages", value: stats.messages },
  ];

  if (pageLoading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-slate-900 p-6 rounded-xl border border-slate-800"
          >
            <h2 className="text-xl font-semibold">{card.label}</h2>
            <p className="text-3xl font-bold text-cyan-400 mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Dashboard;