import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Slider.css';
import logo from "../logo.png";

function Browse() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();           


  const [allExhibitions, setAllExhibitions] = useState([]);

  const [sliderExhibitions, setSliderExhibitions] = useState([]);


  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);


  const globalFormData = new FormData();
  globalFormData.append('accountID', sessionStorage.getItem('accountID'));
  globalFormData.append('exhibitionID', 'NULL');


  useEffect(() => {
    fetch('/getAllExhibitionsWithArtworks', {
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(data => {
        console.log("Joined data from server:", data); 
        setAllExhibitions(data);
  
        const sorted = [...data].sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
        setSliderExhibitions(sorted.slice(0, 3));
      })
      .catch(err => console.error("Error fetching joined data:", err));
  }, []);

  function handleSearch(e) {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      setSearchResults([]);
      return;
    }

    const fd = new FormData();
    fd.append('searchTerm', value);

    fetch('/searchExhibitions', {
      method: 'POST',
      body: fd
    })
      .then(resp => resp.json())
      .then(data => {
        setSearchResults(data);
      })
      .catch(err => console.error("Search error:", err));
  }

  function handleSelectExhibition(exhibition) {
    sessionStorage.setItem('role', 'visitor');
    sessionStorage.setItem('exhibitID', exhibition.id);
    navigate('/exhibition');
  }

  function handleBlur() {
    setTimeout(() => setShowDropdown(false), 150);
  }


  function sortExhibitonsbyTitle() {
      const sortedList = [...allExhibitions].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'case' })
      );
      setAllExhibitions(sortedList);
  }

  function sortExhibitonsbyDate() {
      const sortedListDates = [...allExhibitions].sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      setAllExhibitions(sortedListDates);
  }

  function sortExhibitonsbyDateEnd() {
      const sortedListDatesEnd = [...allExhibitions].sort(
        (a, b) => new Date(a.endDate) - new Date(b.endDate)
      );
      setAllExhibitions(sortedListDatesEnd);
  }


  function scrollToSlide(direction) {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    const scrollTo = direction === 'left'
      ? scrollLeft - clientWidth
      : scrollLeft + clientWidth;

    sliderRef.current.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
  }

  return (
    <section className="container">


      <header className="site-header">
        <div className="header-left">
          <img onClick={() => navigate('/hub')} src={logo} alt="Site Logo" className="AppLogoBrowse" />
        </div>

        <div className="header-right">

          <button
            type="button"
            className="manage-button"
            onClick={() => navigate('/myExhibitions')}
          >
            <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path fill="var(--yellow)" d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"/>
                </g>
            </svg>
            Manage My Exhibitions
          </button>

          <button className='ticketListButton' onClick={() => navigate('/ticketList')}>
          <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg" fill="none">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
            </g><g id="SVGRepo_iconCarrier"><path stroke="var(--mauve)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h9m0 11h3a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-3m0 11v-1m0-10v1">
              </path>
              <path stroke="var(--blue)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 20H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3m6 11h3a1 1 0 0 0 1-1v-2.5M13 20v-1m4-9.999V9m0 3.001V12">
            </path></g></svg>
            My Tickets
          </button>

          <button
            type="button"
            className="header-button"
            onClick={() => navigate('/calendar')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="var(--green)">
              <path d="M5 20q-.825 0-1.412-.587Q3 18.825 3 18V6q0-.825.588-1.412Q4.175 4 5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588Q21 5.175 21 6v12q0 .825-.587 1.413Q19.825 20 19 20Zm0-2h14V9H5v9Z"/>
            </svg>
            Calendar
          </button>
          
          <div className="search-container" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setShowDropdown(true)}
              onBlur={handleBlur}
              style={{ width: '250px' }}
            />

            {showDropdown && searchTerm && (
              <div
                className="search-dropdown"
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#222',
                  border: '1px solid #444',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 999,
                }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((ex) => (
                    <div
                      key={ex.id}
                      className="search-result-item"
                      style={{
                        padding: '0.5rem',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                      onMouseDown={() => handleSelectExhibition(ex)}
                    >
                      <div style={{ fontWeight: 'bold' }}>{ex.name}</div>
                      <div style={{ fontSize: '0.85rem' }}>{ex.location}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#aaa', padding: '0.5rem' }}>
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>


      <div className="slider-wrapper">
        <div className="slider" ref={sliderRef}>
          {sliderExhibitions.map((exhibit, index) => (
            <div key={exhibit.id} className="slider-item">

              <img
                id={`slide-${index + 1}`}
                src={exhibit.imageFilePath}
                alt={exhibit.name || "Exhibition"}
              />

              <div className="slider-text">
                <h2>{exhibit.name}</h2>
                <h3>{exhibit.artist}</h3>
              </div>

              <button
                className="ticket-button"
                onClick={() => {
                  sessionStorage.setItem('role', 'visitor');
                  sessionStorage.setItem('exhibitID', exhibit.id);
                  sessionStorage.setItem('exhibitName', exhibit.name);
                  sessionStorage.setItem('exhibitLocation', exhibit.location);
                  sessionStorage.setItem('exhibitStartDate', exhibit.startDate);
                  sessionStorage.setItem('exhibitEndDate', exhibit.endDate);
                  sessionStorage.setItem('exhibitStartTime', exhibit.startTime);
                  sessionStorage.setItem('exhibitEndTime', exhibit.endTime);
                  navigate('/exhibition');
                }}
              >
                Visit
              </button>
            </div>
          ))}
        </div>


        <div className="slider-nav-arrows">
          <button
            className="slider-arrow"
            onClick={() => scrollToSlide('left')}
            aria-label="Previous slide"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
          </button>

          <button
            className="slider-arrow"
            onClick={() => scrollToSlide('right')}
            aria-label="Next slide"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>

        <div className="slider-nav">
          <a href="#slide-1"></a>
          <a href="#slide-2"></a>
          <a href="#slide-3"></a>
        </div>
      </div>


      <div className="CurrentlyAvailable">
        <div className="available-header">
          <h1>Now available</h1>
          <button
            className="icon-button"
            onClick={() => navigate('/calendar')}
            aria-label="Calendar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="24" fill="var(--red)">
              <path d="M5 20q-.825 0-1.412-.587Q3 18.825 3 18V6q0-.825.588-1.412Q4.175 4 5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588Q21 5.175 21 6v12q0 .825-.587 1.413Q19.825 20 19 20Zm0-2h14V9H5v9Z"/>
            </svg>
          </button>
          
          <div className="dropdown-sort">
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value === "title") sortExhibitonsbyTitle();
                else if (value === "startDate") sortExhibitonsbyDate();
                else if (value === "endDate") sortExhibitonsbyDateEnd();
              }}
              className="sort-dropdown"
            >
              <option value="title">Sort by Title</option>
              <option value="startDate">Sort by Start Date</option>
              <option value="endDate">Sort by End Date</option>
            </select>
          </div>
        </div>


        <div className="ExhibitionList">
          {allExhibitions.map((exhibition) => (
            <div key={exhibition.id} onClick={() => {
              sessionStorage.setItem('role', 'visitor');
              sessionStorage.setItem('exhibitID', exhibition.id);
              sessionStorage.setItem('exhibitName', exhibition.name);
              sessionStorage.setItem('exhibitLocation', exhibition.location);
              sessionStorage.setItem('exhibitStartDate', exhibition.startDate);
              sessionStorage.setItem('exhibitEndDate', exhibition.endDate);
              sessionStorage.setItem('exhibitStartTime', exhibition.startTime);
              sessionStorage.setItem('exhibitEndTime', exhibition.endTime);
              navigate('/exhibition');
            }}
            className="ExhibitionItemBrowse">
              <h2
                className="exhibitionTitle"
                onClick={() => {
                  sessionStorage.setItem('role', 'visitor');
                  sessionStorage.setItem('exhibitID', exhibition.id);
                  sessionStorage.setItem('exhibitName', exhibition.name);
                  sessionStorage.setItem('exhibitLocation', exhibition.location);
                  sessionStorage.setItem('exhibitStartDate', exhibition.startDate);
                  sessionStorage.setItem('exhibitEndDate', exhibition.endDate);
                  sessionStorage.setItem('exhibitStartTime', exhibition.startTime);
                  sessionStorage.setItem('exhibitEndTime', exhibition.endTime);
                  navigate('/exhibition');
                }}
                style={{ cursor: 'pointer' }}
              >
                {exhibition.name}
              </h2>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default Browse;
