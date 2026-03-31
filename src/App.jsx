import './App.css'
import Home from './pages/homePage'
import DetailInfo from './pages/infoDetailPage'
import Page404 from './pages/404'
import AppBar from './components/appbar'
import ScrollToTop from './components/goTop'
import { Route, Routes } from 'react-router'
import SmallAppBar from './components/appbarSmall'
import FootBar from './components/footBar'
import AdminAffiches from './features/adminAffiches'
import AdminAfficheDetail from './features/adminAfficheDetails'
import AdminMissions from './features/adminMission'
import AdminMissionDetail from './features/adminMissionDetail'
import AdminInfos from './features/adminInfos'
import AdminInfoDetail from './features/adminInfoDetails'
import Infos from './pages/infosPage'
import AdminPartenaires from './features/adminPartenaires'
import AdminFlashInfos from './features/adminFlashInfo'
import Actions from './pages/actionsPage'
import Missions from './pages/missionsPage'
import Projects from './pages/projectsPage'
import Contact from './pages/contactPage'
import About from './pages/aboutPage'
import Soutien from './pages/soutienPage'
import Rejoindre from './pages/rejoindrePage'

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
        <Route path='/action' element={<Actions></Actions>}></Route>
        <Route path='/mission' element={<Missions></Missions>}></Route>
        <Route path='/rejoindre' element={<Rejoindre></Rejoindre>}></Route>
        <Route path='/projet' element={<Projects></Projects>}></Route>
        <Route path='/contact' element={<Contact></Contact>}></Route>
        <Route path='/a-propos' element={<About></About>}></Route>
        <Route path='/soutenir' element={<Soutien></Soutien>}></Route>

        <Route path='/admin/affiche' element={<AdminAffiches />}></Route>
        <Route path='/admin/affiche/:id' element={<AdminAfficheDetail />}></Route>
        <Route path='/admin/mission' element={<AdminMissions />}></Route>
        <Route path='/admin/mission/:id' element={<AdminMissionDetail />}></Route>
        <Route path='/admin/actualite' element={<AdminInfos />}></Route>
        <Route path='/admin/actualite/:id' element={<AdminInfoDetail />}></Route>
        <Route path='/admin/partenaire' element={<AdminPartenaires />}></Route>
        <Route path='/admin/flash-info' element={<AdminFlashInfos />}></Route>
      </Routes>
      <FootBar></FootBar>
    </>
  )
}

export default App
