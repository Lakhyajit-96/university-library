"use client";

import { useState } from "react";

export default function TestImageKit() {
  const [testUrl, setTestUrl] = useState("https://ik.imagekit.io/lclakhyajit/books/covers/Eloquent_Javascript_yFULsSCFj.jpg");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test-image?url=${encodeURIComponent(testUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to test image', details: error });
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ImageKit URL Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test URL:</label>
          <input
            type="text"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          onClick={testImage}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Image URL"}
        </button>
        
        {result && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold mb-2">Test Result:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="font-bold mb-2">Direct Image Test:</h3>
          <img
            src={testUrl}
            alt="Test image"
            className="max-w-xs border rounded"
            onLoad={() => console.log("Image loaded successfully")}
            onError={(e) => console.error("Image failed to load:", e)}
          />
        </div>
      </div>
    </div>
  );
}
