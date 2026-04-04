import { useMemo, useState } from 'react'
import LayoutAdmin from '../components/layoutAdmin'

const Admin = () => {
    const [search, setSearch] = useState('')

    const blocks = [
        { link: '/admin/affiche', name: 'Affiches', bg_color: 'rgb(0, 0, 0)', text_color: 'white' },
        { link: '/admin/flash-info', name: 'Flash infos', bg_color: 'rgba(255,0,0,0.6)', text_color: 'white' },
        { link: '/admin/actualite', name: 'Actualités', bg_color: 'rgba(255, 217, 0, 0.95)' },
        { link: '/admin/mission', name: 'Nos missions', bg_color: 'rgba(0, 64, 255, 0.6)', text_color: 'white' },
        { link: '/admin/partenaire', name: 'Les partenaires', bg_color: 'rgb(121, 173, 203)', text_color: 'white' },
        { link: '/admin/chiffre', name: 'Les chiffres' },
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
            <form
                className="flex flex-wrap max-w-[1000px] items-center justify-center max-[800px]:m-2 m-5"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="flex flex-1">
                    <div className="bg-green-400 pl-5 pr-5 border-2 border-gray-300 flex justify-center items-center rounded-l-[10px]">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <input type="search" placeholder="Rechercher un bloc" value={search} onChange={(e) => setSearch(e.target.value)} className="outline-none border-l-none h-[40px] pl-2 flex-1 border-2 border-gray-300"/>
                    <button style={{ borderStartEndRadius: '10px', borderEndEndRadius: '10px' }} type="submit" className="hover:bg-green-300 bg-green-400 border-2 border-gray-300 flex justify-center items-center pl-5 pr-5">Rechercher</button>
                </div>
            </form>

            <div className="flex flex-wrap">
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