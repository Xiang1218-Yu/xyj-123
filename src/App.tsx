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
import PackageList from "@/pages/PackageList";
import PackageForm from "@/pages/PackageForm";
import AlbumList from "@/pages/AlbumList";
import AlbumDetail from "@/pages/AlbumDetail";
import AlbumForm from "@/pages/AlbumForm";
import OwnerAlbum from "@/pages/OwnerAlbum";
import EmployeeList from "@/pages/EmployeeList";
import ShiftCalendar from "@/pages/ShiftCalendar";
import LeaveApproval from "@/pages/LeaveApproval";
import AttendanceStats from "@/pages/AttendanceStats";
import BreedKnowledge from "@/pages/BreedKnowledge";
import BreedDetail from "@/pages/BreedDetail";
import BreedArticleForm from "@/pages/BreedArticleForm";
import ContractList from "@/pages/ContractList";
import ContractForm from "@/pages/ContractForm";
import ContractDetail from "@/pages/ContractDetail";
import PetLifeStoryList from "@/pages/PetLifeStoryList";
import PetLifeStoryEditor from "@/pages/PetLifeStoryEditor";
import PetLifeStoryView from "@/pages/PetLifeStoryView";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/booking" element={<AppointmentBooking />} />
        <Route path="/owner-album" element={<OwnerAlbum />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/breeds" element={<BreedKnowledge />} />
          <Route path="/breeds/:id" element={<BreedDetail />} />
          <Route path="/breeds/:id/article/new" element={<BreedArticleForm />} />
          <Route path="/breeds/:id/article/:articleId/edit" element={<BreedArticleForm />} />
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
          <Route path="/packages" element={<PackageList />} />
          <Route path="/packages/new" element={<PackageForm />} />
          <Route path="/packages/:id/edit" element={<PackageForm />} />
          <Route path="/contracts" element={<ContractList />} />
          <Route path="/contracts/new" element={<ContractForm />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />
          <Route path="/contracts/:id/edit" element={<ContractForm />} />
          <Route path="/albums" element={<AlbumList />} />
          <Route path="/albums/new" element={<AlbumForm />} />
          <Route path="/albums/:id" element={<AlbumDetail />} />
          <Route path="/albums/:id/edit" element={<AlbumForm />} />
          <Route path="/life-stories" element={<PetLifeStoryList />} />
          <Route path="/life-stories/new" element={<PetLifeStoryEditor />} />
          <Route path="/life-stories/:id" element={<PetLifeStoryView />} />
          <Route path="/life-stories/:id/edit" element={<PetLifeStoryEditor />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/shifts" element={<ShiftCalendar />} />
          <Route path="/leaves" element={<LeaveApproval />} />
          <Route path="/attendance" element={<AttendanceStats />} />
        </Route>
      </Routes>
    </Router>
  );
}
