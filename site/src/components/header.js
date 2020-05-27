import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import ExternalLinkSvg from "./ExternalLinkSvg"

const Header = ({ siteTitle, menuLinks }) => (
  <header
    style={{
      background: "rebeccapurple",
      marginBottom: "1.45rem",
    }}
  >
    <div
      style={{
        margin: "0 auto",
        marginRight: "5%",
        width: "90%",
        display: "flex",
        justifyItems: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 0, flex: 1 }}>
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <nav>
        <ul style={{ margin: 0, display: "flex", flex: 1 }}>
          {menuLinks.map(({ name, link, url }) => (
            <li
              key={name}
              style={{
                listStyleType: `none`,
                padding: `1rem`,
              }}
            >
              <h3>
                {link ? (
                  <Link
                    style={{ color: "white", textDecoration: "none" }}
                    to={link}
                  >
                    {name}
                  </Link>
                ) : (
                  <a
                    style={{ color: "white", textDecoration: "none" }}
                    href={url}
                  >
                    {name}
                    <ExternalLinkSvg />
                  </a>
                )}
              </h3>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
