import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const allJobsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    jobsList: [],
    apiStatus: allJobsApiStatusConstants.initial,
    profileDetails: [],
    profileApiStatus: profileApiStatusConstants.initial,
    searchInput: '',
    employmentTypesChecked: [],
    activeSalaryRangeId: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: profileApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const ProfileOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileResponse = await fetch(profileApiUrl, ProfileOptions)
    if (profileResponse.ok === true) {
      const data = await profileResponse.json()
      const profileData = data.profile_details
      const updatedProfileData = {
        name: profileData.name,
        profileImageUrl: profileData.profile_image_url,
        shortBio: profileData.short_bio,
      }
      // console.log(updatedProfileData)
      this.setState({
        profileDetails: updatedProfileData,
        profileApiStatus: profileApiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: profileApiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({apiStatus: allJobsApiStatusConstants.inProgress})
    const {
      searchInput,
      employmentTypesChecked,
      activeSalaryRangeId,
    } = this.state
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesChecked}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    console.log(jobsApiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const jobsApiResponse = await fetch(jobsApiUrl, options)
    // console.log(jobsApiResponse)
    if (jobsApiResponse.ok === true) {
      const jobsData = await jobsApiResponse.json()
      const updatedJobsData = jobsData.jobs.map(eachJob => ({
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
        employmentType: eachJob.employment_type,
        companyLogoUrl: eachJob.company_logo_url,
      }))
      console.log(updatedJobsData)
      this.setState({
        jobsList: updatedJobsData,
        apiStatus: allJobsApiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: allJobsApiStatusConstants.failure})
    }
  }

  renderNoJobs = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-desc">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    const jobsListLength = jobsList.length
    console.log('rendered')
    return (
      <div>
        {jobsListLength === 0 ? (
          this.renderNoJobs()
        ) : (
          <ul className="jobs-list">
            {jobsList.map(eachJobDetails => (
              <JobItem
                key={eachJobDetails.id}
                jobCardDetails={eachJobDetails}
              />
            ))}
          </ul>
        )}
      </div>
    )
  }

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-container">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-logo"
        />
        <h1 className="user-name">{profileDetails.name}</h1>
        <p className="role-name">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderProfileData = () => {
    this.getProfileDetails()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="retry-btn"
        onClick={this.renderProfileData}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickGetJobData = () => {
    this.getJobs()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-container">
      <div className="failure-ele-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-view-img"
        />
        <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
        <p className="failure-desc">
          We cannot seem to find the page you are looking for
        </p>
        <div>
          <button
            type="button"
            className="retry-btn"
            onClick={this.onClickGetJobData}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )

  profileRenderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileApiStatus = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case profileApiStatusConstants.success:
        return this.renderProfileDetails()
      case profileApiStatusConstants.failure:
        return this.renderProfileFailureView()
      case profileApiStatusConstants.inProgress:
        return this.profileRenderLoaderView()
      default:
        return null
    }
  }

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case allJobsApiStatusConstants.success:
        return this.renderJobsList()
      case allJobsApiStatusConstants.failure:
        return this.renderJobsFailureView()
      case allJobsApiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  typesOfEmploymentView = () => (
    <div className="types-of-employment-container">
      <h1 className="types-of-employment-heading">Type of Employment</h1>
      <ul className="types-container">
        {employmentTypesList.map(eachType => (
          <li key={eachType.employmentTypeId}>
            <input
              type="checkbox"
              id={eachType.employmentTypeId}
              onChange={this.updateTypesList}
            />
            <label htmlFor={eachType.employmentTypeId} className="type">
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  salaryRangeView = () => (
    <div className="types-of-employment-container">
      <h1 className="types-of-employment-heading">Salary Range</h1>
      <ul className="types-container">
        {salaryRangesList.map(eachRange => (
          <li key={eachRange.salaryRangeId}>
            <input
              type="radio"
              name="option"
              id={eachRange.salaryRangeId}
              // checked={activeSalaryRangeId === eachRange.salaryRangeId}
              onChange={this.onChangeSalaryRange}
            />
            <label htmlFor={eachRange.salaryRangeId} className="type">
              {eachRange.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  updateTypesList = event => {
    const {employmentTypesChecked} = this.state
    const inputNotInList = employmentTypesChecked.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          employmentTypesChecked: [
            ...prevState.employmentTypesChecked,
            event.target.id,
          ],
        }),
        this.getJobs,
      )
    } else {
      const filteredData = employmentTypesChecked.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({employmentTypesChecked: filteredData}, this.getJobs)
    }
  }

  onChangeSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobs)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchResults = () => {
    this.getJobs()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="all-jobs-mobile-view-container">
          <div className="profile-filter-container">
            <div className="mobile-search-input-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                className="search-icon-container"
                onClick={this.onSearchResults}
                data-testid="searchButton"
              >
                {' '}
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.renderProfileApiStatus()}
            <hr className="line" />
            {this.typesOfEmploymentView()}
            <hr className="line" />
            {this.salaryRangeView()}
          </div>
          <div className="search-and-job-card-container">
            <div className="large-screen-search-input-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                className="search-icon-container"
                onClick={this.onSearchResults}
                data-testid="searchButton"
              >
                {' '}
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.renderApiStatus()}
          </div>
        </div>
      </>
    )
  }
}
export default AllJobs
