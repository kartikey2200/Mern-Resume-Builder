import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await api.properties.getMyProperties();
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.properties.delete(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const updated = await api.properties.toggleFeatured(id);
      setProperties((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'for-sale': 'For Sale',
      'for-rent': 'For Rent',
      sold: 'Sold',
      pending: 'Pending',
    };
    return labels[status] || status;
  };

  if (loading) return <div className="loading">Loading your properties...</div>;

  return (
    <div className="my-properties-page">
      <div className="page-header">
        <h1>My Properties</h1>
        <button className="btn btn-success" onClick={() => navigate('/property/new')}>
          + Add New Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h2>No properties listed yet</h2>
          <p>Start listing your properties to reach potential buyers and renters</p>
          <button className="btn btn-primary" onClick={() => navigate('/property/new')}>
            List Your First Property
          </button>
        </div>
      ) : (
        <div className="my-properties-table-wrapper">
          <table className="properties-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Price</th>
                <th>Status</th>
                <th>Location</th>
                <th>Details</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id}>
                  <td>
                    <div className="table-property-info">
                      <div className="table-property-thumb">
                        {property.images && property.images.length > 0 && property.images[0].url ? (
                          <img src={property.images[0].url} alt={property.title} />
                        ) : (
                          <div className="thumb-placeholder">No Image</div>
                        )}
                      </div>
                      <span className="table-property-title" onClick={() => navigate(`/property/${property._id}`)}>
                        {property.title}
                      </span>
                    </div>
                  </td>
                  <td className="price-cell">{formatPrice(property.price)}</td>
                  <td>
                    <span className={`badge badge-status badge-${property.status}`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </td>
                  <td>{property.address?.city}{property.address?.state ? `, ${property.address.state}` : ''}</td>
                  <td>{property.bedrooms}bd / {property.bathrooms}ba / {property.area}sqft</td>
                  <td>
                    <button
                      className={`btn btn-xs ${property.isFeatured ? 'btn-warning' : 'btn-outline'}`}
                      onClick={() => handleToggleFeatured(property._id)}
                    >
                      {property.isFeatured ? 'Featured' : 'Feature'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/property/${property._id}`)}>
                        View
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/property/${property._id}/edit`)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(property._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
