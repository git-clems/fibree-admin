import { Link } from "react-router"

const Button = ({ to, name }) => {
    return (
        <Link to={to} className="bg-[var(--primary-green)] hover:bg-[var(--primary-green-2)] pl-2 pr-2 pt-1 pb-1 m-2 rounded-xl">
            <span className="text-nowrap">{name}</span>
        </Link>
    )
}

export default Button