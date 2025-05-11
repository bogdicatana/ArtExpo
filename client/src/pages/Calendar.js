import React, { useState, useEffect } from 'react';
import './Calendar.css';
import { useNavigate } from 'react-router-dom';
import logo from "../logo.png";

function parseDate(dateStr) {
  return new Date(dateStr);
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];



const DAYS_IN_MONTH = (month, year) => new Date(year, month + 1, 0).getDate();

function Calendar({ startingDate = new Date() }) {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(startingDate.getMonth());
  const [currentYear, setCurrentYear] = useState(startingDate.getFullYear());
  const [tickets, setTickets] =  useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/getCalendarExhibitions', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        console.log('Calendar exhibitions from server:', data); 

        const parsed = data.map(item => {
          return {
            id: item.id,
            title: item.title,
            startDate: parseDate(item.startDate), 
            endDate: item.endDate ? parseDate(item.endDate) : parseDate(item.startDate),
            startTime: item.startTime, 
            endTime: item.endTime,     
            location: item.location  
          };
        });
        setEvents(parsed);
      })
      .catch(err => console.error('Calendar fetch error:', err));
  }, []);

  useEffect(() => {
    fetch('/getAllExhibitionsWithArtworks', { method: 'POST' })
      .then(resp => resp.json())
      .then(data => {
        console.log('Joined data from server:', data);
  

        const eventsParsed = data.map(item => {
          const [y,m,d] = item.startDate.split("-");
          const startDate = new Date(+y, +m - 1, +d);
  
          const [ey,em,ed] = item.endDate.split("-");
          const endDate = item.endDate ? new Date(+ey, +em - 1, +ed) : startDate;
  
          return {
            id: item.id,
            title: item.name,              
            image: item.imageFilePath,     
            startDate: startDate,
            endDate: endDate,
            startTime: item.startTime,
            endTime: item.endTime
          };
        });
        setEvents(eventsParsed);
      })
      .catch(err => console.error('Calendar fetch error:', err));
  }, []);
  
  useEffect(() => {
    const formData = new FormData();
    formData.append('accountID', sessionStorage.getItem('accountID'));
    fetch('/getExhibitionsWithTicket', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const parsedTickets = []
            
            data.forEach(exhibition => {
              const [sy, sm, sd] = exhibition.startDate.split("-");
              const [ey, em, ed] = exhibition.endDate
                ? exhibition.endDate.split("-")
                : exhibition.startDate.split("-");

              const startDate = new Date(+sy, +sm - 1, +sd);
              const endDate = new Date(+ey, +em - 1, +ed);

              let current = new Date(startDate);
              while(current <= endDate){
                parsedTickets.push(new Date(current));
                current.setDate(current.getDate() + 1);
              }
            });

            setTickets(parsedTickets);
        })
        .catch(error => {
            console.error('Error:', error);
        });
  }, []);

  function isTicketDay(date){
    return tickets.some(ticketDate => 
      ticketDate.getFullYear() === date.getFullYear() && 
      ticketDate.getMonth() === date.getMonth() && 
      ticketDate.getDate() === date.getDate()
    );
  }


  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = DAYS_IN_MONTH(currentMonth, currentYear);

  const nextMonth = () => {
    if (currentMonth < 11) {
      setCurrentMonth(prev => prev + 1);
    } else {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth(prev => prev - 1);
    } else {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    }
  };



  function isSameOrWithinDay(cellDate, startDate, endDate) {

    const cY = cellDate.getFullYear(), cM = cellDate.getMonth(), cD = cellDate.getDate();
    
    const sY = startDate.getFullYear(), sM = startDate.getMonth(), sD = startDate.getDate();
    const eY = endDate.getFullYear(), eM = endDate.getMonth(), eD = endDate.getDate();
    

    const cellNum = new Date(cY, cM, cD).valueOf();
    const startNum = new Date(sY, sM, sD).valueOf();
    const endNum = new Date(eY, eM, eD).valueOf();
    
    return cellNum >= startNum && cellNum <= endNum;
  }


  function getEventsForDay(dayOfMonth) {
    const cellDate = new Date(currentYear, currentMonth, dayOfMonth);
    return events.filter(event => {


      return isSameOrWithinDay(cellDate, event.startDate, event.endDate);
    });
  }

  return (
    <div className="wrapper">
        <div className="calendar-head">

            <div className="header-left">
              <img onClick={()=> navigate('/Browse')} src={logo} alt="Site Logo" className="AppLogoCalendar"/>
            </div>

            <div className="calendar-center">
              <button onClick={prevMonth} aria-label="Previous month" className="calendar-arrow">
                  <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="24"
                  height="24"
                  >
                  <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
                  </svg>
              </button>

              <p className="month-title">
                  {MONTHS[currentMonth]} {currentYear}
              </p>

              <button onClick={nextMonth} aria-label="Next month" className="calendar-arrow">
                <svg 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
                >
                <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
              </button>
            </div>
        </div>

        <div className="seven-col-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <span key={day} className="head-day">{day}</span>
          ))}
      </div>

      <div className="calendar-body">
        {Array.from({ length: firstDayIndex }).map((_, index) => (
          <span key={`empty-${index}`} className="styled-day empty"></span>
        ))}


        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayEvents = getEventsForDay(dayNum); 
          const cellDate = new Date(currentYear, currentMonth, dayNum);

          const isBooked = isTicketDay(cellDate);

          return (
            <span key={dayNum} 
            className={`styled-day ${isBooked ? 'booked-day' : ''}`}>

              <div className = "day-header">
                <p>{dayNum}</p>
                {isBooked && (
                  <span className='ticket-icon' role="img" aria-label="Ticket">
                    🎟️
                  </span>
                )}
              </div>
              

              {dayEvents.map(evt => (
                <div key={evt.id} className="calendar-event-tile">
                    <img 
                    src={evt.image || "fallback.jpg"} 
                    alt={evt.title} 
                    className="event-image" 
                    />
                    <div className="event-info">
                    <h4 className="event-title">{evt.title}</h4>
                    <p className="event-time">
                        {evt.startTime} - {evt.endTime}
                    </p>
                    </div>
                </div>
                ))}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
