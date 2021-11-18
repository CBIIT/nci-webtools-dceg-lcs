import BootstrapNavbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import {
  resultsState
} from "../states/state";
import { useRecoilState } from "recoil";
 
export default function Navbar({ links = [], className, children }) {
  const [results, setResults] = useRecoilState(resultsState);

  return (
    <BootstrapNavbar className={"shadow-sm"}>
      <Container>
        {children}
        <Nav className="me-auto">
          {links?.map((link) => (
            <>
            <NavLink
              to={link.path}
              id={link.eventKey}
              key={link.path}
              activeClassName="active"
              className="nav-link dropdown-toggle"
              exact={link.exact}>
              {link.title}
            </NavLink>
            <div className='dropdown-menu' aria-labelledby=''>
                <a className='dropdown-item'>Action</a>
            </div>
            </>
          ))}
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
}
