import { useEffect, useState } from "react";
import API from "../../services/api";


export default function Dashboard() {

  const [dashboardData, setDashboardData] = useState({
  totalStudents: 0,
  totalTeachers: 0,
});

useEffect(() => {
  fetchDashboard();
}, []);

const fetchDashboard = async () => {
  try {
    const { data } = await API.get("/dashboard/stats");

    setDashboardData({
      totalStudents: data?.stats?.totalStudents || 0,
      totalTeachers: data?.stats?.totalTeachers || 0,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
  }
};
 const stats = [
  {
    title: "Total Students",
    value: dashboardData.totalStudents,
    growth: "+12%",
    icon: "🎓"
  },
  {
    title: "Teachers",
    value: dashboardData.totalTeachers,
    growth: "+4%",
    icon: "👨‍🏫"
  },
  {
    title: "Fees Collected",
    value: "₹18.4L",
    growth: "+18%",
    icon: "💰"
  },
  {
    title: "Pending Fees",
    value: "₹2.1L",
    growth: "-8%",
    icon: "📌"
  }
];
  const activities = [
    "Rahul Sharma paid ₹12,000 fees",
    "Class 10A attendance updated",
    "Mid-Term exams created",
    "New student admission added",
    "Transport fee reminder sent"
  ];

  const toppers = [
    {
      name: "Priya Singh",
      marks: "96%"
    },
    {
      name: "Aman Verma",
      marks: "94%"
    },
    {
      name: "Riya Patel",
      marks: "93%"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            🚀 Smart ERP Dashboard
          </h1>

          <p className="text-slate-500 mt-2 text-lg">
            Welcome back, Admin 👋
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">

          <button className="bg-blue-600 text-white px-5 py-3 rounded-2xl shadow hover:scale-105 transition">
            + Add Student
          </button>

          <button className="bg-slate-800 text-white px-5 py-3 rounded-2xl shadow hover:scale-105 transition">
            Generate Report
          </button>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-5xl">
                {item.icon}
              </span>

              <span className="text-green-600 font-semibold text-sm bg-green-100 px-3 py-1 rounded-full">
                {item.growth}
              </span>
            </div>

            <h2 className="text-slate-500 text-sm font-medium">
              {item.title}
            </h2>

            <h1 className="text-4xl font-bold text-slate-800 mt-2">
              {item.value}
            </h1>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* ANALYTICS */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              📈 Performance Analytics
            </h2>

            <select className="border rounded-xl px-4 py-2 outline-none">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>

          {/* FAKE CHART */}
          <div className="h-80 flex items-end gap-4">

            {[40, 70, 55, 90, 65, 85, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-500 rounded-t-2xl relative group transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${h}%` }}
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  {h}%
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-slate-500 mt-4 text-sm">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            ⚡ Quick Actions
          </h2>

          <div className="space-y-4">

            <button className="w-full bg-blue-50 hover:bg-blue-100 transition rounded-2xl p-4 text-left">
              🎓 Manage Students
            </button>

            <button className="w-full bg-green-50 hover:bg-green-100 transition rounded-2xl p-4 text-left">
              💳 Collect Fees
            </button>

            <button className="w-full bg-yellow-50 hover:bg-yellow-100 transition rounded-2xl p-4 text-left">
              📝 Add Exam
            </button>

            <button className="w-full bg-red-50 hover:bg-red-100 transition rounded-2xl p-4 text-left">
              📊 Generate Results
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              🔔 Recent Activities
            </h2>

            <button className="text-blue-600 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">

            {activities.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                  🔹
                </div>

                <div>
                  <p className="font-medium text-slate-700">
                    {item}
                  </p>

                  <span className="text-sm text-slate-400">
                    Just now
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOPPERS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              🏆 Top Performers
            </h2>

            <button className="text-blue-600 font-medium">
              Full Ranking
            </button>
          </div>

          <div className="space-y-5">

            {toppers.map((student, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl"
              >
                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-xl">
                    {student.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">
                      {student.name}
                    </h3>

                    <p className="text-slate-500 text-sm">
                      Academic Topper
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <h2 className="text-2xl font-bold text-green-600">
                    {student.marks}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-10 text-center text-slate-400 text-sm">
        SoftZen ERP © 2026 • Advanced School Management System
      </div>
    </div>
  );
}
