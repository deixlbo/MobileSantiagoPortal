"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, FileText, CheckCircle, X, Plus } from "lucide-react"

interface TimeSlot {
  time: string
  available: boolean
}

interface Appointment {
  id: string
  serviceType: string
  date: string
  time: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  residentName: string
  residentPhone: string
  notes?: string
  confirmationCode: string
}

const services = [
  { id: "1", name: "Barangay Clearance", duration: "15 min", description: "Employment or travel clearance" },
  { id: "2", name: "Certificate of Residency", duration: "10 min", description: "Proof of residence" },
  { id: "3", name: "Blotter Report", duration: "20 min", description: "Incident reporting" },
  { id: "4", name: "Business Permit", duration: "30 min", description: "Business clearance" },
  { id: "5", name: "Certificate of Indigency", duration: "15 min", description: "Financial assistance" }
]

const timeSlots: TimeSlot[] = [
  { time: "08:00 AM", available: true },
  { time: "09:00 AM", available: true },
  { time: "10:00 AM", available: false },
  { time: "11:00 AM", available: true },
  { time: "01:00 PM", available: true },
  { time: "02:00 PM", available: true },
  { time: "03:00 PM", available: false },
  { time: "04:00 PM", available: true }
]

const mockAppointments: Appointment[] = [
  {
    id: "APT001",
    serviceType: "Barangay Clearance",
    date: "2026-06-10",
    time: "10:00 AM",
    status: "confirmed",
    residentName: "Juan Dela Cruz",
    residentPhone: "(047) 555-0123",
    confirmationCode: "BC-2606-001"
  },
  {
    id: "APT002",
    serviceType: "Certificate of Residency",
    date: "2026-06-08",
    time: "02:00 PM",
    status: "pending",
    residentName: "Maria Santos",
    residentPhone: "(047) 555-0456",
    confirmationCode: "CR-2608-002"
  }
]

export function AppointmentBooking() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [residentName, setResidentName] = useState<string>("")
  const [residentPhone, setResidentPhone] = useState<string>("")
  const [appointmentView, setAppointmentView] = useState<"book" | "list">("book")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const handleBookAppointment = () => {
    if (selectedService && selectedDate && selectedTime && residentName && residentPhone) {
      const newAppointment: Appointment = {
        id: `APT${String(appointments.length + 1).padStart(3, "0")}`,
        serviceType: services.find(s => s.id === selectedService)?.name || "",
        date: selectedDate,
        time: selectedTime,
        status: "pending",
        residentName,
        residentPhone,
        confirmationCode: `${selectedService}-${selectedDate.split("-").slice(1).join("")}-${appointments.length + 1}`
      }
      setAppointments([newAppointment, ...appointments])
      setSelectedService("")
      setSelectedDate("")
      setSelectedTime("")
      setResidentName("")
      setResidentPhone("")
    }
  }

  const filteredAppointments = filterStatus === "all" 
    ? appointments 
    : appointments.filter(a => a.status === filterStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Appointment Booking</h2>
          <p className="text-muted-foreground">Schedule barangay services online</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={appointmentView === "book" ? "default" : "outline"}
            onClick={() => setAppointmentView("book")}
            className="rounded-lg"
          >
            <Plus className="mr-2 h-4 w-4" /> Book
          </Button>
          <Button
            variant={appointmentView === "list" ? "default" : "outline"}
            onClick={() => setAppointmentView("list")}
            className="rounded-lg"
          >
            My Appointments
          </Button>
        </div>
      </div>

      {appointmentView === "book" ? (
        <div className="grid gap-6">
          <Card className="rounded-2xl border border-slate-200/70">
            <CardHeader>
              <CardTitle>Select a Service</CardTitle>
              <CardDescription>Choose the service you need</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button
                      onClick={() => setSelectedService(service.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedService === service.id
                          ? "border-primary bg-primary/5"
                          : "border-slate-200/70 hover:border-primary/50"
                      }`}
                    >
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">⏱️ {service.duration}</p>
                    </button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedService && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
              <Card className="rounded-2xl border border-slate-200/70">
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="date">Appointment Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="mt-2 rounded-lg"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  {selectedDate && (
                    <div>
                      <Label>Available Time Slots</Label>
                      <div className="grid gap-2 mt-2 sm:grid-cols-4">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              !slot.available
                                ? "border-slate-200/50 bg-slate-50 text-muted-foreground cursor-not-allowed opacity-50"
                                : selectedTime === slot.time
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-slate-200/70 hover:border-primary"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedDate && selectedTime && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="rounded-2xl border border-slate-200/70">
                    <CardHeader>
                      <CardTitle>Your Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Juan Dela Cruz"
                          value={residentName}
                          onChange={(e) => setResidentName(e.target.value)}
                          className="mt-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="(047) 555-0123"
                          value={residentPhone}
                          onChange={(e) => setResidentPhone(e.target.value)}
                          className="mt-2 rounded-lg"
                        />
                      </div>
                      <Button onClick={handleBookAppointment} className="w-full rounded-lg" size="lg">
                        Confirm Appointment
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {["all", "confirmed", "pending", "completed", "cancelled"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                onClick={() => setFilterStatus(status)}
                className="rounded-lg capitalize"
                size="sm"
              >
                {status}
              </Button>
            ))}
          </div>

          <div className="grid gap-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-2xl border border-slate-200/70">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">{appointment.serviceType}</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.residentName}</span>
                            </div>
                            <div className="text-muted-foreground">
                              Code: <span className="font-mono font-semibold">{appointment.confirmationCode}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(appointment.status)} className="capitalize">
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="rounded-2xl border border-slate-200/70">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No appointments found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
