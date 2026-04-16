import './App.css'
import Home from './pages/homePage'
import DetailInfo from './pages/infoDetailPage'
import Page404 from './pages/404'
import AppBar from './components/appbar'
import ScrollToTop from './components/goTop'
import { Route, Routes } from 'react-router'
import SmallAppBar from './components/appbarSmall'
import FootBar from './components/footBar'
import AdminCarousels from './features/carouselsAdmin'
import AdminMissions from './features/missionAdmin'
import AdminInfos from './features/infoAdmin'
import Infos from './pages/infosPage'
import AdminPartenaires from './features/partenaireAdmin'
import AdminEvents from './features/eventAdmin'
import Missions from './pages/missionsPage'
import Projects from './pages/projectsPage'
import Contact from './pages/contactPage'
import About from './pages/aboutPage'
import Actions from './pages/actionsPage'
import Soutien from './pages/soutienPage'
import Rejoindre from './pages/joinPage'
import Team from './pages/teamPage'
import Reports from './pages/reportsPage'
import Admin from './features/admin'
import CandSpontPage from './pages/candSpontPage'
import AdminJoins from './features/joinAdmin'
import BePartner from './pages/newPartner'
import AdminMember from './features/memberAdmin'
import MemberDetailAdmin from './features/memberDetailAdmin'
import DetailsEvent from './pages/eventDetailPage'
import JoinDetailAdmin from './features/joinDetailAdmin'
import AdminContacts from './features/contactAdmin'
import ContactDetailAdmin from './features/contactDetailAdmin'
import data from './data/fibreeDB.missions.json'
import { addDoc, collection } from 'firebase/firestore'
import { db } from './auth/firebase'
import Events from './pages/eventsPage'
import AdminSuspended from './features/suspendedAdmin'
import AdminDetailNewPartner from './features/newPartenaireDetailAdmin'
import AdminNewPartners from './features/newPartenaireAdmin'
import AdminDetailPartner from './features/partenaireDetailAdmin'
import AdminStatistics from './features/statisticsAdmin'


const getMissions = async () => {
  try {
    for (const element of data) {
      const { _id, publishDate, ...rest } = element

      const cleanElement = { ...rest, contactDate: new Date() }

      // const cleanElement = {
      //   ...rest,
      //   publishDate: publishDate?.$date
      //     ? new Date(publishDate.$date)
      //     : null,
      // }

      await addDoc(collection(db, 'contact'), cleanElement)
    }

    console.log('Import terminé ✅')
  } catch (error) {
    console.error("Erreur lors de l'import :", error)
  }
}

// console.log(data);

// getMissions()


function App() {

  return (
    <>
      <AppBar></AppBar>
      <SmallAppBar></SmallAppBar>
      <ScrollToTop></ScrollToTop>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/*' element={<Page404 />}></Route>
        <Route path='/actualite/:id' element={<DetailInfo></DetailInfo>}></Route>
        <Route path='/actualite' element={<Infos></Infos>}></Route>
        <Route path='/evenement' element={<Events />}></Route>
        <Route path='/evenement/:id' element={<DetailsEvent></DetailsEvent>}></Route>
        <Route path='/mission' element={<Missions></Missions>}></Route>
        {/* <Route path='/rejoindre' element={<Rejoindre></Rejoindre>}></Route> */}
        {/* <Route path='/projet' element={<Projects></Projects>}></Route> */}
        <Route path='/contact' element={<Contact></Contact>}></Route>
        <Route path='/a-propos' element={<About></About>}></Route>
        <Route path='/soutenir' element={<Soutien></Soutien>}></Route>
        {/* <Route path='/action' element={<Actions></Actions>}></Route> */}
        {/* <Route path='/equipe' element={<Team></Team>}></Route> */}
        <Route path='/rapport' element={<Reports></Reports>}></Route>
        <Route path='/rejoindre' element={<CandSpontPage></CandSpontPage>}></Route>
        <Route path='/devenir-partenaire' element={<BePartner></BePartner>}></Route>

        <Route path='/admin/affiche' element={<AdminCarousels />}></Route>
        <Route path='/admin/statistique' element={<AdminStatistics />}></Route>
        <Route path='/admin/mission' element={<AdminMissions />}></Route>
        <Route path='/admin/actualite' element={<AdminInfos />}></Route>
        <Route path='/admin/partenaire' element={<AdminPartenaires />}></Route>
        <Route path='/admin/partenaire/:id' element={<AdminDetailPartner />}></Route>
        <Route path='/admin/nouveau-partenaire' element={<AdminNewPartners />}></Route>
        <Route path='/admin/nouveau-partenaire/:id' element={<AdminDetailNewPartner />}></Route>
        <Route path='/admin/evenement' element={<AdminEvents />}></Route>
        <Route path='/admin/nouveau-membre' element={<AdminJoins />}></Route>
        <Route path='/admin/nouveau-membre/:id' element={<JoinDetailAdmin />}></Route>
        <Route path='/admin/messagerie' element={<AdminContacts />}></Route>
        <Route path='/admin/messagerie/:id' element={<ContactDetailAdmin />}></Route>
        <Route path='/admin/membre' element={<AdminMember />}></Route>
        <Route path='/admin/membre/:id' element={<MemberDetailAdmin />}></Route>
        <Route path='/admin/suspendu' element={<AdminSuspended />}></Route>
        <Route path='/admin' element={<Admin />}></Route>

      </Routes>
      <FootBar></FootBar>
    </>
  )
}

export default App
