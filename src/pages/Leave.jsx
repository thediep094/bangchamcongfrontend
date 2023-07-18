import React, { useEffect, useState } from "react";
import Header from "../sections/Header";
import axios from "axios";
import { API_URL } from "../API_URL";
import Loading from "../sections/Loading";
import { useSelector } from "react-redux";
import "../styles/pages/Homepage.scss";

const Leave = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [leaveForm, setLeaveForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/api/leave/${user?._id}`);
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

  const handleCreate = async () => {
    try {
      if (!user?._id) {
        alert("You need to login");
      } else {
        setIsLoading(true);
        const res = await axios.post(`${API_URL}/api/leave`, {
          user: user?._id,
          ...leaveForm,
        });
        setIsLoading(false);
        alert("Successfully created leave");
      }
    } catch (error) {
      alert("Failed to create leave");
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
      <div className="register__wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="register__form">
            <form>
              <h1>Report</h1>

              <div className="input_field">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  placeholder="Start Date"
                  required
                  onChange={(e) => {
                    setLeaveForm({
                      ...leaveForm,
                      startDate: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="input_field">
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  placeholder="End Date"
                  required
                  onChange={(e) => {
                    setLeaveForm({
                      ...leaveForm,
                      endDate: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="input_field">
                <textarea
                  name="reason"
                  placeholder="Reason"
                  id="reason"
                  onChange={(e) => {
                    setLeaveForm({
                      ...leaveForm,
                      reason: e.target.value,
                    });
                  }}
                  required
                ></textarea>
              </div>
            </form>

            <div className="login-sucess" onClick={() => handleCreate()}>
              Create Leave
            </div>
          </div>
        )}
      </div>

      <div className="chamcong__wrapper">
        <div className="chamcong__heading">
          <h1>List</h1>
        </div>

        <div className="chamcong__content">
          <div className="chamcong__content-heading">
            <div className="chamcong__time chamcong__heading-item">
              Date start
            </div>
            <div className="chamcong__time chamcong__heading-item">
              Date end
            </div>
            <div
              className="chamcong__time chamcong__heading-item"
              style={{
                width: "50%",
              }}
            >
              Reason
            </div>
            <div className="chamcong__time chamcong__heading-item">Status</div>
          </div>
          <div className="chamcong__content-table">
            {dataTable ? (
              dataTable.map((item, index) => {
                return (
                  <div className="chamcong__item" key={index}>
                    <div className="chamcong__item-time chamcong__heading-item">
                      {formatDate(item.startDate)}
                    </div>
                    <div className="chamcong__item-time chamcong__heading-item">
                      {formatDate(item.endDate)}
                    </div>
                    <div
                      className="chamcong__item-time chamcong__heading-item"
                      style={{
                        width: "50%",
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

export default Leave;
