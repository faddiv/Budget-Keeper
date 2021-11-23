import { Link, NavLink } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export function MainMenu() {
  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Wallet
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-menu-nav" />
        <Navbar.Collapse id="main-menu-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" exact>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/transactions">
              Transactions
            </Nav.Link>
            <NavDropdown title="Statistics" id="statistics-nav">
              <NavDropdown.Item as={NavLink} to="/statistics/yearly" activeClassName="active">
                Yearly statistics
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/statistics/category" activeClassName="active">
                Category statistics
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/statistics/articles" activeClassName="active">
                Articles
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Export/Import" id="export-import-nav">
              <NavDropdown.Item as={NavLink} to="/import" activeClassName="active">
                Import
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/export" activeClassName="active">
                Export
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={NavLink} to="/wallets">
              Wallets
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
