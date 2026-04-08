import { useMemo, useState } from 'react'
import LayoutAdmin from '../components/layoutAdmin'

const Admin = () => {
    const [search, setSearch] = useState('')

    const blocks = [
        { link: '/admin/affiche', name: 'Affiches en carrousel', bg_color: 'rgb(0, 0, 0)', text_color: 'white' },
        { link: '/admin/flash-info', name: 'Flash infos', bg_color: 'rgba(255,0,0,0.6)', text_color: 'white' },
        { link: '/admin/actualite', name: 'Actualités', bg_color: 'rgba(255, 217, 0, 0.95)' },
        { link: '/admin/mission', name: 'Missions', bg_color: 'rgba(0, 64, 255, 0.6)', text_color: 'white' },
        { link: '/admin/partenaire', name: 'Partenaires', bg_color: 'rgb(121, 173, 203)', text_color: 'white' },
        { link: '/admin/chiffre', name: 'Chiffres' },
        { link: '/admin/membre', name: 'Membres', bg_color : "rgba(255, 220, 78, 0.89)" },
        { link: '/admin/nouveau-membre', name: 'Demandes adhésions', bg_color : "rgba(78, 249, 255, 0.89)" },
        { link: '/admin/nouveau-partenaire', name: 'Demandes de partenariat', text_color : 'white', bg_color : "rgba(255, 153, 0, 0.89)" },
        { link: '/admin/messages', name: 'Messageries', bg_color : "rgba(0, 255, 17, 0.89)" },
    ]

    const normalizedSearch = search.trim().toLowerCase()

    const filteredBlocks = useMemo(() => {
        if (!normalizedSearch) return blocks

        return [...blocks]
            .filter((block) =>
                block.name.toLowerCase().includes(normalizedSearch)
            )
            .sort((a, b) => {
                const aStarts = a.name.toLowerCase().startsWith(normalizedSearch)
                const bStarts = b.name.toLowerCase().startsWith(normalizedSearch)

                if (aStarts && !bStarts) return -1
                if (!aStarts && bStarts) return 1

                return a.name.localeCompare(b.name)
            })
    }, [search])

    return (
        <div className="page">
            <form className="flex flex-wrap max-w-[1000px] items-center justify-center max-[800px]:m-2 m-5" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-1 border-2 border-gray-300 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-blue-300 focus-within:border-white duration-50">
                    <input type="search" placeholder="Rechercher un bloc" value={search} onChange={(e) => setSearch(e.target.value)} className=" border-l-none outline-none rounded-l-full h-[40px] pl-2 flex-1"/>
                    <div className="text-gray-400 pr-5 pl-5 border-gray-300 flex justify-center items-center"><i class="fa-solid fa-magnifying-glass"></i></div>
                </div>
            </form>

            <div className="flex flex-wrap max-[800px]:justify-center">
                {filteredBlocks.length > 0 ?
                    (
                        filteredBlocks.map((block) => (
                            <LayoutAdmin key={block.link} link={block.link} name={block.name} bg_color={block.bg_color} text_color={block.text_color} />
                        ))
                    ) : (<p className="m-5 text-gray-500">Aucun bloc trouvé.</p>)}
            </div>
        </div>
    )
}

export default Admin