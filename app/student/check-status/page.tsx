"use client"; 

import React, { useEffect, useState } from 'react';
import CheckStatusUI from './CheckStatusUI';
import PageTransition from '../../PageTransition';

interface VerificationStatus {
  HoS: boolean;
  Librarian: boolean;
  Accounts: boolean;
  Gymkhana: boolean;
  ProgramOffice: boolean;
  Dean: boolean;
}

interface Status {
  verificationStatus: VerificationStatus;
  applicationStatus: string;
}

export default function CheckStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const officialEmail = sessionStorage.getItem('officialEmail'); 

  useEffect(() => {
    const fetchStatus = async () => {
      if (!officialEmail) {
        console.error("No official email found in session storage.");
        setError("No official email found in session storage.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/status/email/${officialEmail}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data: Status = await response.json();

        const allVerified = Object.values(data.verificationStatus).every((value) => value === true);

        data.applicationStatus = allVerified ? "Approved" : "Pending";

        setStatus(data);
      } catch (error) {
        console.error("Error fetching status:", error);
        setError("Failed to fetch status. Please try again later.");
      }
    };

    fetchStatus();
  }, [officialEmail]);

  // return (
  //   <div>
  //     <h1>Check Application Status</h1>

  //     {error && <p style={{ color: "red" }}>{error}</p>}

  //     {status ? (
  //       <>
  //         <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
  //           <thead>
  //             <tr>
  //               <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Department</th>
  //               <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Status</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {Object.keys(status.verificationStatus).map((department, index) => (
  //               <tr key={index}>
  //                 <td style={{ border: "1px solid #ddd", padding: "12px" }}>{department}</td>
  //                 <td style={{ border: "1px solid #ddd", padding: "12px" }}>
  //                   {status.verificationStatus[department as keyof VerificationStatus] ? (
  //                     <span style={{ color: 'green', fontSize: '20px' }}>✔</span>
  //                   ) : (
  //                     <span style={{ color: 'red', fontSize: '20px' }}>❌</span>
  //                   )}
  //                 </td>
  //               </tr>
  //             ))}
  //             <tr>
  //               <td style={{ border: "1px solid #ddd", padding: "12px" }}>Application Status</td>
  //               <td style={{ border: "1px solid #ddd", padding: "12px" }}>
  //                 {status.applicationStatus}
  //               </td>
  //             </tr>
  //           </tbody>
  //         </table>
  //         <p style={{ color: "red", marginTop: "10px" }}>
  //           If your application shows pending for 7 days or more, please contact or visit the student section.
  //         </p>
  //       </>
  //     ) : (
  //       <p>No status available.</p>
  //     )}
  //   </div>
  // 
  return (
    <PageTransition>
      <CheckStatusUI status={status} error={error} />
    </PageTransition>
  );
}
