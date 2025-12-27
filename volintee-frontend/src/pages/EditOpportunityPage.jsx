import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOpportunity, updateOpportunity } from '../utils/api';

const EditOpportunityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    availability: 'flexible',
    startDate: '',
    endDate: '',
    volunteersNeeded: '',
    skillsRequired: '',
    interests: '',
    requirements: '',
    newImages: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getOpportunity(id);
        if (result.success) {
          const opp = result.data;
          setFormData({
            title: opp.title || '',
            description: opp.description || '',
            category: opp.category || '',
            availability: opp.availability || 'flexible',
            startDate: opp.startDate ? new Date(opp.startDate).toISOString().slice(0,10) : '',
            endDate: opp.endDate ? new Date(opp.endDate).toISOString().slice(0,10) : '',
            volunteersNeeded: opp.volunteersNeeded || '',
            skillsRequired: (opp.skillsRequired || []).join(', '),
            interests: (opp.interests || []).join(', '),
            requirements: (opp.requirements || []).join(', '),
            newImages: []
          });
          setExistingImages(opp.images || []);
        } else {
          setError(result.error || 'Failed to load opportunity');
        }
      } catch (err) {
        console.error('Error loading opportunity:', err);
        setError('Failed to load opportunity');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setFormData(prev => ({ ...prev, newImages: [...prev.newImages, ...files] }));
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('availability', formData.availability);

      if (formData.startDate) data.append('startDate', formData.startDate);
      if (formData.endDate) data.append('endDate', formData.endDate);
      if (formData.volunteersNeeded) data.append('volunteersNeeded', formData.volunteersNeeded);

      // Arrays
      if (formData.skillsRequired) {
        formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean).forEach(skill => {
          data.append('skillsRequired[]', skill);
        });
      }

      if (formData.interests) {
        formData.interests.split(',').map(s => s.trim()).filter(Boolean).forEach(interest => {
          data.append('interests[]', interest);
        });
      }

      if (formData.requirements) {
        formData.requirements.split(',').map(s => s.trim()).filter(Boolean).forEach(req => {
          data.append('requirements[]', req);
        });
      }

      // New images (will be appended server-side)
      formData.newImages.forEach(file => data.append('opportunityImages', file));

      const response = await updateOpportunity(id, data);
      if (response.success) {
        navigate(`/opportunities/${id}`);
      } else {
        setError(response.error || 'Failed to update opportunity');
      }
    } catch (err) {
      console.error('Error updating opportunity:', err);
      setError(err.response?.data?.message || 'Failed to update opportunity');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-accent-green/10 px-8 py-6 border-b border-accent-green/10">
            <h1 className="text-2xl font-bold text-gray-900">Edit Opportunity</h1>
            <p className="text-gray-600 mt-1">Update details for your opportunity</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="e.g. Weekend Beach Cleanup"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="Describe what volunteers will be doing..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-accent-green transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Volunteers Needed</label>
                  <input
                    type="number"
                    name="volunteersNeeded"
                    value={formData.volunteersNeeded}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-accent-green transition-colors"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
            </section>

            {/* Logistics */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Logistics</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-accent-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-accent-green transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability Type *</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-accent-green transition-colors"
                  required
                >
                  <option value="flexible">Flexible</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="both">Both</option>
                </select>
              </div>

            </section>

            {/* Details */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required (comma separated)</label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="e.g. Teaching, First Aid, Driving"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Interests (comma separated)</label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="e.g. Education, Youth, Outdoors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma separated)</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="e.g. Must be 18+, Background check required"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Images</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-sm text-gray-600">Choose Files</span>
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" multiple />
                  </label>

                  <div className="flex gap-3">
                    {existingImages.map((img, i) => (
                      <div key={i} className="h-16 w-16 rounded-lg overflow-hidden border border-gray-200">
                        <img src={img} alt={`Existing ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}

                    {imagePreviews.map((p, i) => (
                      <div key={`new-${i}`} className="h-16 w-16 rounded-lg overflow-hidden border border-gray-200">
                        <img src={p} alt={`New ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-accent-green text-white px-8 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update Opportunity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOpportunityPage;
