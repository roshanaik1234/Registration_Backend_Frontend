const Dashboard = () => {
  const token = sessionStorage.getItem("token");

  const handleJWT = async () => {
    try {
      if (!token) {
        alert("No token found");
        return;
      }

      const res = await fetch("http://localhost:3000/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        alert("Done");
      } else {
        alert("Authentication failed");
      }
    } catch (err) {
      console.error(err);
      alert("error");
    }
  };

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <button onClick={handleJWT}>check Auth condition</button>
    </div>
  );
};

export default Dashboard;