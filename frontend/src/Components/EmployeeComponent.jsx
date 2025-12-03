import React, { use, useEffect, useState } from 'react';
import { useNavigate ,useParams } from 'react-router-dom';
import { createEmployee, updateEmployee } from '../Services/EmployeeService'; // your service: named export
import { getEmployeeById as getEmployee } from '../Services/EmployeeService';

// Reusable inline logo 
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

//add employee form component
export default function AddEmployeeForm({ onSubmit }) {


  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [email, setemail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();

  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '' 
  });

  const navigate = useNavigate();

//Fetch employee by ID and populate form (for edit)
useEffect(() => {
    //log the id to verify
    console.log("ID FROM PARAM:", id); 
    if (id) {
        getEmployee(id)
            .then((response) => {
                const emp = response.data;
                setfirstname(emp.firstname);
                setlastname(emp.lastname);
                setemail(emp.email);
            })
            .catch((error) => {
                console.error('Failed to fetch employee data:', error);
            });
    }
}, [id]);




  // Form validation (checks if all fields are filled)
 function validateForm() {
  let valid = true;
  const errorsCopy = { ...errors };

  if (firstname.trim()) errorsCopy.firstname = '';
  else { errorsCopy.firstname = 'First name is required.'; valid = false; }

  if (lastname.trim()) errorsCopy.lastname = '';
  else { errorsCopy.lastname = 'Last name is required.'; valid = false; }

  if (email.trim()) errorsCopy.email = '';
  else { errorsCopy.email = 'Email is required.'; valid = false; }

  setErrors(errorsCopy);
  return valid;
}

  // Handle form submission (add or update)
  const SaveOrUpdateEmployee = async (e) => {
    e.preventDefault();
    if (validateForm()) {
        const employee = {firstname: firstname.trim(),lastname: lastname.trim(),email: email.trim()};

        if (id) {
            updateEmployee(id, employee).then((res) =>{
                console.log('Employee updated:', res.data);
                navigate('/employees');
            }).catch((err) => {
                console.error('Failed to update employee:', err);
                const msg = err?.response?.data?.message || err.message || 'Failed to update employee';
                alert(msg);
            });
        }else {  setSubmitting(true);
            try {
                const res = await createEmployee(employee);
            if (onSubmit) onSubmit(res.data);
                navigate('/employees');
            } catch (err) {
                console.error('Failed to create employee:', err);
                const msg = err?.response?.data?.message || err.message || 'Failed to add employee';
                alert(msg);
            } finally {
            setSubmitting(false);
            }
        }
    }
       
};

// Dynamic page title based on add or edit
function pageTitle() {
    if (id) {
        return <h1 className="display-3">Edit Employee</h1>;
    }
    else {
        return <h1 className="display-3">Add New Employee</h1>;
    }
} 

// Dynamic button text based on add or edit
function changeButtonText() {
    if (id) {
        return  <button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Updating…' : 'Update Employee'}</button>
    } else {
        return <button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Adding…' : 'Add Employee'}</button>;
    }
}



  return (
    <>
      <style>{`
        /* Keep same overall page background + card width as list page */
        .employee-page {
          min-height: 100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:2.5rem;
          background: radial-gradient(circle at 10% 20%, rgba(47,160,140,0.10), transparent 8%),
                      radial-gradient(circle at 90% 80%, rgba(43,87,96,0.08), transparent 8%),
                      linear-gradient(135deg, #f3faf8 0%, #e8fbf9 40%, #eef7f8 100%);
        }

        .employee-card {
          position: relative;
          width: min(1400px, 96%);   /* same width as list page */
          height: auto;
          max-height: 92vh;
          border-radius: 1.25rem;
          overflow: hidden;
          display:flex;
          flex-direction:column;
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,255,254,0.95));
          box-shadow: 0 30px 80px rgba(25,50,60,0.15);
          border: 1px solid rgba(20,92,82,0.06);
        }

        .employee-header {
          display:flex;
          align-items:center;
          gap:18px;
          padding:1.25rem 1.5rem;
          background: linear-gradient(90deg, #2b5760, #1f9a8a);
          color:#fff;
        }
        .employee-header .title-wrap { display:flex; flex-direction:column; }
        .employee-header .display-3 { font-size:1.9rem; margin:0; font-weight:800; letter-spacing:-0.6px; }
        .employee-header .subtitle { margin:4px 0 0; opacity:0.95; font-size:1.02rem; }

        /* Header action buttons (Back) */
        .header-actions { margin-left:auto; display:flex; gap:10px; align-items:center; }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.18);
          color: #fff;
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          font-weight:700;
          cursor:pointer;
        }
        .btn-ghost:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }

        /* Form area matches table area width/padding */
        .form-area {
          padding: 1.25rem 2rem;
          display:flex;
          flex-direction:column;
          gap:1rem;
          overflow:auto;
          max-height: calc(92vh - 160px);
        }

        .row {
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label { font-weight:600; color:#0b3d37; margin-bottom:0.35rem; display:block; }

        input[type="text"], input[type="email"] {
          width:100%;
          padding:0.6rem 0.9rem;
          border-radius:0.7rem;
          border:1px solid rgba(20,92,82,0.12);
          font-size:1rem;
          outline:none;
          transition: box-shadow .15s, border-color .15s;
          background: linear-gradient(180deg, #fff, #fbfffe);
          color: #053335; /* ensure typed text is visible */
        }
        input::placeholder { color: rgba(5,51,53,0.45); } /* visible placeholder */
        input:focus {
          border-color: #1f9a8a;
          box-shadow: 0 0 0 6px rgba(31,154,138,0.07);
        }

        .form-actions { display:flex; gap:12px; align-items:center; margin-top:6px; }
        .btn-submit {
          padding:0.6rem 1.2rem;
          border-radius:10px;
          font-weight:700;
          border:0;
          cursor:pointer;
          background: linear-gradient(90deg,#2bbf9b,#1f9a8a);
          color:#fff;
        }
        .btn-submit[disabled] { opacity: 0.6; cursor: not-allowed; }
        .btn-cancel {
          padding:0.55rem 1rem;
          border-radius:10px;
          font-weight:700;
          border:1px solid rgba(11,94,84,0.12);
          background: white;
          color: #0b5e54;
          cursor:pointer;
        }
        .btn-submit:hover:not([disabled]), .btn-cancel:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(20,92,82,0.08); }

        .employee-footer { padding:1rem 1.5rem; text-align:right; color:#0b5e54; font-size:0.95rem; border-top:1px solid rgba(20,92,82,0.03); background: linear-gradient(180deg, rgba(255,255,255,0), rgba(245,255,252,0.6)); }

        @media (max-width: 900px) {
          .row { grid-template-columns: 1fr; }
          .employee-header .display-3 { font-size:1.6rem; }
        }
      `}</style>

      <div className="employee-page">
        <div className="employee-card" role="region" aria-label="Add Employee">
          <header className="employee-header">
            <EmpTrackLogo size={48} />
            <div className="title-wrap">
                {/* //change the title based on add or edit */}
                {
                pageTitle()
                }
              <div className="subtitle">Fill in employee details</div>
            </div>

            <div className="header-actions">
              <button className="btn-ghost" onClick={() => navigate('/employees')}>← Back to Directory</button>
            </div>
          </header>

          <form className="form-area" onSubmit={SaveOrUpdateEmployee}>
            <div className="row">
                {/* first name input part */}
              <div>
                <label htmlFor="first">First Name</label>
                <input
                        id="first"
                        type="text"
                        placeholder="Enter first name"
                        value={firstname}
                        className={`form-control ${errors.firstname ? 'is-invalid' : ''}`} 
                        onChange={e => setfirstname(e.target.value)}
                        disabled={submitting}
                        />
                        {errors.firstname && (
                        <div className="invalid-feedback">{errors.firstname}</div> 
                        )}
              </div>
                {/* last name input part    */}
              <div>
                <label htmlFor="last">Last Name</label>
                <input
                  id="last"
                  type="text"
                  placeholder="Enter last name"
                  value={lastname}
                  className={`form-control ${errors.lastname ? 'is-invalid' : ''}`} 
                  onChange={e => setlastname(e.target.value)}
                  disabled={submitting}
                />
                {errors.lastname && (
                  <div className="invalid-feedback">{errors.lastname}</div>
                )}
              </div>
            </div>
             {/* email input part    */}
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                onChange={e => setemail(e.target.value)}
                disabled={submitting}
              />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
            </div>

            <div className="form-actions">
              {
                changeButtonText()
              }
              <button type="button" className="btn-cancel" onClick={() => navigate('/employees')} disabled={submitting}>Cancel</button>
            </div>
          </form>

          <div className="employee-footer">EmpTrack · © {new Date().getFullYear()}</div>
        </div>
      </div>
    </>
  );
}
