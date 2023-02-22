import React, { useEffect, useState } from "react";

const App = () => {
  const [Data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  //total documents length
  const [count, setcount] = useState("");
  const pageSize = 15;
  const totalPages = Math.ceil(count / pageSize);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        `http://localhost:5000/users?page=${page}&limit=${pageSize}`
      );
      const data = await response.json();
      setData(data.results);
      setIsLoading(false);
      setcount(data.count.count);
    };

    fetchUsers();
  }, [page]);

  const handelpage = (newPage) => {
    if (newPage < 0 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  if (isLoading) return <div> Loading....</div>;
  return (
    <div>
      <table id="customers">
        <thead>
          <tr>
            <th> Name </th>
            <th> ID </th>
          </tr>
        </thead>
        <tbody>
          {Data.map((d) => (
            <tr key={d._id}>
              <td> {d.name}</td>
              <td> {d._id.slice(10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => handelpage(1)}
          disabled={isLoading || page === 1}
        >
          First{" "}
        </button>
        <button
          onClick={() => handelpage(page + 1)}
          disabled={isLoading || page === totalPages}
        >
          Next{" "}
        </button>
        <button
          onClick={() => handelpage(page - 1)}
          disabled={isLoading || page === 1}
        >
          Previous{" "}
        </button>
        <button
          onClick={() => handelpage(totalPages)}
          disabled={isLoading || page === totalPages}
        >
          Last{" "}
        </button>
      </div>
    </div>
  );
};

export default App;
