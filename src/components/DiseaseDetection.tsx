'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { PlantDisease } from '@/types';
import { plantDiseaseService } from '@/services/plantDiseaseService';

const DiseaseDetection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [diseases, setDiseases] = useState<PlantDisease[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setDiseases([]);

    try {
      // Use mock data for now (replace with actual API call)
      const mockDiseases = plantDiseaseService.getMockDiseaseData();
      setDiseases(mockDiseases);
      
      // Uncomment when API is ready:
      // const detectedDiseases = await plantDiseaseService.identifyDisease(selectedFile);
      // setDiseases(detectedDiseases);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Disease detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDiseases([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔍 Plant Disease Detection</h2>
        <p className="text-gray-600 mb-6">
          Upload a clear photo of your plant&apos;s affected area to get AI-powered disease identification and treatment recommendations.
        </p>

        {/* File Upload Area */}
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              previewUrl ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {previewUrl ? (
              <div className="space-y-4">
                <Image
                  src={previewUrl}
                  alt="Plant preview"
                  width={400}
                  height={256}
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                />
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      analyzeImage();
                    }}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Image'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-4">📸</div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, JPEG up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better results:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Take photos in good lighting conditions</li>
            <li>• Focus on the affected area (leaves, stems, fruits)</li>
            <li>• Include both healthy and diseased parts for comparison</li>
            <li>• Ensure the image is clear and not blurry</li>
          </ul>
        </div>
      </div>

      {/* Results */}
      {diseases.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Detection Results</h3>
          {diseases.map((disease) => (
            <div key={disease.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{disease.name}</h4>
                  <p className="text-gray-600">{disease.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(disease.severity)}`}>
                  {disease.severity.toUpperCase()} SEVERITY
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">🔍 Symptoms</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {disease.symptoms.map((symptom, index) => (
                      <li key={index}>• {symptom}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-2">🔬 Causes</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {disease.causes.map((cause, index) => (
                      <li key={index}>• {cause}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-2">💊 Treatment</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {disease.treatment.map((treatment, index) => (
                      <li key={index}>• {treatment}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-2">🛡️ Prevention</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {disease.prevention.map((prevention, index) => (
                      <li key={index}>• {prevention}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">🌾 Affected Crops</h5>
                <div className="flex flex-wrap gap-2">
                  {disease.affectedCrops.map((crop, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection; 