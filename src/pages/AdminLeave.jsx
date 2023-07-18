import React, { useEffect, useState } from "react";
import Header from "../sections/Header";
import axios from "axios";
import { API_URL } from "../API_URL";
import Loading from "../sections/Loading";
import { useSelector } from "react-redux";
import "../styles/pages/Homepage.scss";

const AdminLeave = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const user = useSelector((state) => state.user.user);

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/api/leave`);
      setIsLoading(false);
      setDataTable(res.data.data);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchLeaves();
    }
  }, [user]);

  const updateLeaveStatus = async (leaveId, status) => {
    try {
      setIsLoading(true);
      await axios.put(`${API_URL}/api/leave/${leaveId}`, { status });
      setIsLoading(false);
      alert("Leave status updated successfully");
      fetchLeaves(); // Refresh leaves after status update
    } catch (error) {
      alert("Failed to update leave status");
    }
  };

  const deleteLeave = async (leaveId) => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/api/leave/${leaveId}`);
      setIsLoading(false);
      alert("Leave deleted successfully");
      fetchLeaves(); // Refresh leaves after deletion
    } catch (error) {
      alert("Failed to delete leave");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="register chamcong">
      <Header />
      <div className="chamcong__wrapper">
        <div className="chamcong__heading">
          <h1>List</h1>
        </div>

        <div className="chamcong__content">
          <div className="chamcong__content-heading">
          <div className="chamcong__time chamcong__heading-item">
              Name
            </div>
            <div className="chamcong__time chamcong__heading-item">
              Date start
            </div>
            <div className="chamcong__time chamcong__heading-item">
              Date end
            </div>
            <div
              className="chamcong__time chamcong__heading-item"
              style={{
                width: "40%",
              }}
            >
              Reason
            </div>
            <div className="chamcong__time chamcong__heading-item">Status</div>
            <div className="chamcong__time chamcong__heading-item">Actions</div>
          </div>
          <div className="chamcong__content-table">
            {dataTable ? (
              dataTable.map((item, index) => {
                return (
                  <div className="chamcong__item" key={index}>
                     <div className="chamcong__item-time chamcong__heading-item">
                      {item.user.fullname}
                    </div>
                    <div className="chamcong__item-time chamcong__heading-item">
                      {formatDate(item.startDate)}
                    </div>
                    <div className="chamcong__item-time chamcong__heading-item">
                      {formatDate(item.endDate)}
                    </div>
                    <div
                      className="chamcong__item-time chamcong__heading-item"
                      style={{
                        width: "40%",
                      }}
                    >
                      {item.reason}
                    </div>
                    <div className="chamcong__item-time chamcong__heading-item">
                      <span
                        className={`status ${
                          item.status === "Pending"
                            ? "status-pending"
                            : item.status === "Approved"
                            ? "status-approved"
                            : item.status === "Rejected"
                            ? "status-rejected"
                            : ""
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="chamcong__item-time chamcong__heading-item">
                      <button
                        onClick={() => updateLeaveStatus(item._id, "Pending")}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => updateLeaveStatus(item._id, "Approved")}
                      >
                        Approved
                      </button>
                      <button
                        onClick={() => updateLeaveStatus(item._id, "Rejected")}
                      >
                        Rejected
                      </button>
                      <button onClick={() => deleteLeave(item._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No leaves found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeave;
