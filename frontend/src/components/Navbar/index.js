import { useState } from "react";
import "../../styles/navbar.css";

export default function Navbar() {
  const [isNavExpanded] = useState(false);

  return (
    <nav className="navigation">
      <div className="navigation-content">
        <a href="/" className="brand-name text-orange-moovy">
          Moovy
        </a>

        <div
          className={
            isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
          }
        >
          <ul>
            <li>
              <a href="/">Search</a>
            </li>
            <li className="text-orange-moovy">
              <a href="/mylibrary">My Library</a>
            </li>
          </ul>
        </div>
      </div>
      <nav className="mobile-nav">
        <a href="/" className="bloc-icon">
          <i className="pi pi-search icon-nav-mobile"></i>
        </a>
        <a href="/mylibrary" className="bloc-icon">
          <i className="pi pi-book icon-nav-mobile"></i>
        </a>
      </nav>
    </nav>
  );
}
