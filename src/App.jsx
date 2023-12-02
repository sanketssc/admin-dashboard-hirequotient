import { useEffect, useState } from "react";
import "./App.css";
import { FaRegEdit, FaSave } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import {
  MdNavigateNext,
  MdNavigateBefore,
  MdLastPage,
  MdFirstPage,
  MdOutlineDelete,
} from "react-icons/md";
import { CiSearch } from "react-icons/ci";
function App() {
  const [userData, setUserData] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editableId, setEditableId] = useState(-1);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  useEffect(() => {
    async function init() {
      const res = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await res.json();
      setUserData(data);
      setFilteredData(data);
    }
    init();
  }, []);

  useEffect(() => {
    setFilteredData(
      userData.filter((d) => {
        if (
          d.name.includes(searchText) ||
          d.email.includes(searchText) ||
          d.role.includes(searchText)
        ) {
          return d;
        }
      })
    );
  }, [searchText, userData]);

  const pageSize = 10;
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pages = [1];
  for (let i = 2; i <= totalPages; i++) {
    pages.push(i);
  }

  let sidx = (currPage - 1) * pageSize; // 20
  let eidx = sidx + pageSize;
  const paginatedUsers = filteredData.slice(sidx, eidx);

  return (
    <div className="container">
      <header>
        <label htmlFor="search">
          <input
            type="text"
            name="search"
            id="search"
            //if want search directly without pressing enter
            // onInput={(e) => {
            //   setSearchText(e.target.value);
            // }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchText(e.target.value);
              }
            }}
            placeholder="Enter Search Text here"
          />
          <button
            id="searchbtn"
            onClick={() => {
              const search = document.getElementById("search");
              console.log(search.value);
              setSearchText(search.value);
            }}
          >
            <CiSearch />
          </button>
        </label>

        <button
          onClick={() => {
            if (selectedUsers.length === 0) {
              return;
            } else {
              selectedUsers.forEach((user) => {
                setUserData((prev) => prev.filter((us) => us !== user));
              });
              if (
                selectedUsers.length === paginatedUsers.length &&
                currPage === totalPages
              ) {
                setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : prev));
              }
              setSelectedUsers([]);
            }
          }}
          title="Delete Selected"
        >
          <MdOutlineDelete color="red" size={30} />
        </button>
      </header>
      <div className="main-container">
        <div className="row">
          <div>
            <label htmlFor="selectall">
              <input
                type="checkbox"
                name="selectall"
                id="selectall"
                checked={
                  selectedUsers.length > 0 &&
                  selectedUsers.length === paginatedUsers.length
                }
                onChange={() => {
                  if (selectedUsers.length === pageSize) {
                    setSelectedUsers([]);
                  } else {
                    setSelectedUsers([]);
                    setSelectedUsers(paginatedUsers);
                  }
                }}
              />
            </label>
          </div>
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Actions</div>
        </div>
        {paginatedUsers.map((user) => {
          return (
            <div
              key={user.id}
              className="row"
              style={{
                backgroundColor: selectedUsers.find((us) => us === user)
                  ? "rgba(180, 180, 255, 0.500)"
                  : "",
              }}
            >
              <div>
                <label htmlFor={user.id}>
                  <input
                    className="selectbutton"
                    type="checkbox"
                    name={user.name}
                    id={user.id}
                    checked={
                      selectedUsers.find((us) => us === user) ? true : false
                    }
                    onChange={() => {
                      const x = selectedUsers.find((us) => us === user);
                      if (x) {
                        setSelectedUsers((prev) =>
                          prev.filter((us) => user !== us)
                        );
                      } else {
                        setSelectedUsers((prev) => [...prev, user]);
                      }
                    }}
                  />
                </label>
              </div>
              {/* <span>{user.id}</span> */}
              <div
                contentEditable={user.id === editableId}
                onInput={(e) => {
                  setEditName(e.target.innerText);
                }}
                style={{
                  border: user.id === editableId ? "1px solid gray" : "none",
                  borderRadius: "4px",
                }}
                suppressContentEditableWarning
              >
                {user.name}
              </div>
              <div
                contentEditable={user.id === editableId}
                onInput={(e) => {
                  setEditEmail(e.target.innerText);
                }}
                style={{
                  border: user.id === editableId ? "1px solid gray" : "none",
                  borderRadius: "4px",
                }}
                suppressContentEditableWarning
              >
                {user.email}
              </div>
              <div
                contentEditable={user.id === editableId}
                onInput={(e) => {
                  setEditRole(e.target.innerText);
                }}
                style={{
                  border: user.id === editableId ? "1px solid gray" : "none",
                  borderRadius: "4px",
                }}
                suppressContentEditableWarning
              >
                {user.role}
              </div>
              <div className="actions">
                <button
                  onClick={() => {
                    setEditEmail(user.email);
                    setEditName(user.name);
                    setEditRole(user.role);
                    setEditableId(user.id);
                  }}
                  title="Edit this item"
                >
                  <FaRegEdit size={20} color="green" />
                </button>
                {editableId === user.id && (
                  <button
                    onClick={() => {
                      setUserData((prev) =>
                        prev.map((us) => {
                          if (us.id === user.id) {
                            us.name = editName;
                            us.email = editEmail;
                            us.role = editRole;
                          }
                          return us;
                        })
                      );
                      setEditEmail("");
                      setEditName("");
                      setEditRole("");
                      setEditableId(-1);
                    }}
                    title="Save this item"
                  >
                    <FaSave size={20} color="blue" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.filter((us) => us.id !== user.id)
                    );
                    setUserData((prev) =>
                      prev.filter((us) => us.id !== user.id)
                    );
                    if (
                      currPage === totalPages &&
                      paginatedUsers.length === 1
                    ) {
                      setCurrPage((prev) => prev - 1);
                    }
                  }}
                  title="Delete this item"
                >
                  <AiTwotoneDelete color="red" size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <footer>
        {/* <div>
          {selectedUsers.length} users selected of total {filteredData.length}
        </div> */}
        <div className="pagedetails">
          Page {currPage} of {totalPages}
        </div>
        <button
          onClick={() => {
            setCurrPage(1);
          }}
        >
          <MdFirstPage />
        </button>
        <button
          onClick={() => {
            if (currPage <= 1) return;
            setCurrPage(currPage - 1);
            setSelectedUsers([]);
            setEditableId(-1);
          }}
        >
          <MdNavigateBefore />
        </button>
        {/* {currPage}/{totalPages} */}
        {pages.map((page) => {
          return (
            <button
              key={page}
              onClick={() => setCurrPage(page)}
              style={{
                backgroundColor:
                  page === currPage ? "rgba(200, 200, 255, 1)" : "",
              }}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => {
            if (currPage >= totalPages) return;
            setCurrPage(currPage + 1);
            setSelectedUsers([]);
            setEditableId(-1);
          }}
        >
          <MdNavigateNext />
        </button>
        <button
          onClick={() => {
            setCurrPage(totalPages);
          }}
        >
          <MdLastPage />
        </button>
      </footer>
    </div>
  );
}

export default App;
