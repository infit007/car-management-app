import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ make: '', model: '', year: '', color: '' });

  // Fetch cars when the component mounts
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    axios
      .get('http://localhost:5000/cars', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => setCars(response.data))
      .catch((error) => console.error(error));
  };

  // Handle form inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission to add a car
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        'http://localhost:5000/cars',
        { ...form },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
        setCars([...cars, response.data]); // Add the new car to the list
        setForm({ make: '', model: '', year: '', color: '' }); // Reset the form
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Car Management Dashboard</h1>

      {/* Add Car Form */}
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Add a New Car</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="make"
            placeholder="Make"
            value={form.make}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={form.model}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Car
        </button>
      </form>

      {/* Car List */}
      <h2 className="text-2xl font-bold mb-4">Available Cars</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Make</th>
            <th className="border border-gray-300 px-4 py-2">Model</th>
            <th className="border border-gray-300 px-4 py-2">Year</th>
            <th className="border border-gray-300 px-4 py-2">Color</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car._id} className="text-center hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{car.make}</td>
              <td className="border border-gray-300 px-4 py-2">{car.model}</td>
              <td className="border border-gray-300 px-4 py-2">{car.year}</td>
              <td className="border border-gray-300 px-4 py-2">{car.color}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
