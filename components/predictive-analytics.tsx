"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from "recharts"
import { TrendingUp, AlertCircle, Zap, Brain } from "lucide-react"

const predictionData = [
  { month: "Jan", actual: 240, predicted: 235 },
  { month: "Feb", actual: 290, predicted: 295 },
  { month: "Mar", actual: 340, predicted: 330 },
  { month: "Apr", actual: 290, predicted: 310 },
  { month: "May", actual: 420, predicted: 410 },
  { month: "Jun", actual: 480, predicted: 500 },
  { month: "Jul (Forecast)", actual: null, predicted: 540 },
  { month: "Aug (Forecast)", actual: null, predicted: 580 }
]

const peakHoursData = [
  { hour: "08:00", requests: 45 },
  { hour: "09:00", requests: 120 },
  { hour: "10:00", requests: 95 },
  { hour: "11:00", requests: 140 },
  { hour: "12:00", requests: 80 },
  { hour: "01:00", requests: 60 },
  { hour: "02:00", requests: 110 },
  { hour: "03:00", requests: 155 },
  { hour: "04:00", requests: 90 }
]

const anomaliesData = [
  { date: "2026-06-02", requests: 890, severity: "high", reason: "Public Holiday" },
  { date: "2026-05-28", requests: 720, severity: "medium", reason: "Special Event" },
  { date: "2026-05-15", requests: 650, severity: "low", reason: "School Holiday" }
]

const insights = [
  { icon: TrendingUp, title: "Upward Trend", description: "Requests expected to increase 15% in July", color: "text-green-600" },
  { icon: Zap, title: "Peak Hours", description: "High traffic: 3-4 PM, prepare staff accordingly", color: "text-orange-600" },
  { icon: AlertCircle, title: "Anomaly Alert", description: "June 2nd showed 50% spike - likely holiday effect", color: "text-red-600" },
  { icon: Brain, title: "Recommendation", description: "Open additional service window on Fridays", color: "text-blue-600" }
]

export function PredictiveAnalytics() {
  const [selectedInsight, setSelectedInsight] = useState<number>(0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Predictive Analytics</h2>
          <p className="text-muted-foreground">AI-powered forecasting and anomaly detection</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
          <Brain className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">AI Insights Active</span>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => setSelectedInsight(index)}
              className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                selectedInsight === index
                  ? "border-primary bg-primary/5"
                  : "border-slate-200/70 hover:border-primary/50"
              }`}
            >
              <insight.icon className={`h-5 w-5 ${insight.color} mb-2`} />
              <p className="font-semibold text-sm">{insight.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Forecast Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-2xl border border-slate-200/70">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Request Forecast</CardTitle>
                <CardDescription>6-month actual vs predicted requests</CardDescription>
              </div>
              <Badge className="rounded-full bg-green-100 text-green-800 hover:bg-green-100">
                94% Accuracy
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  name="Actual Requests"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#3b82f6", r: 4 }}
                  name="Predicted"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Peak Hours Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-2xl border border-slate-200/70">
            <CardHeader>
              <CardTitle>Peak Hours Analysis</CardTitle>
              <CardDescription>Predicted request volume by hour</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Anomaly Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-2xl border border-slate-200/70">
            <CardHeader>
              <CardTitle>Anomaly Detection</CardTitle>
              <CardDescription>Unusual patterns detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomaliesData.map((anomaly, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{anomaly.date}</p>
                        <Badge
                          variant={
                            anomaly.severity === "high"
                              ? "destructive"
                              : anomaly.severity === "medium"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs capitalize"
                        >
                          {anomaly.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{anomaly.reason}</p>
                      <p className="text-sm font-semibold text-primary mt-2">{anomaly.requests} requests</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-2xl border border-slate-200/70 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                <div>
                  <p className="font-medium text-sm text-blue-900">Increase staff capacity in July</p>
                  <p className="text-xs text-blue-700">Expected 15% increase in requests. Consider hiring 2-3 temporary staff.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                <div>
                  <p className="font-medium text-sm text-blue-900">Optimize peak hours scheduling</p>
                  <p className="text-xs text-blue-700">Plan additional service windows between 3-4 PM and 9-10 AM.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                <div>
                  <p className="font-medium text-sm text-blue-900">Prepare for special events</p>
                  <p className="text-xs text-blue-700">Historical data suggests 40% spike during holidays. Pre-stock documents.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
