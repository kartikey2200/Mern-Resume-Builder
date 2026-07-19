import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PropertyList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    sort: 'newest',
  });

  useEffect(() => {
    loadProperties();
  }, [page, filters.sort]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      const data = await api.properties.getAll(params);
      setProperties(data.properties);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadProperties();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      propertyType: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      sort: 'newest',
    });
    setPage(1);
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

  const getTypeLabel = (type) => {
    const labels = {
      house: 'House',
      apartment: 'Apartment',
      condo: 'Condo',
      townhouse: 'Townhouse',
      land: 'Land',
      commercial: 'Commercial',
    };
    return labels[type] || type;
  };

  return (
    <div className="property-list-page">
      <div className="page-header">
        <h1>Find Your Perfect Property</h1>
        <p className="page-subtitle">Browse {total} properties available</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search properties by name, description, city..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="filters-grid">
          <div className="form-group">
            <label>Property Type</label>
            <select value={filters.propertyType} onChange={(e) => handleFilterChange('propertyType', e.target.value)}>
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
              <option value="">All</option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="form-group">
            <label>Min Price</label>
            <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Max Price</label>
            <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Bedrooms</label>
            <select value={filters.bedrooms} onChange={(e) => handleFilterChange('bedrooms', e.target.value)}>
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" placeholder="City" value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Sort By</label>
            <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <div className="form-group filter-actions">
            <label>&nbsp;</label>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {user && (
        <div className="create-bar">
          <button className="btn btn-success" onClick={() => navigate('/property/new')}>
            + Add New Property
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h2>No properties found</h2>
          <p>Try adjusting your filters or check back later</p>
          {user && (
            <button className="btn btn-primary" onClick={() => navigate('/property/new')}>
              List Your Property
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="properties-grid">
            {properties.map((property) => (
              <div key={property._id} className="property-card" onClick={() => navigate(`/property/${property._id}`)}>
                <div className="property-card-image">
                  {property.images && property.images.length > 0 && property.images[0].url ? (
                    <img src={property.images[0].url} alt={property.title} />
                  ) : (
                    <div className="property-card-placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="property-card-badges">
                    <span className={`badge badge-status badge-${property.status}`}>
                      {getStatusLabel(property.status)}
                    </span>
                    <span className="badge badge-type">{getTypeLabel(property.propertyType)}</span>
                  </div>
                  {property.isFeatured && <span className="badge badge-featured">Featured</span>}
                </div>
                <div className="property-card-body">
                  <h3 className="property-card-title">{property.title}</h3>
                  <p className="property-card-price">{formatPrice(property.price)}</p>
                  <p className="property-card-location">
                    {property.address?.city}{property.address?.state ? `, ${property.address.state}` : ''}
                  </p>
                  <div className="property-card-specs">
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>{property.area} sqft</span>
                  </div>
                  {user && property.user?._id === user._id && (
                    <div className="property-card-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/property/${property._id}/edit`)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(property._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button className="btn btn-outline btn-sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyList;
