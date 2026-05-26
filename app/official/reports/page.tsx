"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar } from "recharts"
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  RefreshCw,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"

// Comprehensive mock data for 80+ records
const populationData = [
  { purok: "Purok 1", total: 285, verified: 248, unverified: 37, male: 142, female: 143 },
  { purok: "Purok 2", total: 243, verified: 215, unverified: 28, male: 118, female: 125 },
  { purok: "Purok 3", total: 212, verified: 190, unverified: 22, male: 108, female: 104 },
  { purok: "Purok 4", total: 198, verified: 180, unverified: 18, male: 95, female: 103 },
  { purok: "Purok 5", total: 252, verified: 220, unverified: 32, male: 130, female: 122 },
  { purok: "Purok 6", total: 178, verified: 156, unverified: 22, male: 85, female: 93 },
]

const monthlyRequestsData = [
  { month: "Jan", clearance: 45, residency: 32, indigency: 18, business: 12, total: 107 },
  { month: "Feb", clearance: 52, residency: 38, indigency: 22, business: 15, total: 127 },
  { month: "Mar", clearance: 58, residency: 41, indigency: 25, business: 18, total: 142 },
  { month: "Apr", clearance: 62, residency: 45, indigency: 28, business: 20, total: 155 },
  { month: "May", clearance: 55, residency: 42, indigency: 24, business: 16, total: 137 },
  { month: "Jun", clearance: 68, residency: 48, indigency: 30, business: 22, total: 168 },
]

const blotterStatusData = [
  { name: "Resolved", value: 45, fill: "#10b981" },
  { name: "Mediation", value: 18, fill: "#3b82f6" },
  { name: "Processing", value: 12, fill: "#f59e0b" },
  { name: "Pending", value: 8, fill: "#ef4444" },
]

const ageDistributionData = [
  { age: "0-17", male: 180, female: 175 },
  { age: "18-30", male: 220, female: 235 },
  { age: "31-45", male: 185, female: 190 },
  { age: "46-60", male: 120, female: 130 },
  { age: "60+", male: 75, female: 85 },
]

const weeklyTrendsData = [
  { week: "Week 1", requests: 45, approved: 38, rejected: 4, pending: 3 },
  { week: "Week 2", requests: 52, approved: 44, rejected: 5, pending: 3 },
  { week: "Week 3", requests: 48, approved: 41, rejected: 3, pending: 4 },
  { week: "Week 4", requests: 61, approved: 52, rejected: 6, pending: 3 },
]

const kpiData = [
  { name: "Approval Rate", value: 89, fill: "#10b981" },
  { name: "Processing Time", value: 76, fill: "#3b82f6" },
  { name: "Satisfaction", value: 92, fill: "#8b5cf6" },
  { name: "Efficiency", value: 85, fill: "#f59e0b" },
]

const reportSummary = [
  {
    title: "Total Population",
    value: "1,368",
    subtitle: "Verified: 1,209 | Unverified: 159",
    icon: Users,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Total Requests",
    value: "836",
    subtitle: "This month: 168 | Approved: 89%",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Blotter Cases",
    value: "83",
    subtitle: "Resolved: 54% | In Mediation: 22%",
    icon: AlertTriangle,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Growth Rate",
    value: "+12%",
    subtitle: "Population increase this year",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedReport, setSelectedReport] = useState("all")

  // CSV Export function
  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (!data.length) return
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(header => row[header]).join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportPopulationReport = () => {
    exportToCSV(populationData, "population_report")
  }

  const exportDocumentReport = () => {
    exportToCSV(monthlyRequestsData, "document_requests_report")
  }

  const exportBlotterReport = () => {
    exportToCSV(blotterStatusData.map(item => ({ status: item.name, count: item.value })), "blotter_report")
  }

  const exportAllReports = () => {
    // Export comprehensive report
    const comprehensiveData = [
      { category: "Population", metric: "Total Residents", value: 1368 },
      { category: "Population", metric: "Verified", value: 1209 },
      { category: "Population", metric: "Unverified", value: 159 },
      { category: "Documents", metric: "Total Requests", value: 836 },
      { category: "Documents", metric: "Approved", value: 744 },
      { category: "Documents", metric: "Pending", value: 62 },
      { category: "Documents", metric: "Rejected", value: 30 },
      { category: "Blotter", metric: "Total Cases", value: 83 },
      { category: "Blotter", metric: "Resolved", value: 45 },
      { category: "Blotter", metric: "In Mediation", value: 18 },
      { category: "Blotter", metric: "Processing", value: 12 },
      { category: "Blotter", metric: "Pending", value: 8 },
    ]
    exportToCSV(comprehensiveData, "comprehensive_barangay_report")
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Reports & Analytics</h1>
            </div>
            <p className="text-slate-400">Comprehensive system-wide insights and statistics</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px] bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700" onClick={exportAllReports}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {reportSummary.map((stat, idx) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden"
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat.title}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-2">{stat.subtitle}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" style={{ color: stat.color.includes('emerald') ? '#10b981' : stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('amber') ? '#f59e0b' : '#8b5cf6' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs for different report sections */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-slate-800/50 border border-slate-700 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-500">Overview</TabsTrigger>
              <TabsTrigger value="population" className="data-[state=active]:bg-emerald-500">Population</TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-emerald-500">Documents</TabsTrigger>
              <TabsTrigger value="blotter" className="data-[state=active]:bg-emerald-500">Blotter</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* KPI Gauges */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiData.map((kpi, idx) => (
                  <Card key={kpi.name} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex flex-col items-center">
                      <ResponsiveContainer width="100%" height={120}>
                        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[kpi]} startAngle={180} endAngle={0}>
                          <RadialBar dataKey="value" cornerRadius={10} fill={kpi.fill} background={{ fill: '#334155' }} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <p className="text-2xl font-bold text-white -mt-4">{kpi.value}%</p>
                      <p className="text-xs text-slate-400 mt-1">{kpi.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Weekly Trends */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">Weekly Request Trends</CardTitle>
                        <CardDescription className="text-slate-400">Request processing overview</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => exportToCSV(weeklyTrendsData, "weekly_trends")}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={weeklyTrendsData}>
                        <defs>
                          <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Legend />
                        <Area type="monotone" dataKey="approved" stroke="#10b981" fillOpacity={1} fill="url(#colorApproved)" strokeWidth={2} name="Approved" />
                        <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Total Requests" />
                        <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Rejected" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Blotter Status */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">Blotter Case Status</CardTitle>
                        <CardDescription className="text-slate-400">Case resolution breakdown</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={exportBlotterReport}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={blotterStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${value}`}
                          labelLine={false}
                        >
                          {blotterStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-3 w-full mt-4">
                      {blotterStatusData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-slate-700/30">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                          <span className="text-xs text-slate-300">{item.name}</span>
                          <span className="text-xs text-slate-500 ml-auto">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="population" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Population by Purok */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">Population by Purok</CardTitle>
                        <CardDescription className="text-slate-400">Verified vs unverified residents</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={exportPopulationReport}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={populationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="purok" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="verified" fill="#10b981" name="Verified" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="unverified" fill="#f59e0b" name="Unverified" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Age Distribution */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg">Age Distribution</CardTitle>
                    <CardDescription className="text-slate-400">Population by age group and gender</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={ageDistributionData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" stroke="#64748b" fontSize={11} />
                        <YAxis dataKey="age" type="category" stroke="#64748b" fontSize={11} width={50} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="male" fill="#3b82f6" name="Male" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="female" fill="#ec4899" name="Female" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Population Table */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Detailed Population Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Purok</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">Total</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">Verified</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">Unverified</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">Male</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">Female</th>
                        </tr>
                      </thead>
                      <tbody>
                        {populationData.map((row) => (
                          <tr key={row.purok} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                            <td className="py-3 px-4 text-white font-medium">{row.purok}</td>
                            <td className="py-3 px-4 text-right text-slate-300">{row.total}</td>
                            <td className="py-3 px-4 text-right text-emerald-400">{row.verified}</td>
                            <td className="py-3 px-4 text-right text-amber-400">{row.unverified}</td>
                            <td className="py-3 px-4 text-right text-blue-400">{row.male}</td>
                            <td className="py-3 px-4 text-right text-pink-400">{row.female}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-700/30 font-bold">
                          <td className="py-3 px-4 text-white">TOTAL</td>
                          <td className="py-3 px-4 text-right text-white">{populationData.reduce((a, b) => a + b.total, 0)}</td>
                          <td className="py-3 px-4 text-right text-emerald-400">{populationData.reduce((a, b) => a + b.verified, 0)}</td>
                          <td className="py-3 px-4 text-right text-amber-400">{populationData.reduce((a, b) => a + b.unverified, 0)}</td>
                          <td className="py-3 px-4 text-right text-blue-400">{populationData.reduce((a, b) => a + b.male, 0)}</td>
                          <td className="py-3 px-4 text-right text-pink-400">{populationData.reduce((a, b) => a + b.female, 0)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              {/* Monthly Document Requests */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">Monthly Document Requests</CardTitle>
                      <CardDescription className="text-slate-400">Breakdown by document type</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={exportDocumentReport}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyRequestsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Legend />
                      <Bar dataKey="clearance" fill="#10b981" name="Barangay Clearance" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="residency" fill="#3b82f6" name="Certificate of Residency" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="indigency" fill="#f59e0b" name="Certificate of Indigency" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="business" fill="#8b5cf6" name="Business Permit" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Document Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">744</p>
                    <p className="text-xs text-slate-400 mt-1">Approved</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">62</p>
                    <p className="text-xs text-slate-400 mt-1">Pending</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                      <XCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">30</p>
                    <p className="text-xs text-slate-400 mt-1">Rejected</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">3.2</p>
                    <p className="text-xs text-slate-400 mt-1">Avg Days to Process</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="blotter" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Blotter Status Chart */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg">Case Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={blotterStatusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {blotterStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Blotter Stats */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg">Blotter Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {blotterStatusData.map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">{item.name}</span>
                          <span className="text-sm font-medium text-white">{item.value} cases</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / 83) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.fill }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Total Cases</span>
                        <span className="text-lg font-bold text-white">83</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-slate-400">Resolution Rate</span>
                        <span className="text-lg font-bold text-emerald-400">54%</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-slate-400">Avg Resolution Time</span>
                        <span className="text-lg font-bold text-blue-400">12 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  )
}
