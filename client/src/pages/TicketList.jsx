import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

const TicketList = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);

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
                setTickets(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div className='MyExhibitions'>
            <div className="MyExhibitionsHeader">
            <img style={{width: '10vw', height: '10vw', cursor: 'pointer'}} src={logo} alt="Logo" onClick={() => navigate('/browse')} />
            <h1>Your tickets</h1>
            <div className="ExhibitionList">
          {tickets.map((exhibition) => (
            <div key={exhibition.id} onClick={() => {
              sessionStorage.setItem('role', 'visitorTicket');
              sessionStorage.setItem('exhibitID', exhibition.id);
              sessionStorage.setItem('exhibitName', exhibition.name);
              sessionStorage.setItem('exhibitLocation', exhibition.location);
              sessionStorage.setItem('exhibitStartDate', exhibition.startDate);
              sessionStorage.setItem('exhibitEndDate', exhibition.endDate);
              sessionStorage.setItem('exhibitStartTime', exhibition.startTime);
              sessionStorage.setItem('exhibitEndTime', exhibition.endTime);
              navigate('/exhibition');
            }}
            className="ExhibitionItem">
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

              <button className="cancelButton" type="button" onClick={(e) =>  {
                  e.stopPropagation();
                  const formData = new FormData();
                  formData.append('accountID', sessionStorage.getItem('accountID'));
                  formData.append('exhibitID', exhibition.id);
                  fetch('/refundTicket', {
                      method: 'POST',
                      body: formData,
                  })
                      .then(response => response.json())
                      .then(data => {
                          console.log(data);
                          if (data.success) {
                              alert('Ticket refunded successfully!');
                              setTickets(tickets.filter(ticket => ticket.id !== exhibition.id));
                          } else {
                              alert('Failed to refund ticket.');
                          }
                      })
                      .catch(error => {
                          console.error('Error:', error);
                      });
                }}>
                  Refund Ticket
              </button>
            </div>
          ))}
        </div>
        </div>
        </div>
    );
};

export default TicketList;