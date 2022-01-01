import { Link, NavLink } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export function MainMenu() {
  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="mb-3" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/">
          Wallet
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-menu-nav" />
        <Navbar.Collapse id="main-menu-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" exact eventKey="home">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/transactions" eventKey="transactions">
              Transactions
            </Nav.Link>
            <NavDropdown title="Statistics" id="statistics-nav">
              <NavDropdown.Item as={NavLink} to="/statistics/yearly" activeClassName="active" eventKey="yearlyStats">
                Yearly statistics
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/statistics/category" activeClassName="active" eventKey="categoryStats">
                Category statistics
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/statistics/articles" activeClassName="active" eventKey="articlesStats">
                Articles
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Export/Import" id="export-import-nav">
              <NavDropdown.Item as={NavLink} to="/import" activeClassName="active" eventKey="import">
                Import
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/export" activeClassName="active" eventKey="export">
                Export
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={NavLink} to="/wallets" eventKey="wallets">
              Wallets
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
