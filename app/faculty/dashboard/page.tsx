"use client";
import React, { useEffect, useState } from "react";
import FacultyDashboardUI from "./FacultyDashboardUI";

interface Application {
  prnNo: string;
  verificationStatus: {
    HoS: boolean;
    Librarian: boolean;
    Accounts: boolean;
    Gymkhana: boolean;
    ProgramOffice: boolean;
    Dean: boolean;
  };
  applicationStatus?: string;
}

export default function FacultyDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [facultyRole, setFacultyRole] = useState<string>('HoS'); 

  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole');
    if (storedRole) {
      setFacultyRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:5000/applications");
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  const handleAccept = async (prnNo: string) => {
    try {
      await fetch(`http://localhost:5000/applications/${prnNo}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: facultyRole, status: "Accepted" }),
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.prnNo === prnNo
            ? {
                ...app,
                verificationStatus: {
                  ...app.verificationStatus,
                  [facultyRole]: true,
                },
                applicationStatus: "Accepted",
              }
            : app
        )
      );
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const handleReject = async (prnNo: string) => {
    try {
      await fetch(`http://localhost:5000/applications/${prnNo}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: facultyRole, status: "Rejected" }),
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.prnNo === prnNo
            ? {
                ...app,
                verificationStatus: {
                  ...app.verificationStatus,
                  [facultyRole]: false,
                },
                applicationStatus: "Rejected",
              }
            : app
        )
      );
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  // return (
  //   <div>
  //     <h1>Faculty Dashboard</h1>
  //     <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
  //       <thead>
  //         <tr>
  //           <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>PRN</th>
  //           <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>HoS</th>
  //           <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Librarian</th>
  //           <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Accounts</th>
  //           <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Gymkhana</th>
  //           <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Program Office</th>
  //           <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Dean</th>
  //           <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>Actions</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {applications.length === 0 ? (
  //           <tr>
  //             <td colSpan={8} style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>
  //               No data currently available
  //             </td>
  //           </tr>
  //         ) : (
  //           applications.map((app, index) => (
  //             <tr key={index}>
  //               <td style={{ border: "1px solid #ddd", padding: "12px" }}>
  //                 <a href={`/application/${app.prnNo}`} target="_blank" rel="noopener noreferrer">
  //                   {app.prnNo}
  //                 </a>
  //               </td>
  //               {Object.keys(app.verificationStatus).map((role) => (
  //                 <td
  //                   key={role}
  //                   style={{
  //                     border: "1px solid #ddd",
  //                     padding: "12px",
  //                     textAlign: "center",
  //                     color: app.verificationStatus[role as keyof Application["verificationStatus"]]
  //                       ? "green"
  //                       : "red",
  //                   }}
  //                 >
  //                   {/* Show green check mark for accepted, red cross for rejected */}
  //                   {app.verificationStatus[role as keyof Application["verificationStatus"]]
  //                     ? "✓"
  //                     : "✘"}
  //                 </td>
  //               ))}
  //               <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>
  //                 {/* Only display buttons for the current faculty role */}
  //                 {facultyRole in app.verificationStatus && (
  //                   <>
  //                     <button onClick={() => handleAccept(app.prnNo)}>Accept</button>
  //                     <button onClick={() => handleReject(app.prnNo)}>Reject</button>
  //                   </>
  //                 )}
  //               </td>
  //             </tr>
  //           ))
  //         )}
  //       </tbody>
  //     </table>
  //   </div>
  // );
  return (
    <FacultyDashboardUI
      applications={applications}
      facultyRole={facultyRole}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
}
