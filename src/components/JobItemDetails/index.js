import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {TiLocation} from 'react-icons/ti'
import {BsFillBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import Header from '../Header'
import './index.css'

const jobItemDetailsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    lifeAtCompanyData: {},
    skillsData: [],
    similarJobData: [],
    apiStatus: jobItemDetailsApiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: jobItemDetailsApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const jobItemDetailsResponse = await fetch(apiUrl, options)
    if (jobItemDetailsResponse.ok === true) {
      const jobItemDetailsData = await jobItemDetailsResponse.json()
      const jobDetails = jobItemDetailsData.job_details
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
      }
      const lifeAtCompanyDetails = jobDetails.life_at_company
      const updatedLifeAtCompanyDetails = {
        description: lifeAtCompanyDetails.description,
        imageUrl: lifeAtCompanyDetails.image_url,
      }
      const skillsDetails = jobDetails.skills
      const updateSkillsDetails = skillsDetails.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))

      const similarJobItemsDetails = jobItemDetailsData.similar_jobs
      const updatedSimilarJobData = similarJobItemsDetails.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobData: updatedJobDetails,
        lifeAtCompanyData: updatedLifeAtCompanyDetails,
        skillsData: updateSkillsDetails,
        similarJobData: updatedSimilarJobData,
        apiStatus: jobItemDetailsApiStatusConstants.success,
      })
      // console.log(jobItemDetailsData.similar_jobs)
    } else {
      this.setState({apiStatus: jobItemDetailsApiStatusConstants.failure})
    }
  }

  onClickGetJobDetailsData = () => {
    this.getJobItemDetails()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-container">
      <div className="failure-ele-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-view-img"
        />
        <h1 className="failure-view-heading">Oops! Something went wrong</h1>
        <p className="failure-desc">
          We cannot seem to find the page you are looking for.
        </p>
        <div>
          <button
            type="button"
            className="retry-btn"
            onClick={this.onClickGetJobDetailsData}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )

  renderLoaderView = () => (
    <div className="job-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSimilarJobItems = () => {
    const {similarJobData} = this.state
    // console.log(similarJobData)
    if (!Array.isArray(similarJobData)) {
      return null
    }
    return (
      <>
        <h1 className="heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobData.map(eachSimilarJob => (
            <li
              className="job-card-container similar-job-item-container"
              key={eachSimilarJob.id}
            >
              <div className="company-logo-and-title-container">
                <img
                  src={eachSimilarJob.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div className="title-and-rating-container">
                  <h1 className="title">{eachSimilarJob.title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="star" />
                    <p className="rating">{eachSimilarJob.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="desc-heading">Description</h1>
              <p className="desc">{eachSimilarJob.jobDescription}</p>
              <div className="job-location-package-container">
                <div className="job-location-container">
                  <div className="location-container">
                    <TiLocation className="location-logo" />
                    <p className="location">{eachSimilarJob.location}</p>
                  </div>
                  <div className="location-container">
                    <BsFillBriefcaseFill className="employment-type-logo" />
                    <p className="employment-type">
                      {eachSimilarJob.employmentType}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderJobItem = () => {
    const {jobData, skillsData, lifeAtCompanyData} = this.state
    return (
      <>
        <Header />
        <div className="job-and-similar-jobs-container">
          <div className="job-card-container">
            <div className="company-logo-and-title-container">
              <img
                src={jobData.companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="title-and-rating-container">
                <h1 className="title">{jobData.title}</h1>
                <div className="rating-container">
                  <AiFillStar className="star" />
                  <p className="rating">{jobData.rating}</p>
                </div>
              </div>
            </div>
            <div className="job-location-package-container">
              <div className="job-location-container">
                <div className="location-container">
                  <TiLocation className="location-logo" />
                  <p className="location">{jobData.location}</p>
                </div>
                <div className="location-container">
                  <BsFillBriefcaseFill className="employment-type-logo" />
                  <p className="employment-type">{jobData.employmentType}</p>
                </div>
              </div>
              <p className="package">{jobData.packagePerAnnum}</p>
            </div>
            <hr />
            <div className="desc-and-visit-container">
              <h1 className="desc-heading">Description</h1>
              <a href={jobData.companyWebsiteUrl} className="visit-nav-link">
                <div className="visit-container">
                  <p>Visit</p>
                  <BsBoxArrowUpRight className="box-arrow" />
                </div>
              </a>
            </div>
            <p className="desc">{jobData.jobDescription}</p>
            <h1 className="desc-heading">Skills</h1>
            <ul className="skills-list">
              {skillsData.map(eachSkillItem => (
                <li key={eachSkillItem.name} className="skill-item">
                  <img
                    src={eachSkillItem.imageUrl}
                    alt={eachSkillItem.name}
                    className="skill-img"
                  />
                  <p className="skill-name">{eachSkillItem.name}</p>
                </li>
              ))}
            </ul>
            <div>
              <h1 className="desc-heading">Life at Company</h1>
              <div className="company-desc-and-img-container">
                <p className="desc">{lifeAtCompanyData.description}</p>
                <img
                  src={lifeAtCompanyData.imageUrl}
                  alt="life at company"
                  className="company-img"
                />
              </div>
            </div>
          </div>
          {this.renderSimilarJobItems()}
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case jobItemDetailsApiStatusConstants.success:
        return this.renderJobItem()
      case jobItemDetailsApiStatusConstants.failure:
        return this.renderJobsFailureView()
      case jobItemDetailsApiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }
}
export default JobItemDetails
