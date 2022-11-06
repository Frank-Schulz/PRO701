import React from 'react'
import ReactDOMServer from 'react-dom/server';

// Returns human readable date format
const humanDate = (date) => {
  if (!date) return date;
  let dateComponent = new Date(date).toJSON().slice(0, 10);
  return dateComponent.replace(/-/g, "/");
}

function calcAge(DOB, DOD) {
    const ageDifMs = DOD ?
      new Date(DOD).getTime() - new Date(DOB).getTime() :
      new Date().getTime() - new Date(DOB).getTime();

    const ageDate = new Date(ageDifMs);
    return {
      years: ageDate.getUTCFullYear() - 1970,
      months: ageDate.getUTCMonth(),
      days: ageDate.getUTCDay()
    };
  }

export function PersonBox(person) {
  const DOB = person.DOB;
  const DOD = person.DOD;
  const age = calcAge(DOB, DOD);

  const ageDetails = {
    age: age,
    DOB: humanDate(DOB),
    DOD: humanDate(DOD),
    vitalStatus: DOD ? { state: `Deceased`, color: 'red' } :
      age.years <= -1 ? { state: 'Unborn', color: null } : { state: 'Alive', color: 'green' },
  }

  // Return the appropriate age display
  const ageComponent = () => {
    const unborn = ageDetails.age.years <= -1 ? 'Unborn' : null;
    const months = ageDetails.age.years == 0 ? ageDetails.age.months + ' months old' : null;
    const days = ageDetails.age.years == 0 && ageDetails.age.months == 0 ? ageDetails.age.days + ' days old' : null;
    return unborn || days || months || ageDetails.age.years || 'No data'
  }

  return (
    // Return static markup for use in D3
    ReactDOMServer.renderToStaticMarkup(
      <>
        <h6 style={{ height: '15px', margin: 0, textAlign: 'center' }}>{person.fullName}</h6>
        {ageDetails.DOB && <p style={{ textAlign: 'center', margin: 0 }}>
          {ageDetails.DOB && new Date(ageDetails.DOB).getUTCFullYear() || <>&emsp;&emsp;</>}
          -
          {ageDetails.DOD && new Date(ageDetails.DOD).getUTCFullYear() || <>&emsp;&emsp;</>}
        </p>}
        <table>
          <tr>
            <td>Age:&emsp;</td>
            {ageComponent && <td style={{ color: ageDetails.vitalStatus.color }}>{ageComponent()}</td>}
          </tr>
          {person.gender && ageDetails.age.years >= 14 && <tr>
            <td>G:</td>
            <td>{person.gender}</td>
          </tr>}
        </table>
      </>
    )
  )
}
