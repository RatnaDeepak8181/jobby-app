import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {GoHome} from 'react-icons/go'
import {BsBriefcase} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogOut = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <>
      <nav className="mobile-header-container">
        <Link to="/" className="nav-link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>
        <ul className="header-logos-container">
          <li>
            <Link to="/" className="nav-link">
              {' '}
              <GoHome className="home-logo" />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              <BsBriefcase className="home-logo" />
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="logout-btn log-out-logo-btn"
              onClick={onClickLogOut}
            >
              {' '}
              <FiLogOut className="home-logo" />
            </button>
          </li>
        </ul>
      </nav>
      <nav className="large-screen-header-container">
        <Link to="/" className="nav-link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>
        <div className="header-logo-names-container">
          <div className="logo-names-container">
            <Link to="/" className="nav-link">
              <p className="logo-name">Home</p>
            </Link>
            <Link to="/jobs" className="nav-link">
              <p className="logo-name">Jobs</p>
            </Link>
          </div>
          <div>
            <button
              type="button"
              className="logout-btn"
              onClick={onClickLogOut}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
export default withRouter(Header)
