"use client";

import React from "react";
import { motion } from "framer-motion";

const LoadingSkeleton = () => {
  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Left Section - Loading Skeleton */}
        <div className="profile-section">
          <div className="id-card-container">
            <div className="id-card-top-bar"></div>
            <div className="profile-header-horizontal">
              <div className="profile-photo">
                <div className="w-30 h-30 bg-dark-600 rounded-full animate-pulse"></div>
                <div className="profile-details-below-photo space-y-2 mt-4">
                  <div className="h-4 bg-dark-600 rounded animate-pulse"></div>
                  <div className="h-4 bg-dark-600 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="profile-info-horizontal space-y-3">
                <div className="h-6 bg-dark-600 rounded animate-pulse"></div>
                <div className="h-4 bg-dark-600 rounded animate-pulse"></div>
                <div className="h-4 bg-dark-600 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="university-id-card">
              <div className="h-32 bg-dark-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Right Section - Loading Skeleton */}
        <div className="borrowed-books-section">
          <div className="section-header">
            <div className="h-8 bg-dark-600 rounded animate-pulse w-48"></div>
          </div>
          <div className="books-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="borrowed-book-card">
                <div className="h-64 bg-dark-600 rounded animate-pulse"></div>
                <div className="space-y-2 mt-3">
                  <div className="h-4 bg-dark-600 rounded animate-pulse"></div>
                  <div className="h-4 bg-dark-600 rounded animate-pulse"></div>
                  <div className="h-4 bg-dark-600 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="col-span-full flex flex-col items-center justify-center py-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Something went wrong</h3>
            <p className="text-light-100 mb-8 max-w-md">{error}</p>
            <button
              onClick={onRetry}
              className="bg-primary text-dark-100 px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export { LoadingSkeleton, ErrorState };
