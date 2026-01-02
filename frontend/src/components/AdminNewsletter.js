import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Send, Users, Eye, FileText, Calendar, CheckCircle, XCircle, Loader } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const AdminNewsletter = () => {
  const [activeView, setActiveView] = useState('subscribers'); // subscribers, create, campaigns
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  
  // Newsletter form
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: '',
    product_id: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
    fetchProducts();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/newsletter/subscribers`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setSubscribers(response.data.subscribers || []);
      setStats({
        total: response.data.total || 0,
        active: response.data.active || 0,
        inactive: response.data.inactive || 0
      });
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to load subscribers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const adminToken = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/newsletter/campaigns`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setCampaigns(response.data.campaigns || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setNewsletterForm({ ...newsletterForm, product_id: productId });
  };

  const handleSendNewsletter = async () => {
    if (!newsletterForm.subject || !newsletterForm.content) {
      toast({
        title: "Missing Fields",
        description: "Please fill in subject and content",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Send newsletter to ${stats.active} active subscribers?`)) {
      setSending(true);
      try {
        const adminToken = localStorage.getItem('token');
        const response = await axios.post(
          `${BACKEND_URL}/api/admin/newsletter/send`,
          newsletterForm,
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );

        toast({
          title: "Newsletter Sent! 🎉",
          description: `Successfully sent to ${response.data.successful} subscribers`,
        });

        // Reset form
        setNewsletterForm({ subject: '', content: '', product_id: '' });
        setSelectedProduct(null);
        setActiveView('campaigns');
        fetchCampaigns();
      } catch (error) {
        console.error('Failed to send newsletter:', error);
        toast({
          title: "Send Failed",
          description: error.response?.data?.detail || "Failed to send newsletter",
          variant: "destructive"
        });
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">📧 Newsletter Management</h2>
        <p className="text-gray-600">Manage subscribers and send newsletters to your customers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Subscribers</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Subscribers</p>
              <p className="text-3xl font-bold mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Campaigns</p>
              <p className="text-3xl font-bold mt-1">{campaigns.length}</p>
            </div>
            <Mail className="h-12 w-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveView('subscribers')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors flex items-center justify-center space-x-2 ${
              activeView === 'subscribers'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Subscribers</span>
          </button>
          <button
            onClick={() => setActiveView('create')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors flex items-center justify-center space-x-2 ${
              activeView === 'create'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Send className="h-5 w-5" />
            <span>Create Newsletter</span>
          </button>
          <button
            onClick={() => setActiveView('campaigns')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors flex items-center justify-center space-x-2 ${
              activeView === 'campaigns'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Campaign History</span>
          </button>
        </div>

        {/* Subscribers View */}
        {activeView === 'subscribers' && (
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">All Subscribers</h3>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-orange-600" />
              </div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Mail className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No subscribers yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-900">{sub.email}</td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sub.source === 'cookie' ? 'bg-blue-100 text-blue-800' :
                            sub.source === 'checkout' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {sub.source}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {sub.is_active ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center text-gray-500">
                              <XCircle className="h-4 w-4 mr-1" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(sub.subscribed_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create Newsletter View */}
        {activeView === 'create' && (
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Newsletter</h3>
            
            <div className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={newsletterForm.subject}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, subject: e.target.value })}
                  placeholder="e.g., New Product Launch - Special Offer!"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={newsletterForm.content}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, content: e.target.value })}
                  placeholder="Write your newsletter content here..."
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Product Selection (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Product (Optional)
                </label>
                <select
                  value={newsletterForm.product_id}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">No product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Product Preview */}
              {selectedProduct && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Featured Product Preview:</p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{selectedProduct.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{selectedProduct.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Send Button */}
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-gray-600">
                  This newsletter will be sent to <strong>{stats.active} active subscribers</strong>
                </p>
                <button
                  onClick={handleSendNewsletter}
                  disabled={sending || !newsletterForm.subject || !newsletterForm.content}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Newsletter</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Campaign History View */}
        {activeView === 'campaigns' && (
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Campaign History</h3>
            
            {campaigns.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No campaigns sent yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">{campaign.subject}</h4>
                        <p className="text-sm text-gray-600 mt-1">{campaign.content.substring(0, 150)}...</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    {campaign.product_name && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                        <span className="font-medium">Featured:</span>
                        <span>{campaign.product_name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(campaign.sent_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {campaign.recipients_count} recipients
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletter;
