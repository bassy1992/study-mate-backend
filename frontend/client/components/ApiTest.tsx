import { useHealthCheck, useCourses, useBECETests } from '../hooks/useApi';

export function ApiTest() {
  const { data: health, loading: healthLoading, error: healthError } = useHealthCheck();
  const { data: courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { data: beceTests, loading: beceLoading, error: beceError } = useBECETests();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Django Backend Connection Test</h1>
      
      {/* Health Check */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Health Check</h2>
        {healthLoading && <p>Loading...</p>}
        {healthError && <p className="text-red-500">Error: {healthError}</p>}
        {health && (
          <p className="text-green-500">✅ Backend is healthy: {JSON.stringify(health)}</p>
        )}
      </div>

      {/* Courses */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Courses</h2>
        {coursesLoading && <p>Loading courses...</p>}
        {coursesError && <p className="text-red-500">Error: {coursesError}</p>}
        {courses && (
          <div>
            <p className="text-green-500">✅ Courses loaded: {courses.count} total</p>
            {courses.results.length > 0 && (
              <ul className="mt-2 space-y-1">
                {courses.results.slice(0, 3).map(course => (
                  <li key={course.id} className="text-sm">
                    • {course.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* BECE Tests */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">BECE Tests</h2>
        {beceLoading && <p>Loading BECE tests...</p>}
        {beceError && <p className="text-red-500">Error: {beceError}</p>}
        {beceTests && (
          <div>
            <p className="text-green-500">✅ BECE tests loaded: {beceTests.count} total</p>
            {beceTests.results.length > 0 && (
              <ul className="mt-2 space-y-1">
                {beceTests.results.slice(0, 3).map(test => (
                  <li key={test.id} className="text-sm">
                    • {test.title} ({test.subject})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}