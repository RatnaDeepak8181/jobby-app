import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <>
      <Header />
      <div className="home-mobile-container">
        <div className="home-mobile-info">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-desc">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your
            abilities and potential.
          </p>
          <div>
            <Link to="/jobs">
              <button type="button" className="find-job-btn">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
export default Home
