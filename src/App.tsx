import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import PetList from "@/pages/PetList";
import PetDetail from "@/pages/PetDetail";
import PetForm from "@/pages/PetForm";
import CeremonyList from "@/pages/CeremonyList";
import CeremonyForm from "@/pages/CeremonyForm";
import CremationList from "@/pages/CremationList";
import UrnStorage from "@/pages/UrnStorage";
import Appointments from "@/pages/Appointments";
import ReminderList from "@/pages/ReminderList";
import AppointmentBooking from "@/pages/AppointmentBooking";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/booking" element={<AppointmentBooking />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/:id" element={<PetDetail />} />
          <Route path="/pets/new" element={<PetForm />} />
          <Route path="/pets/:id/edit" element={<PetForm />} />
          <Route path="/ceremonies" element={<CeremonyList />} />
          <Route path="/ceremonies/new" element={<CeremonyForm />} />
          <Route path="/ceremonies/:id/edit" element={<CeremonyForm />} />
          <Route path="/cremations" element={<CremationList />} />
          <Route path="/urns" element={<UrnStorage />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/reminders" element={<ReminderList />} />
        </Route>
      </Routes>
    </Router>
  );
}
