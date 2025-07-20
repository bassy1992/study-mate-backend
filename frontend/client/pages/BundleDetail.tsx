import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  Download,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient, type Bundle } from '@shared/api';

export default function BundleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBundle = async () => {
      if (!slug) {
        setError('Bundle not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching bundle with slug:', slug);
        console.log('API base URL:', 'http://127.0.0.1:8000');
        
        // Test if API client is working
        const testUrl = `/api/ecommerce/bundles/${slug}/`;
        console.log('Full API URL:', `http://127.0.0.1:8000${testUrl}`);
        
        const response = await apiClient.getBundle(slug);
        console.log('Bundle response:', response);
        
        setBundle(response);
      } catch (err: any) {
        console.error('Failed to fetch bundle:', err);
        setError(err.message || 'Failed to load bundle');
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [slug]);

  const handlePurchase = () => {
    if (!bundle) return;
    navigate(`/checkout?bundle=${bundle.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bundle details...</p>
        </div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Bundle Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested bundle could not be found.'}</p>
          <Button onClick={() => navigate('/bundles')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bundles
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/bundles')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bundles
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bundle Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={bundle.bundle_type === 'bece_prep' ? 'default' : 'secondary'}>
                        {bundle.bundle_type === 'bece_prep' ? 'BECE Prep' : 'JHS Course'}
                      </Badge>
                      {bundle.is_featured && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          <Star className="mr-1 h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {bundle.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">{bundle.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">{bundle.course_count}</p>
                    <p className="text-xs text-gray-500">Courses</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Self-paced</p>
                    <p className="text-xs text-gray-500">Learning</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">1000+</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="text-center">
                    <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Certificate</p>
                    <p className="text-xs text-gray-500">Included</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">What's Included:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Interactive lessons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Practice exercises</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Video explanations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Progress tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Mobile access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Lifetime access</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <PlayCircle className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Introduction to Mathematics</h4>
                          <p className="text-sm text-gray-500">5 lessons • 45 minutes</p>
                        </div>
                      </div>
                      <Badge variant="outline">Preview</Badge>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <PlayCircle className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">Algebra Fundamentals</h4>
                          <p className="text-sm text-gray-500">8 lessons • 1 hour 20 minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <PlayCircle className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">Geometry Basics</h4>
                          <p className="text-sm text-gray-500">6 lessons • 55 minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card>
              <CardHeader>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {parseFloat(bundle.original_price) > parseFloat(bundle.discounted_price) && (
                      <span className="text-lg text-gray-500 line-through">
                        GHS {bundle.original_price}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-gray-900">
                      GHS {bundle.discounted_price}
                    </span>
                  </div>
                  {parseFloat(bundle.original_price) > parseFloat(bundle.discounted_price) && (
                    <Badge variant="destructive" className="mb-4">
                      Save GHS {(parseFloat(bundle.original_price) - parseFloat(bundle.discounted_price)).toFixed(2)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handlePurchase}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Purchase Bundle
                </Button>
                <div className="text-center text-sm text-gray-500">
                  <p>30-day money-back guarantee</p>
                  <p>Instant access after purchase</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bundle Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">
                    {bundle.bundle_type === 'bece_prep' ? 'BECE Preparation' : 'JHS Level'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">Self-paced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Access:</span>
                  <span className="font-medium">Lifetime</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate:</span>
                  <span className="font-medium">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile App:</span>
                  <span className="font-medium">Included</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}