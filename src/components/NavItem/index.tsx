import Link from "next/link";
import "./index.css";

export interface NavItemInterface {
    url: string;
    label: string;
    isActive?: boolean;
}

export default function NavItem(props: NavItemInterface) {
    return (
        <li className="navbar-item">
			<Link href={props.url} className={`nav-link ${props.isActive ? "active" : ""}`}>
            {props.label}
            </Link>
		</li>
    );
}