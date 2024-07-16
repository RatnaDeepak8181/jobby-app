import {Link} from 'react-router-dom'
import {TiLocation} from 'react-icons/ti'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const JobItem = props => {
  const {jobCardDetails} = props
  const {
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    employmentType,
    companyLogoUrl,
  } = jobCardDetails

  return (
    <Link to={`/jobs/${id}`} className="nav-link">
      <li className="job-card-container">
        <div className="company-logo-and-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-and-rating-container">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-location-package-container">
          <div className="job-location-container">
            <div className="location-container">
              <TiLocation className="location-logo" />
              <p className="location">{location}</p>
            </div>
            <div className="location-container">
              <BsFillBriefcaseFill className="employment-type-logo" />
              <p className="employment-type">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="desc-heading">Description</h1>
        <p className="desc">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobItem
