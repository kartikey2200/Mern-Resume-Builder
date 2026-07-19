import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const PropertyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  const [property, setProperty] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'house',
    status: 'for-sale',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    yearBuilt: 0,
    images: [],
    amenities: [],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      loadProperty();
    }
  }, [id, isNew]);

  const loadProperty = async () => {
    try {
      const data = await api.properties.getOne(id);
      setProperty({
        ...data,
        price: data.price || '',
      });
    } catch (err) {
      setError(err.message);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProperty((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setProperty((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setProperty((prev) => ({
      ...prev,
      images: [...prev.images, { url: newImageUrl, caption: newImageCaption }],
    }));
    setNewImageUrl('');
    setNewImageCaption('');
  };

  const handleRemoveImage = (index) => {
    setProperty((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    setProperty((prev) => ({
      ...prev,
      amenities: [...prev.amenities, newAmenity.trim()],
    }));
    setNewAmenity('');
  };

  const handleRemoveAmenity = (index) => {
    setProperty((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...property,
        price: Number(property.price),
        bedrooms: Number(property.bedrooms),
        bathrooms: Number(property.bathrooms),
        area: Number(property.area),
        yearBuilt: Number(property.yearBuilt),
      };

      if (isNew) {
        const created = await api.properties.create(payload);
        navigate(`/property/${created._id}`);
      } else {
        const updated = await api.properties.update(id, payload);
        setProperty(updated);
        navigate(`/property/${updated._id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading property...</div>;

  const commonAmenities = [
    'Parking', 'Pool', 'Gym', 'Garden', 'AC', 'Heating',
    'Laundry', 'Storage', 'Balcony', 'Fireplace', 'Garage',
    'Smart Home', 'Security', 'Elevator', 'Pet Friendly',
  ];

  return (
    <div className="property-editor">
      <div className="editor-header-bar">
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>
          Back
        </button>
        <h2>{isNew ? 'Add New Property' : 'Edit Property'}</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Property Title *</label>
            <input
              type="text"
              value={property.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              placeholder="Beautiful 3BR House in Downtown"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={property.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your property..."
              rows={4}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                value={property.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
                min="0"
                placeholder="250000"
              />
            </div>
            <div className="form-group">
              <label>Property Type</label>
              <select value={property.propertyType} onChange={(e) => handleChange('propertyType', e.target.value)}>
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
              <select value={property.status} onChange={(e) => handleChange('status', e.target.value)}>
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Location</h3>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              value={property.address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={property.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="New York"
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={property.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                placeholder="NY"
              />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                value={property.address.zipCode}
                onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                placeholder="10001"
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={property.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                placeholder="USA"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Property Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                value={property.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                value={property.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Area (sqft)</label>
              <input
                type="number"
                value={property.area}
                onChange={(e) => handleChange('area', e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Year Built</label>
              <input
                type="number"
                value={property.yearBuilt}
                onChange={(e) => handleChange('yearBuilt', e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Images</h3>
          {property.images.length > 0 && (
            <div className="images-preview-grid">
              {property.images.map((img, i) => (
                <div key={i} className="image-preview-item">
                  <img src={img.url} alt={img.caption || `Image ${i + 1}`} />
                  {img.caption && <p className="image-caption">{img.caption}</p>}
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveImage(i)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="add-image-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Image URL</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group flex-2">
                <label>Caption (optional)</label>
                <input
                  type="text"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  placeholder="Front view"
                />
              </div>
              <div className="form-group">
                <label>&nbsp;</label>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleAddImage}>
                  Add Image
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Amenities</h3>
          {property.amenities.length > 0 && (
            <div className="amenities-tags">
              {property.amenities.map((amenity, i) => (
                <span key={i} className="amenity-tag">
                  {amenity}
                  <button type="button" onClick={() => handleRemoveAmenity(i)}>x</button>
                </span>
              ))}
            </div>
          )}
          <div className="form-row">
            <div className="form-group flex-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add amenity"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
              />
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-primary btn-sm" onClick={handleAddAmenity}>
                Add
              </button>
            </div>
          </div>
          <div className="common-amenities">
            <p>Quick add:</p>
            {commonAmenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                className="amenity-quick-btn"
                onClick={() => {
                  if (!property.amenities.includes(amenity)) {
                    setProperty((prev) => ({
                      ...prev,
                      amenities: [...prev.amenities, amenity],
                    }));
                  }
                }}
                disabled={property.amenities.includes(amenity)}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Contact Name</label>
              <input
                type="text"
                value={property.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="text"
                value={property.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                value={property.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isNew ? 'Create Property' : 'Update Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyEditor;
