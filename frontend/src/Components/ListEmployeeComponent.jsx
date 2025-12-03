import React, { useState, useEffect } from 'react';
import { listEmployees } from '../Services/EmployeeService'; // adjust if you use default export
import { useNavigate } from 'react-router-dom';
import { deleteEmployee } from '../Services/EmployeeService';
// Simple inline SVG logo component — replace if you have an actual logo
const EmpTrackLogo = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="64" height="64" rx="12" fill="url(#g)" />
    <path d="M18 38c4-8 10-14 20-18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 44c6-6 16-10 28-12" stroke="rgba(255,255,255,0.85)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1f9a8a" />
        <stop offset="1" stopColor="#2b5760" />
      </linearGradient>
    </defs>
  </svg>
);

export default function FullPageEmployeeList() {
  const [rawResponse, setRawResponse] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [normalized, setNormalized] = useState([]);
  const [loading, setLoading] = useState(true);

  //for Add / Update / Delete actions
  const navigate = useNavigate();

  const pick = (...cands) => {
    for (const c of cands) if (c !== undefined && c !== null && c !== '') return c;
    return undefined;
  };

  const normalizeEmployee = (e) => {
    const id = pick(e.id, e.employeeId, e._id, e.idEmployee);
    const firstName = pick(
      e.firstName,
      e.first_name,
      e.firstname,
      (typeof e.name === 'string' && e.name.split(' ')[0]),
      e.givenName
    ) || '—';
    const lastName = pick(
      e.lastName,
      e.last_name,
      e.lastname,
      (typeof e.name === 'string' && e.name.split(' ').slice(1).join(' ')),
      e.familyName
    ) || '—';
    const email = pick(
      e.emailId,
      e.email,
      e.email_address,
      e.contact?.email,
      e.mail
    ) || '—';

    return { id: id ?? Math.random().toString(36).slice(2, 9), firstName, lastName, email };
  };

  useEffect(() => {
    setLoading(true);
    listEmployees()
      .then((response) => {
        setRawResponse(response);
        let data = response?.data ?? response;

        let arr = [];
        if (Array.isArray(data)) {
          arr = data;
        } else if (Array.isArray(data?.content)) {
          arr = data.content;
        } else if (Array.isArray(data?.data)) {
          arr = data.data;
        } else if (Array.isArray(data?.employees)) {
          arr = data.employees;
        } else if (data && typeof data === 'object') {
          if (Object.values(data).every(val => typeof val === 'object')) {
            const maybeArray = Object.values(data);
            const likely = maybeArray.filter(i => i && (i.id || i.email || i.firstName));
            if (likely.length >= 1) arr = maybeArray;
          }
        }

        setEmployees(arr);
        setNormalized(arr.map(normalizeEmployee));
        setLoading(false);

        // console output for developer inspection
        // eslint-disable-next-line no-console
        console.log('[FullPageEmployeeList] raw response:', response);
        // eslint-disable-next-line no-console
        console.log('[FullPageEmployeeList] extracted array:', arr);
      })
      .catch((error) => {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.error('Error fetching employees:', error);
        setRawResponse({ error: String(error) });
      });
  }, []);

  /* ---------- Local UI handlers for Add / Update / Delete ---------- */
  
// Navigate to add-employee page
 function AddNewEmployee() {
    navigate('/add-employee');
 }

 // Update employee 
 function UpdateEmployee(id) {
    navigate(`/edit-employee/${id}`);
 }

 // Delete employee 
  function DeleteEmployee(id) {
    console.log("Deleting employee id:", id);
    deleteEmployee(id)
      .then(() => listEmployees())
      .then((res) => {
          setEmployees(res.data); // raw array
          setNormalized(res.data.map(normalizeEmployee)); // normalized array
      })
      .catch((err) => console.error("Delete error:", err));
}


  return (
    <>
      <style>{`
        /* Full page animated gradient background + subtle geometric blobs */
        .employee-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          background: radial-gradient(circle at 10% 20%, rgba(47,160,140,0.10), transparent 8%),
                      radial-gradient(circle at 90% 80%, rgba(43,87,96,0.08), transparent 8%),
                      linear-gradient(135deg, #f3faf8 0%, #e8fbf9 40%, #eef7f8 100%);
          overflow: hidden;
        }

        .gradient-anim {
          position: absolute;
          inset: -20%;
          background: linear-gradient(120deg, rgba(31,154,138,0.06), rgba(43,87,96,0.05), rgba(31,154,138,0.06));
          transform: rotate(8deg);
          animation: float 18s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes float {
          0% { transform: translateY(0) rotate(6deg); }
          50% { transform: translateY(-18px) rotate(-4deg); }
          100% { transform: translateY(0) rotate(6deg); }
        }

        /* Adaptive card: auto height (shrinks to content) but caps at 92vh */
        .employee-card {
          position: relative;
          width: min(1400px, 96%);
          height: auto;              /* <-- now auto so it fits small lists */
          max-height: 92vh;         /* <-- limits height for very long lists */
          border-radius: 1.25rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,255,254,0.95));
          box-shadow: 0 30px 80px rgba(25,50,60,0.15);
          border: 1px solid rgba(20,92,82,0.06);
        }

        /* header with logo and title */
        .employee-header {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 1.25rem 1.5rem;
          background: linear-gradient(90deg, #2b5760, #1f9a8a);
          color: #fff;
        }
        .employee-header .title-wrap { display:flex; flex-direction:column; }
        .employee-header .display-3 { font-size: 1.9rem; margin: 0; font-weight: 800; letter-spacing: -0.6px; }
        .employee-header .subtitle { margin: 4px 0 0; opacity: 0.95; font-size: 1.02rem; }

        /* Add button placed at the right of header */
        .header-actions { margin-left: auto; display:flex; gap:8px; align-items:center; }

        /* button base */
        .btn-emp {
          border: 0;
          padding: 0.55rem 0.9rem;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(20,92,82,0.06);
        }

        .btn-add { background: linear-gradient(90deg,#2bbf9b,#1f9a8a); color: white; }
        .btn-add:hover { transform: translateY(-2px); }

        .btn-update { background: linear-gradient(90deg,#fff8f0,#f0fff8); color: #0b5e54; border: 1px solid rgba(11,94,84,0.08); }
        .btn-update:hover { transform: translateY(-2px); }

        .btn-delete { background: linear-gradient(90deg,#ffecec,#ffd6d6); color: #9b1c1c; border: 1px solid rgba(155,28,28,0.08); }
        .btn-delete:hover { transform: translateY(-2px); }

        .table-area {
          padding: 1rem 1.5rem;
          overflow: auto;
          max-height: calc(92vh - 160px);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          background: transparent;
        }
        thead.table-head th {
          text-align: left;
          padding: 1rem 1rem;
          font-size: 1.05rem;
          background: rgba(20,92,82,0.12);
          color: #063a36;
          position: sticky;
          top: 0;
          z-index: 2;
          backdrop-filter: blur(4px);
        }
        tbody tr { transition: transform .12s ease, box-shadow .12s ease, background .12s ease; }
        tbody tr:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(20,92,82,0.06); background: rgba(240, 253, 250, 0.8); }

        td, th {
          vertical-align: middle;
          padding: 1rem 1rem;
          border-bottom: 1px solid rgba(20,92,82,0.04);
          color: #053335;
          font-size: 1.05rem;
        }

        .name-cell { font-weight: 800; font-size: 1.12rem; color: #0b3d37; }
        .role-cell { font-size: 1.02rem; color: #0f5b50; }
        .email-link { text-decoration: none; color: #1f9a8a; font-weight: 700; }
        .email-link:hover { text-decoration: underline; }

        /* action buttons column */
        .actions-td { display:flex; gap:8px; justify-content:flex-end; }

        .employee-footer {
          padding: 1rem 1.5rem;
          text-align: right;
          color: #0b5e54;
          font-size: 0.95rem;
          border-top: 1px solid rgba(20,92,82,0.03);
          background: linear-gradient(180deg, rgba(255,255,255,0), rgba(245,255,252,0.6));
        }

        /* Small-screen tweaks */
        @media (max-width: 1100px) {
          .employee-header .display-3 { font-size: 1.6rem; }
          td, th { font-size: 1rem; padding: 0.9rem; }
          .header-actions { margin-left: 12px; }
        }
        @media (max-width: 640px) {
          .employee-header { padding: 1rem; }
          .employee-header .display-3 { font-size: 1.25rem; }
          .employee-card { min-height: 60vh; }
          .table-area { max-height: calc(92vh - 160px); }
          .actions-td { justify-content:flex-start; }
        }
      `}</style>

      <div className="employee-page">
        <div className="gradient-anim" aria-hidden />

        <div className="employee-card" role="region" aria-label="Employee Directory">
          <header className="employee-header">
            <EmpTrackLogo size={48} />
            <div className="title-wrap">
              <h1 className="display-3">EmpTrack — Employee Directory</h1>
              {/* <div className="subtitle">{loading ? 'Loading employees…' : `Displaying ${normalized.length} employee${normalized.length !== 1 ? 's' : ''}`}</div> */}
            </div>

            <div className="header-actions">
              <button className="btn-emp btn-add" onClick={AddNewEmployee} aria-label="Add employee">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add
              </button>
            </div>
          </header>

          <div className="table-area">
            <table className="table" aria-live="polite">
              <thead className="table-head">
                <tr>
                  <th style={{ width: '25%' }}>First Name</th>
                  <th style={{ width: '25%' }}>Last Name</th>
                  <th style={{ width: '35%' }}>Email</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center">Loading employees...</td>
                  </tr>
                ) : normalized.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No employees found.</td>
                  </tr>
                ) : (
                  normalized.map(emp => (
                    <tr key={emp.id}>
                      <td className="name-cell">{emp.firstName}</td>
                      <td className="role-cell">{emp.lastName}</td>
                      <td>{emp.email && emp.email !== '—' ? <a className="email-link" href={`mailto:${emp.email}`}>{emp.email}</a> : <span className="text-muted">No email</span>}</td>
                      <td className="actions-td">
                        {/* Update  button  */}
                        <button className="btn-emp btn-update" onClick={() => UpdateEmployee(emp.id)} aria-label={`Update ${emp.firstName}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M3 21v-3.75L14.06 6.19a2 2 0 0 1 2.82 0l1.94 1.94a2 2 0 0 1 0 2.82L7.75 22H3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Edit
                        </button>
                        {/* Delete button */}
                        <button className="btn-emp btn-delete" onClick={() => DeleteEmployee(emp.id)} aria-label={`Delete ${emp.firstName}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="employee-footer">EmpTrack · Total employees: {normalized.length} · © {new Date().getFullYear()}</div>
        </div>
      </div>
    </>
  );
}
