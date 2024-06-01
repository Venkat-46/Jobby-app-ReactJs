import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.push('/login')
  }

  return (
    <nav className="Header-container">
      <Link to="/" className="nav-link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo-img"
        />
      </Link>
      <ul className="mobile-links-container">
        <Link to="/" className="nav-link">
          <li className="link-item">
            <AiFillHome size={25} color="white" />
          </li>
        </Link>
        <Link to="/jobs" className="nav-link">
          <li className="link-item">
            <BsBriefcaseFill size={25} color="white" />
          </li>
        </Link>
        <Link to="/jobs" className="nav-link">
          <li className="link-item-button">
            <button
              type="button"
              className="m-logout-button"
              onClick={onClickLogout}
            >
              .<FiLogOut size={25} color="white" />
            </button>
          </li>
        </Link>
      </ul>
      <ul className="desk-links-container">
        <li className="link-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="link-item">
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </li>
      </ul>
      <button
        type="button"
        className="desk-logout-button"
        onClick={onClickLogout}
      >
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
